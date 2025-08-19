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

    const { type, folderPath, email } = item.payload || {};

    // Ensure absolute path under the app folder
    const buildPath = (p) => {
      if (!p) return p;
      if (p.startsWith(APP_FOLDER_PATH)) return p;
      const rel = p.startsWith('/') ? p : `/${p}`;
      return `${APP_FOLDER_PATH}${rel}`;
    };

    const fullFolderPath = buildPath(folderPath);

    async function resolveSharedFolderId() {
      try {
        // 1) Try to get metadata and read shared_folder_id if already shared
        let resp = await fetch('https://api.dropboxapi.com/2/files/get_metadata', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: fullFolderPath, include_deleted: false })
        });
        if (resp.ok) {
          const meta = await resp.json();
          if (meta && meta.shared_folder_id) return meta.shared_folder_id;
        }

        // 2) Ensure folder is shared and capture id (may return async_job_id)
        resp = await fetch('https://api.dropboxapi.com/2/sharing/share_folder', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: fullFolderPath, access_level: { '.tag': 'editor' } })
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.shared_folder_id) return data.shared_folder_id;
          if (data && data.async_job_id) {
            // Poll until the job completes (bounded retries)
            for (let i = 0; i < 6; i++) {
              await new Promise(res => setTimeout(res, 600));
              const check = await fetch('https://api.dropboxapi.com/2/sharing/check_share_job_status', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ async_job_id: data.async_job_id })
              });
              if (!check.ok) break;
              const status = await check.json();
              const tag = status['.tag'];
              if (tag === 'complete' && status.shared_folder_id) return status.shared_folder_id;
              if (tag === 'failed') { console.error('SW Dropbox Sharing: share folder failed', status); break; }
            }
            console.warn('SW Dropbox Sharing: share_folder polling timed out');
            return null;
          }
        } else if (resp.status === 409) {
          // Already shared or conflict – try to find via list_folders
          const listResp = await fetch('https://api.dropboxapi.com/2/sharing/list_folders', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ limit: 200, include_audit_logs: false })
          });
          if (listResp.ok) {
            const list = await listResp.json();
            const all = [ ...(list.entries || []) ];
            const targetLower = fullFolderPath.toLowerCase();
            const found = all.find(e => e && (e.path_lower === targetLower || (e.path_lower && targetLower.endsWith(e.path_lower))));
            if (found && found.shared_folder_id) return found.shared_folder_id;
          }
        }
      } catch (e) {
        console.error('SW Dropbox Sharing: resolveSharedFolderId error', e);
      }
      return null;
    }

    try {
      let url, body;

      switch (type) {
        case 'share_folder':
          url = 'https://api.dropboxapi.com/2/sharing/share_folder';
          body = JSON.stringify({
            path: fullFolderPath,
            access_level: { '.tag': 'editor' }
          });
          break;

        case 'invite': {
          const sharedId = await resolveSharedFolderId();
          if (!sharedId) { console.warn('SW Dropbox Sharing: cannot resolve shared folder id for invite', fullFolderPath); return false; }
          url = 'https://api.dropboxapi.com/2/sharing/add_folder_member';
          body = JSON.stringify({
            shared_folder_id: sharedId,
            members: [{
              member: { '.tag': 'email', email },
              access_level: { '.tag': 'editor' }
            }]
          });
          break;
        }

        case 'remove': {
          const sharedId = await resolveSharedFolderId();
          if (!sharedId) { console.warn('SW Dropbox Sharing: cannot resolve shared folder id for remove', fullFolderPath); return false; }
          url = 'https://api.dropboxapi.com/2/sharing/remove_folder_member';
          body = JSON.stringify({
            shared_folder_id: sharedId,
            member: { '.tag': 'email', email },
            leave_a_copy: false
          });
          break;
        }

        default:
          console.error('SW Dropbox Sharing: unknown type', type);
          return false;
      }

      console.log('SW Dropbox Sharing:', type, { folderPath: fullFolderPath, email });
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
