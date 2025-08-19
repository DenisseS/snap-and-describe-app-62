
// Cache prefixes for different data types
export const CACHE_PREFIXES = {
  USER_PREFIX: 'USER_',
  APP_PREFIX: 'APP_',
  DROPBOX_PREFIX: 'DROPBOX_',
  PWA_PREFIX: 'PWA_',
  NAV_PREFIX: 'NAV_',
  PREF_PREFIX: 'PREF_',
  LOCAL_PREFIX: 'LOCAL_',
  REMOTE_PREFIX: 'REMOTE_'
} as const;

// Shopping list cache keys
export const SHOPPING_LIST_CACHE_KEYS = {
  // Local storage keys for unauthenticated users
  LOCAL_SHOPPING_LISTS: `${CACHE_PREFIXES.LOCAL_PREFIX}SHOPPING_LISTS`,
  LOCAL_LIST_DATA_PREFIX: `${CACHE_PREFIXES.LOCAL_PREFIX}LIST_DATA_`,
  
  // Remote storage paths for authenticated users
  REMOTE_SHOPPING_LISTS_PATH: '/user-shopping-lists.json',
  REMOTE_LIST_PREFIX: '/lists/',
  
  // Cache keys for remote files
  REMOTE_CACHE_PREFIX: `${CACHE_PREFIXES.DROPBOX_PREFIX}FILE_`
} as const;
