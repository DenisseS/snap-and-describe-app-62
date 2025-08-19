
import { DropboxConfig, TokenData } from '../../types/dropbox-auth';
import { DROPBOX_APP_FOLDER_PATH } from '../../constants/dropbox';

export class DropboxAPI {
  constructor(private config: DropboxConfig) {}

  async refreshAccessToken(refreshToken: string): Promise<TokenData | null> {
    try {
      console.log('🔐 Refreshing access token...');
      const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.config.clientId,
        }),
      });

      if (!response.ok) {
        console.error('🔐 Token refresh failed:', response.status);
        return null;
      }

      const data = await response.json();
      
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Date.now() + (data.expires_in * 1000)
      };
      
    } catch (error) {
      console.error('🔐 Error refreshing token:', error);
      return null;
    }
  }

  async exchangeCodeForToken(code: string, codeVerifier: string): Promise<TokenData | null> {
    try {
      const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: this.config.clientId,
          redirect_uri: this.config.redirectUri,
          code_verifier: codeVerifier,
        }),
      });

      if (!response.ok) {
        throw new Error('Token exchange failed');
      }

      const data = await response.json();
      
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Date.now() + (data.expires_in * 1000)
      };
    } catch (error) {
      console.error('Token exchange error:', error);
      return null;
    }
  }

  // Ensure app root folder exists at user root and cache its id
  async ensureAppFolder(accessToken: string): Promise<void> {
    try {
      // 1) Try to get metadata by path
      const metaResp = await fetch('https://api.dropboxapi.com/2/files/get_metadata', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: DROPBOX_APP_FOLDER_PATH,
          include_deleted: false,
        }),
      });

      if (metaResp.ok) {
        const meta = await metaResp.json();
        return;
      }

      // If not found (409), create it
      if (metaResp.status === 409) {
        const createResp = await fetch('https://api.dropboxapi.com/2/files/create_folder_v2', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: DROPBOX_APP_FOLDER_PATH,
            autorename: false,
          }),
        });

        if (createResp.ok) {
          await createResp.json();
          return;
        } else {
          const text = await createResp.text().catch(() => '');
          console.error('📁 Failed to create app folder:', createResp.status, text);
        }
      } else {
        const text = await metaResp.text().catch(() => '');
        console.error('📁 Failed to get app folder metadata:', metaResp.status, text);
      }
    } catch (e) {
      console.error('📁 ensureAppFolder error:', e);
    }
  }

  private buildDropboxPath(relativePath: string): string {
    const cleanRel = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    // Always use absolute path under the fixed app folder. Do NOT append subpaths to id:... (unsupported by Dropbox)
    // Guard against callers already providing the absolute app path to avoid double prefixing
    if (cleanRel === DROPBOX_APP_FOLDER_PATH || cleanRel.startsWith(`${DROPBOX_APP_FOLDER_PATH}/`)) {
      return cleanRel;
    }
    return `${DROPBOX_APP_FOLDER_PATH}${cleanRel}`;
  }

  async downloadFile(accessToken: string, path: string): Promise<Response> {
    const fullPath = this.buildDropboxPath(path);
    return fetch('https://content.dropboxapi.com/2/files/download', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Dropbox-API-Arg': JSON.stringify({ path: fullPath }),
      },
    });
  }

  async uploadFile(accessToken: string, path: string, content: string, mode: 'add' | 'overwrite' = 'add'): Promise<Response> {
    const fullPath = this.buildDropboxPath(path);
    return fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Dropbox-API-Arg': JSON.stringify({
          path: fullPath,
          mode,
          autorename: false
        }),
        'Content-Type': 'application/octet-stream',
      },
      body: content,
    });
  }

  async deleteFile(accessToken: string, path: string): Promise<Response> {
    const fullPath = this.buildDropboxPath(path);
    return fetch('https://api.dropboxapi.com/2/files/delete_v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: fullPath }),
    });
  }

  async createFolder(accessToken: string, path: string): Promise<Response> {
    const fullPath = this.buildDropboxPath(path);
    return fetch('https://api.dropboxapi.com/2/files/create_folder_v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        path: fullPath,
        autorename: false 
      }),
    });
  }

  // Sharing API methods
  async addFolderMember(accessToken: string, folderPath: string, email: string, accessLevel: 'editor' | 'viewer' = 'editor'): Promise<Response> {
    const fullPath = this.buildDropboxPath(folderPath);
    return fetch('https://api.dropboxapi.com/2/sharing/add_folder_member', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shared_folder_id: fullPath, // Will be resolved by Dropbox
        members: [{
          member: { '.tag': 'email', email },
          access_level: { '.tag': accessLevel }
        }]
      }),
    });
  }

  async listFolderMembers(accessToken: string, folderPath: string): Promise<Response> {
    const fullPath = this.buildDropboxPath(folderPath);
    return fetch('https://api.dropboxapi.com/2/sharing/list_folder_members', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shared_folder_id: fullPath
      }),
    });
  }

  async removeFolderMember(accessToken: string, folderPath: string, email: string): Promise<Response> {
    const fullPath = this.buildDropboxPath(folderPath);
    return fetch('https://api.dropboxapi.com/2/sharing/remove_folder_member', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shared_folder_id: fullPath,
        member: { '.tag': 'email', email },
        leave_a_copy: false
      }),
    });
  }

  async shareFolderByPath(accessToken: string, folderPath: string): Promise<Response> {
    const fullPath = this.buildDropboxPath(folderPath);
    return fetch('https://api.dropboxapi.com/2/sharing/share_folder', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: fullPath,
        access_level: { '.tag': 'editor' }
      }),
    });
  }
}
