export enum QueueState {
  IDLE = 'idle',
  PENDING = 'pending',
  PROCESSING = 'processing',
  ERROR = 'error',
}

export interface QueueItemStatus {
  id: string;
  queueName: string;
  resourceKey: string;
  status: 'pending' | 'processing' | 'error';
  lastUpdatedAt: number;
  coalesceUntil: number;
}

export interface QueueStatus {
  processing: boolean;
  items: QueueItemStatus[];
}
