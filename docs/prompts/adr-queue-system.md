# ADR: Offline Queue (NSQueue) and Dropbox Sync for Shopping Lists

- Status: Accepted
- Date: 2025-08-09
- Decision drivers: Offline-first UX, consistent persistence, resilience to network issues, simple client API, minimal coupling

## Context
The app must work offline, allowing users to add, edit, toggle (done), delete, and reorder shopping-list items. Remote persistence uses Dropbox. We need:
- Durable client-side persistence while offline
- Coalescing to avoid flooding remote writes
- Idempotent, ordered processing when back online
- UI feedback of queue state

## Decision
Implement a Service Worker–backed queue (NSQueue) that stores snapshot writes in IndexedDB and processes them via registered processors. The client interacts with the SW through a light QueueClient and a useQueueResource hook for UI state. A Dropbox processor overwrites a JSON file per list.

Key choices:
- Snapshot overwrite writes per list (single JSON upload) for all actions (add/modify/toggle/delete/reorder)
- Coalescing by resourceKey to keep the most recent payload and avoid redundant uploads
- Token bootstrap on app load to ensure the queue can start immediately
- Conflict resolution on remote sync: prefer newer local data; if remote is older, proactively delete the stale remote snapshot and re-enqueue/overwrite with the latest local snapshot

See diagrams:
- docs/diagrams/queue-architecture.mmd
- docs/diagrams/sequence-add-modify.mmd
- docs/diagrams/sequence-delete.mmd

## Architecture (high level)
Components:
- Client API: src/services/sw/QueueClient.ts (enqueue, status, start, stop, purge, clearAll, subscribe)
- UI State: src/hooks/useQueueResource.ts (maps SW events to QueueState)
- Service Worker core: public/sw/queue.js (NSQueue with IndexedDB, coalescing, processing loop)
- Dropbox processor: public/sw/dropbox.js (uploads list snapshots)
- SW host: public/sw.js (message routing and minimal background sync)
- Token source: src/contexts/AuthContext.tsx (bootstraps queue with access token on app init)
- Conflict resolver: src/services/shopping-list/providers/RemoteShoppingListProvider.ts (only apply remote if newer)

Message protocol (client -> SW):
- QUEUE_ENQUEUE { queueName, resourceKey, payload }
- QUEUE_STATUS { resourceKey? }
- QUEUE_START { access_token }
- QUEUE_STOP
- QUEUE_PURGE_RESOURCE { queueName, resourceKey }
- QUEUE_CLEAR_ALL

Events (SW -> client via postMessage type: 'QUEUE_EVENT'):
- ready, processing-start, processing, processed, drained, stopped, error

## Data model (IndexedDB)
Queue item (simplified):
- id: `${queueName}::${resourceKey}` (one per resource to coalesce)
- queueName: string (e.g., 'shopping-lists')
- resourceKey: string (listId)
- payload: any (entire list snapshot)
- status: 'pending' | 'processing' | 'error'
- lastUpdatedAt: number (ms)
- retries?: number
- coalesceUntil?: number

## Processing semantics
- Coalescing: enqueue upserts by id; lastUpdatedAt is advanced. During processing, if a newer lastUpdatedAt exists than what started processing, the item is kept for reprocess ("newer pending detected"), preventing stale overwrites.
- Ordering: per resourceKey, last write wins (snapshot upload). Multi-resource queues may interleave.
- Token: NSQueue.setToken(token) stored in SW; queue auto-starts on enqueue if token present.
- Retries: simple retry loop (basic; see improvements for backoff).
- Completion: when queue drains, emits 'drained'.

## Workflows
All actions share the same pattern: optimistic local cache update + single snapshot enqueue to 'shopping-lists' with resourceKey=listId.

