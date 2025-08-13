/* Lightweight client to communicate with the Service Worker Queue */
export class QueueClient {
  private static instance: QueueClient;
  private listeners = new Set<(evt: MessageEvent) => void>();

  static getInstance(): QueueClient {
    if (!QueueClient.instance) QueueClient.instance = new QueueClient();
    return QueueClient.instance;
  }

  private async getActiveSW(): Promise<ServiceWorker | null> {
    if (!('serviceWorker' in navigator)) return null;
    const reg = await navigator.serviceWorker.getRegistration();
    return reg?.active ?? null;
  }

  private request<T = any>(type: string, payload?: any): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const sw = await this.getActiveSW();
      if (!sw) return reject(new Error('No active service worker'));
      const channel = new MessageChannel();
      channel.port1.onmessage = (e) => resolve(e.data as T);
      sw.postMessage({ type, ...(payload || {}) }, [channel.port2]);
    });
  }

  async enqueue(queueName: string, resourceKey: string, payload: any): Promise<boolean> {
    try {
      const sw = await this.getActiveSW();
      if (!sw) { console.warn('QueueClient: no active SW'); return false; }
      const channel = new MessageChannel();
      const result = new Promise<boolean>((resolve) => {
        channel.port1.onmessage = (e) => resolve(!!e.data?.ok);
      });
      console.log('QueueClient: enqueue', { queueName, resourceKey, hasPayload: !!payload });
      sw.postMessage({ type: 'QUEUE_ENQUEUE', queueName, resourceKey, payload }, [channel.port2]);
      return result;
    } catch (e) {
      console.error('QueueClient: enqueue error', e);
      return false;
    }
  }

  async status(resourceKey?: string): Promise<any> {
    const resp = await this.request('QUEUE_STATUS', { resourceKey });
    return resp?.status;
  }

  async start(accessToken: string): Promise<boolean> {
    const resp = await this.request('QUEUE_START', { access_token: accessToken });
    return !!resp?.ok;
  }

  async stop(): Promise<boolean> {
    const resp = await this.request('QUEUE_STOP');
    return !!resp?.ok;
  }

  async purgeResource(queueName: string, resourceKey: string): Promise<boolean> {
    const resp = await this.request('QUEUE_PURGE_RESOURCE', { queueName, resourceKey });
    return !!resp?.ok;
  }

  async clearAll(): Promise<boolean> {
    const resp = await this.request('QUEUE_CLEAR_ALL');
    return !!resp?.ok;
  }

  subscribe(callback: (evt: MessageEvent) => void): () => void {
    const handler = (evt: MessageEvent) => {
      if (evt.data && evt.data.type === 'QUEUE_EVENT') callback(evt);
    };
    navigator.serviceWorker.addEventListener('message', handler as any);
    this.listeners.add(handler);
    return () => {
      navigator.serviceWorker.removeEventListener('message', handler as any);
      this.listeners.delete(handler);
    };
  }
}
