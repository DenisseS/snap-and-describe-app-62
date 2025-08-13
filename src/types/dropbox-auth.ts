
export interface DropboxConfig {
  clientId: string;
  redirectUri: string;
}

// UserInfo unified with UserProfile - now using UserProfile directly from userData.ts

// Estructura interna del JSON en Dropbox
export interface UserJsonData {
  profile: {
    name: string;
    edad: number;
  };
  allergies?: Record<string, { avoid: boolean }>;
  favorites?: Record<string, { status: 'heart' | 'thumb-down' }>;
}

// Interfaz para el almacenamiento de tokens
export interface TokenData {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
}

// Metadata para cache genérico
export interface FileMetadata {
  client_modified?: string;
  last_sync?: string;
  sync_status: 'synced' | 'pending' | 'error';
}
