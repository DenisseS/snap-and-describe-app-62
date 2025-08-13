
export enum DataState {
  IDLE = 'idle',        // Sin datos, sin actividad
  LOADING = 'loading',  // Cargando por primera vez
  READY = 'ready',      // Datos disponibles y listos
  PROCESSING = 'processing', // Sincronización en background
  ERROR = 'error'       // Error en operación
}

export interface UserProfile {
  name: string;
  allergies?: Record<string, { avoid: boolean }>;
  favorites?: Record<string, { status: 'heart' | 'thumb-down' }>;
}

// Metadata para sincronización con Dropbox
export interface CacheMetadata {
  client_modified?: string;
  last_sync?: string;
  sync_status: 'synced' | 'pending' | 'error';
}

export interface UserDataState {
  profile: UserProfile | null;
  profileState: DataState;
  // Preparado para futuras extensiones
  favorites?: any[];
  favoritesState?: DataState;
  allergies?: string[];
  allergiesState?: DataState;
}

export interface UserDataOperations {
  getUserProfile: () => Promise<UserProfile | null>;
  updateUserProfile: (profile: UserProfile) => Promise<boolean>;
  updateUserFavorites: (favorites: Record<string, { status: 'heart' | 'thumb-down' }>) => Promise<boolean>;
  clearUserCache: () => void;
}