### Add / Modify / Toggle (done)
1) UI triggers ShoppingListService to apply optimistic update to local cache.
2) Provider saves the updated list snapshot locally and enqueues via QueueClient.enqueue('shopping-lists', listId, snapshot).
3) SW stores/updates the single item in IndexedDB; if token is present, starts processing.
4) Dropbox processor uploads to `/shopping-list-${listId}.json` with overwrite.
5) On success → 'processed' event; if a newer version exists (coalesced), the loop reprocesses until the latest is uploaded; finally emits 'drained'.
6) Remote sync (SessionService/RemoteShoppingListProvider) may fetch remote data; conflict resolution keeps newer local and re-enqueues if needed.

### Delete item
1) UI removes item from the list optimistically and persists the new snapshot in local cache.
2) Enqueue snapshot exactly as above (same resourceKey). No special delete command is needed because the snapshot reflects deletion.
3) SW uploads the latest snapshot; coalescing ensures only the final state is written.

## Key implementation points
- QueueClient request/reply via MessageChannel; subscribe to 'QUEUE_EVENT'.
- IndexedDB utilities in queue.js: openDB, idbPut/getAll/get/delete, clearAll.
- Process loop checks for newer lastUpdatedAt; avoids deleting entries prematurely if newer pending exists (fix for multi-rapid updates).
- Dropbox upload uses content.dropboxapi.com/2/files/upload with overwrite mode.
- AuthContext sets token early (on init) → SW auto-starts processing; resolves race where enqueues happened before token.
- Remote provider applies remote updates only if remote.updatedAt > local.updatedAt; otherwise deletes the stale remote snapshot and re-enqueues the latest local snapshot to overwrite it.

## Known issues resolved
- Deletions lost when multiple rapid updates: fixed by checking lastUpdatedAt and retaining newer pending for reprocess.
- Toggled items reverting after refresh: resolved by conflict resolution preferring newer local snapshot and re-enqueueing.
- Token not available at enqueue time: fixed by token bootstrap at app init.

## Missing steps / Gaps
- Logout hygiene: on logout, call QueueClient.stop() and clearAll() to avoid cross-user residue; clear SW token.
- Online/backoff: formalize retry policy with exponential backoff and jitter; resume on `online` and Background Sync.
- Error propagation: standardize error codes in QUEUE_EVENT for UI to surface actionable states.
- Storage GC: add TTL/GC for stale queue items and defensive DB upgrades.
- Multi-tab coordination: use BroadcastChannel or claim() to dedupe concurrent enqueue across tabs.
- Idempotency/versioning: include a monotonic version in snapshot to detect and short-circuit no-op uploads.
- Reordering standardization: ensure reorder updates updatedAt and enqueues a single coalesced snapshot (same as add/delete) with debounce window.
- Token lifecycle: unset token on logout; refresh hook to re-set after TokenManager refreshes.

## Potential improvements
- Per-queue config: concurrency, debounce/coalesce windows, max retries.
- Metrics: emit timing counters and failure rates for observability.
- Integrity: attach checksum/etag of payload; on remote pull, compare before overwriting local.
- Structured events: include queueName/resourceKey consistently in all events ('processing-start' currently may omit these).
- Offline-first UI polish: show a badge when state is PENDING and hide when DRAINED.

## Operational notes
- SW script order: ensure public/sw/queue.js loads before public/sw/dropbox.js in sw.js.
- If SW is updated, clients will receive an update message; consider auto-refresh prompt.
- When debugging, check:
  - SW: "SW Queue: processing item" → "upload ok" → "loop finished {drained:true}"
  - Client: useQueueResource events and queue status reads

## Test plan (high level)
- Rapid add/modify/toggle/delete bursts → only latest snapshot uploaded, no reappearing items after refresh.
- Offline → perform edits → go online → queue drains and remote matches local.
- Logout → ensure queue is stopped and cleared; login → token bootstrap works.
- Multi-tab → only one SW processing, no duplicate writes.

---

Appendix A — QUEUE_EVENT reference
- ready: item registered/pending
- processing-start: loop started
- processing: item is being processed ({queueName, resourceKey})
- processed: one upload finished
- drained: queue empty
- stopped: queue stopped
- error: processing error
