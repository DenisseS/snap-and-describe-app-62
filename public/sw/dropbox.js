// Dropbox-specific processor(s) for the Service Worker queue
// Registers processors on global NSQueue

(function(){
  if (!self.NSQueue) {
    console.error('NSQueue not found. Ensure queue.js is imported before dropbox.js');
    return;
  }

  // Processor for shopping lists → uploads to Dropbox overwrite
  const APP_FOLDER_PATH = '/NutriInfo';
  self.NSQueue.registerProcessor('shopping-lists', async (item, ctx) => {
    const token = ctx && ctx.token;
    if (!token) { console.warn('SW Dropbox: missing token'); return false; }
    try {
      const path = `${APP_FOLDER_PATH}/shopping-list-${item.resourceKey}.json`;
      const body = JSON.stringify(item.payload, null, 2);
      console.log('SW Dropbox: uploading', { path, bytes: body.length });
      const resp = await fetch('https://content.dropboxapi.com/2/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Dropbox-API-Arg': JSON.stringify({ path, mode: 'overwrite', autorename: false }),
          'Content-Type': 'application/octet-stream',
        },
        body,
      });
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        console.error('SW Dropbox: upload failed', resp.status, text);
        return false;
      }
      console.log('SW Dropbox: upload ok');
      return true;
    } catch (e) {
      console.error('SW Queue: Dropbox upload error', e);
      return false;
    }
  });
})();
