import { useEffect, useState } from 'react';
import { QueueClient } from '@/services/sw/QueueClient';
import { QueueState } from '@/types/queue';

export const useQueueResource = (queueName: string, resourceKey: string) => {
  const [state, setState] = useState<QueueState>(QueueState.IDLE);

  useEffect(() => {
    let mounted = true;
    const client = QueueClient.getInstance();

    const applyStatus = (status: any) => {
      if (!mounted) return;
      const hasItems = Array.isArray(status?.items) && status.items.some((i: any) => i.resourceKey === resourceKey);
      if (status?.processing && hasItems) {
        setState(QueueState.PROCESSING);
      } else if (hasItems) {
        setState(QueueState.PENDING);
      } else {
        setState(QueueState.IDLE);
      }
    };

    // Subscribe FIRST to avoid missing terminal events between status check and listener setup
    const unsubscribe = client.subscribe((evt) => {
      const data = evt.data;
      if (data.queueName && data.queueName !== queueName) return;
      if (data.resourceKey && data.resourceKey !== resourceKey) return;
      console.log('useQueueResource: event', data);
      switch (data.event) {
        case 'ready':
          // Verify actual status for this resource (avoid false PENDING when no items)
          client.status(resourceKey).then(applyStatus).catch(() => {});
          break;
        case 'processing-start':
          // Global event: only mark processing if this resource has pending items
          client.status(resourceKey).then(applyStatus).catch(() => {});
          break;
        case 'processing':
          setState(QueueState.PROCESSING);
          break;
        case 'processed':
          // Re-check status for this resource to resolve races when events fire before initial status settles
          client.status(resourceKey).then(applyStatus).catch(() => {});
          break;
        case 'drained':
        case 'stopped':
          setState(QueueState.IDLE);
          break;
        case 'error':
          setState(QueueState.ERROR);
          break;
      }
    });

    // Initial status fetch AFTER subscribing
    client.status(resourceKey).then(applyStatus).catch(() => {});

    return () => { mounted = false; unsubscribe(); };
  }, [queueName, resourceKey]);

  return { state } as const;
};
