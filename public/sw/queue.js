// Queue core extracted for maintainability
// Exposes global NSQueue on the Service Worker scope

(function(){
  const QUEUE_COALESCE_MS = 0;
  const IDB_NAME = 'NS_QUEUE';
  const IDB_STORE = 'events';

  // In-memory state
  let TOKEN = null; // access_token only during processing
  let PROCESSING = false;
  let STOP_REQUESTED = false;
  const COALESCE_TIMERS = new Map(); // id -> timeout
  const PROCESSORS = new Map(); // queueName -> (item, ctx) => Promise<boolean>

  // Helpers
  const makeKey = (queueName, resourceKey) => `${queueName}::${resourceKey}`;
  const postToAllClients = async (message) => {
    const clients = await self.clients.matchAll();
    clients.forEach((c) => c.postMessage({ type: 'QUEUE_EVENT', ...message }));
  };

  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbPut(event) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(event);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function idbGetAll() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbGet(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbDelete(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function clearAll() {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).clear();
      tx.oncomplete = () => resolve(true);
    });
  }

  async function enqueue(queueName, resourceKey, payload) {
    const id = makeKey(queueName, resourceKey);
    const now = Date.now();
    const coalesceUntil = now; // process immediately, no coalescing window
    const entry = {
      id,
      queueName,
      resourceKey,
      payload,
      lastUpdatedAt: now,
      coalesceUntil,
      status: 'pending', // pending | processing | error
    };
    console.log('SW Queue: enqueue', { queueName, resourceKey, lastUpdatedAt: now });
    await idbPut(entry);

    // Notify clients immediately and auto-start if we have a token
    postToAllClients({ event: 'ready', queueName, resourceKey });

    // If we already have a token and we're not processing, kick the loop right away
    if (TOKEN && !PROCESSING) {
      console.log('SW Queue: auto-starting loop after enqueue (token present)');
      start();
    }
    return true;
  }

  async function status(resourceKey) {
    const all = await idbGetAll();
    const items = all.map((e) => ({ id: e.id, queueName: e.queueName, resourceKey: e.resourceKey, status: e.status, lastUpdatedAt: e.lastUpdatedAt, coalesceUntil: e.coalesceUntil }));
    const byResource = resourceKey ? items.filter(i => i.resourceKey === resourceKey) : items;
    const snapshot = { processing: PROCESSING, items: byResource };
    console.log('SW Queue: status requested', snapshot);
    return snapshot;
  }

  async function processLoop() {
    if (PROCESSING) return;
    if (!TOKEN) {
      console.log('SW Queue: No token set, cannot start');
      return;
    }
    PROCESSING = true;
    STOP_REQUESTED = false;
    await postToAllClients({ event: 'processing-start' });
    try {
      while (!STOP_REQUESTED) {
        const all = await idbGetAll();
        const now = Date.now();
        const ready = all.filter(e => e.status === 'pending' && e.coalesceUntil <= now);

        // If nothing is ready but there are pending items, wait until the earliest coalesce time instead of draining
        if (ready.length === 0) {
          const pending = all.filter(e => e.status === 'pending');
          if (pending.length === 0) break; // truly drained
          const nextAt = Math.min(...pending.map(e => e.coalesceUntil));
          const delay = Math.max(0, nextAt - now);
          const waitMs = Math.min(delay, 2000);
          console.log('SW Queue: waiting for coalesce', { waitMs, pending: pending.length });
          if (waitMs > 0) {
            await new Promise(res => setTimeout(res, waitMs));
            continue; // re-check after waiting
          }
        }

        // Process latest item first (LIFO across ready items)
        ready.sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt);
        const item = ready[0];
        console.log('SW Queue: processing item', { queueName: item.queueName, resourceKey: item.resourceKey });
        item.status = 'processing';
        await idbPut(item);
        await postToAllClients({ event: 'processing', queueName: item.queueName, resourceKey: item.resourceKey });

        const processor = PROCESSORS.get(item.queueName);
        let ok = false;
        if (processor) {
          try {
            ok = await processor(item, { token: TOKEN });
          } catch (e) {
            console.error('SW Queue: Processor error', e);
            ok = false;
          }
        } else {
          console.warn('SW Queue: No processor for queue', item.queueName);
        }

        if (!ok) {
          console.warn('SW Queue: item failed', { queueName: item.queueName, resourceKey: item.resourceKey });
          item.status = 'error';
          await idbPut(item);
          await postToAllClients({ event: 'error', queueName: item.queueName, resourceKey: item.resourceKey });
          break;
        }

        // Check if item was updated while processing; if so, keep latest pending
        const latest = await idbGet(item.id);
        if (latest && (latest.lastUpdatedAt > item.lastUpdatedAt) && latest.status === 'pending') {
          console.log('SW Queue: newer pending detected, keeping for reprocess', { id: item.id, lastProcessedAt: item.lastUpdatedAt, latestAt: latest.lastUpdatedAt });
          // Do NOT delete; loop will pick it up in the next iteration
        } else {
          await idbDelete(item.id);
        }
        await postToAllClients({ event: 'processed', queueName: item.queueName, resourceKey: item.resourceKey });
      }
    } finally {
      const drained = (await idbGetAll()).filter(e => e.status === 'pending').length === 0;
      console.log('SW Queue: loop finished', { drained });
      PROCESSING = false;
      // Keep token to allow real-time processing of subsequent enqueues
      STOP_REQUESTED = false;
      await postToAllClients({ event: drained ? 'drained' : 'stopped' });
    }
  }

  function setToken(token) { 
    TOKEN = token || null; 
    console.log('SW Queue: setToken', { present: !!TOKEN });
  }
  function start() { 
    console.log('SW Queue: start called, processing=', PROCESSING);
    return processLoop(); 
  }
  function stop() { 
    console.log('SW Queue: stop requested');
    STOP_REQUESTED = true; TOKEN = null; 
  }

  function registerProcessor(queueName, fn) { 
    console.log('SW Queue: registerProcessor', queueName);
    PROCESSORS.set(queueName, fn); 
  }
  function purgeResource(queueName, resourceKey) { 
    console.log('SW Queue: purgeResource', { queueName, resourceKey });
    return idbDelete(makeKey(queueName, resourceKey)); 
  }

  // Expose API
  self.NSQueue = {
    enqueue,
    status,
    setToken,
    start,
    stop,
    registerProcessor,
    purgeResource,
    clearAll,
  };
})();
