// Dropbox-specific processor(s) for the Service Worker queue
// Registers processors on global NSQueue

(function(){
  if (!self.NSQueue) {
    console.error('NSQueue not found. Ensure queue.js is imported before dropbox.js');
    return;
  }

  // Processor for shopping lists → uploads to Dropbox overwrite (new folder structure)
  const APP_FOLDER_PATH = '/NutriInfo';
  self.NSQueue.registerProcessor('shopping-lists', async (item, ctx) => {
    const token = ctx && ctx.token;
    if (!token) { console.warn('SW Dropbox: missing token'); return false; }
    try {
      // Use custom path if provided, otherwise use new folder structure
      const path = item.payload.path || `${APP_FOLDER_PATH}/lists/${item.resourceKey}/shopping-list.json`;
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

  // Processor for folder sharing operations
  self.NSQueue.registerProcessor('dropbox-sharing', async (item, ctx) => {
    const token = ctx && ctx.token;
    if (!token) { console.warn('SW Dropbox Sharing: missing token'); return false; }
    
    const { type, folderPath, email } = item.payload;
    
    try {
      let url, body;
      
      switch (type) {
        case 'share_folder':
          url = 'https://api.dropboxapi.com/2/sharing/share_folder';
          body = JSON.stringify({
            path: folderPath,
            access_level: { '.tag': 'editor' }
          });
          break;
          
        case 'invite':
          url = 'https://api.dropboxapi.com/2/sharing/add_folder_member';
          body = JSON.stringify({
            shared_folder_id: folderPath,
            members: [{
              member: { '.tag': 'email', email },
              access_level: { '.tag': 'editor' }
            }]
          });
          break;
          
        case 'remove':
          url = 'https://api.dropboxapi.com/2/sharing/remove_folder_member';
          body = JSON.stringify({
            shared_folder_id: folderPath,
            member: { '.tag': 'email', email },
            leave_a_copy: false
          });
          break;
          
        default:
          console.error('SW Dropbox Sharing: unknown type', type);
          return false;
      }
      
      console.log('SW Dropbox Sharing:', type, { folderPath, email });
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body,
      });
      
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        console.error('SW Dropbox Sharing: operation failed', resp.status, text);
        return false;
      }
      
      console.log('SW Dropbox Sharing: operation successful');
      return true;
    } catch (e) {
      console.error('SW Dropbox Sharing: error', e);
      return false;
    }
  });
})();
