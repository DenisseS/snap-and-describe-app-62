
import { ShoppingList, ShoppingListData } from '@/types/shoppingList';
import SessionService from '@/services/SessionService';
import { GenericShoppingListProvider } from './GenericShoppingListProvider';
import { SHOPPING_LIST_CACHE_KEYS } from '@/constants/cacheKeys';
import { QueueClient } from '@/services/sw/QueueClient';
import { DROPBOX_APP_FOLDER_PATH } from "@/constants/dropbox.ts";

export class RemoteShoppingListProvider extends GenericShoppingListProvider {
  constructor(sessionService: SessionService) {
    super(sessionService);
  }

  // Nueva implementación con sync
  protected async getListsDetails(): Promise<{ lists: Record<string, ShoppingList> }> {
    // Primero intentar cache local
    const localData = this.sessionService.getLocalFile(SHOPPING_LIST_CACHE_KEYS.LOCAL_SHOPPING_LISTS);

    if (localData) {
      console.log('🛒 RemoteProvider: Using local cache for lists metadata');
      return localData;
    }

    // Si no hay cache local, cargar de remoto con sync
    console.log('🛒 RemoteProvider: Loading lists metadata from remote with sync');
    const result = await this.sessionService.getFile(SHOPPING_LIST_CACHE_KEYS.REMOTE_SHOPPING_LISTS_PATH);
    const profileData = result.data || { lists: {} };

    // Guardar en cache local para próximas veces
    const listsData = { lists: profileData.shoppingLists || {} };
    this.sessionService.setLocalFile(SHOPPING_LIST_CACHE_KEYS.LOCAL_SHOPPING_LISTS, listsData);

    return listsData;
  }

  private resolveListPath(listId: string, syncRef?: { path: string }): string {
    if (syncRef?.path) {
      return syncRef.path;
    }
    // New folder-based structure: /NutriInfo/lists/{listId}/shopping-list.json
    return `${DROPBOX_APP_FOLDER_PATH}${SHOPPING_LIST_CACHE_KEYS.REMOTE_LIST_PREFIX}${listId}/shopping-list.json`;
  }

  private resolveListFolderPath(listId: string): string {
    return `${DROPBOX_APP_FOLDER_PATH}${SHOPPING_LIST_CACHE_KEYS.REMOTE_LIST_PREFIX}${listId}`;
  }

  // Update inmediato del cache local + background sync
  protected async saveListsDetails(metadata: { lists: Record<string, ShoppingList> }): Promise<void> {
    console.log('🛒 RemoteProvider: Saving lists metadata optimistically');

    // 1. Update cache local inmediato (igual que LocalProvider)
    this.sessionService.setLocalFile(SHOPPING_LIST_CACHE_KEYS.LOCAL_SHOPPING_LISTS, metadata);

    // 2. Background sync fire-and-forget
    const profileData = { shoppingLists: metadata.lists };
    this.sessionService.updateFile(SHOPPING_LIST_CACHE_KEYS.REMOTE_SHOPPING_LISTS_PATH, profileData);
  }

  // Cache local como fuente de verdad con sync handler
  protected async getListData(listId: string): Promise<ShoppingListData | null> {
    // Get metadata to resolve correct path
    const metadata = await this.getListsDetails();
    const listMeta = metadata.lists[listId];
    
    // Primero intentar cache local
    const localKey = `${SHOPPING_LIST_CACHE_KEYS.LOCAL_LIST_DATA_PREFIX}${listId}`;
    const localData = this.sessionService.getLocalFile(localKey);

    if (localData) {
      console.log(`🛒 RemoteProvider: Using local cache for list ${listId}`);
      return localData;
    }

    // Si no hay cache local, intentar cargar de remoto
    console.log(`🛒 RemoteProvider: Loading list ${listId} from remote`);
    const result = await this.sessionService.getFile(this.resolveListPath(listId, listMeta?.syncRef));

    if (result.data) {
      // Guardar en cache local para próximas veces
      this.sessionService.setLocalFile(localKey, result.data);
    }

    return result.data;
  }

  // Override del método getShoppingLists para añadir syncHandler
  async getShoppingLists(): Promise<{
    data: Record<string, ShoppingList>;
    state: any;
    syncHandler?: (onUpdate: (data: Record<string, ShoppingList>) => void, onSyncStatusChange: (isSyncing: boolean) => void) => void;
  }> {
    const result = await super.getShoppingLists();

    // Si hay data de cache, añadir sync handler
    if (result.data && Object.keys(result.data).length > 0) {
      return {
        ...result,
        syncHandler: (onUpdate, onSyncStatusChange) => {
          this.performListsMetadataSync(onUpdate, onSyncStatusChange);
        }
      };
    }

    return result;
  }

  // Override del método para añadir syncHandler
  async getShoppingListData(listId: string): Promise<{
    data: ShoppingListData | null;
    state: any;
    syncHandler?: (onUpdate: (data: ShoppingListData) => void, onSyncStatusChange: (isSyncing: boolean) => void) => void;
  }> {
    const result = await super.getShoppingListData(listId);

    // Si hay data de cache, añadir sync handler
    if (result.data) {
      return {
        ...result,
        syncHandler: (onUpdate, onSyncStatusChange) => {
          this.performListSync(listId, onUpdate, onSyncStatusChange);
        }
      };
    }

    return result;
  }

  // Sincronización específica para metadata de listas
  private async performListsMetadataSync(
    onUpdate: (data: Record<string, ShoppingList>) => void,
    onSyncStatusChange: (isSyncing: boolean) => void
  ): Promise<void> {
    console.log('🛒 RemoteProvider: Starting background sync for lists metadata...');
    onSyncStatusChange(true);

    try {
      const filePath = SHOPPING_LIST_CACHE_KEYS.REMOTE_SHOPPING_LISTS_PATH;
      const result = await this.sessionService.getFile(filePath);

      if (result.syncHandler) {
        result.syncHandler(
          (updatedProfileData) => {
            console.log('🛒 RemoteProvider: Lists metadata updated from remote sync');
            // Actualizar cache local
            const listsData = { lists: updatedProfileData.shoppingLists || {} };
            this.sessionService.setLocalFile(SHOPPING_LIST_CACHE_KEYS.LOCAL_SHOPPING_LISTS, listsData);
            // Notificar a la UI
            onUpdate(listsData.lists);
          },
          onSyncStatusChange
        );
      } else {
        onSyncStatusChange(false);
      }
    } catch (error) {
      console.error('🛒 RemoteProvider: Error in lists metadata sync:', error);
      onSyncStatusChange(false);
    }
  }

  // Sincronización específica para listas
  private async performListSync(
    listId: string,
    onUpdate: (data: ShoppingListData) => void,
    onSyncStatusChange: (isSyncing: boolean) => void
  ): Promise<void> {
    console.log(`🛒 RemoteProvider: Starting background sync for list ${listId}...`);
    onSyncStatusChange(true);

    try {
      // Get metadata to resolve correct path
      const metadata = await this.getListsDetails();
      const listMeta = metadata.lists[listId];
      const filePath = this.resolveListPath(listId, listMeta?.syncRef);
      const result = await this.sessionService.getFile(filePath);

      if (result.syncHandler) {
        result.syncHandler(
          async (updatedData) => {
            console.log(`🛒 RemoteProvider: List ${listId} updated from remote sync`);
            const localKey = `${SHOPPING_LIST_CACHE_KEYS.LOCAL_LIST_DATA_PREFIX}${listId}`;
            const localData = this.sessionService.getLocalFile(localKey);

            const localUpdatedAt = localData?.updatedAt ? new Date(localData.updatedAt).getTime() : 0;
            const remoteUpdatedAt = updatedData?.updatedAt ? new Date(updatedData.updatedAt).getTime() : 0;

            if (remoteUpdatedAt && localUpdatedAt && remoteUpdatedAt < localUpdatedAt) {
              console.warn(`🛒 RemoteProvider: Stale remote snapshot detected for ${listId}. Deleting stale remote (best-effort) and re-enqueuing local latest.`);
              // Best-effort delete (non-blocking)
              this.sessionService.deleteFile(filePath).catch((err) =>
                console.error('🛒 RemoteProvider: Error deleting stale remote snapshot:', err)
              );
              // Always re-enqueue local latest to overwrite on Dropbox via SW queue
              if (localData) {
                QueueClient.getInstance().enqueue('shopping-lists', listId, localData);
              }
              // Keep local cache/UI as-is (newer)
              return;
            }

            // Remote is newer or local is missing → accept remote, update cache and notify UI
            this.sessionService.setLocalFile(localKey, updatedData);

            // Keep lists metadata counts in sync with the latest snapshot
            try {
              const itemCount = Array.isArray(updatedData.items) ? updatedData.items.length : 0;
              const completedCount = Array.isArray(updatedData.items)
                ? updatedData.items.filter((i) => i.purchased).length
                : 0;
              const metadata = await this.getListsDetails();
              if (metadata.lists[listId]) {
                metadata.lists[listId] = {
                  ...metadata.lists[listId],
                  itemCount,
                  completedCount,
                  updatedAt: updatedData.updatedAt || new Date().toISOString(),
                };
                await this.saveListsDetails(metadata);
              }
            } catch (err) {
              console.error(`🛒 RemoteProvider: Failed to sync metadata counts for list ${listId} from remote update:`, err);
            }

            onUpdate(updatedData);
          },
          onSyncStatusChange
        );
      } else {
        onSyncStatusChange(false);
      }
    } catch (error) {
      console.error(`🛒 RemoteProvider: Error in list sync for ${listId}:`, error);
      onSyncStatusChange(false);
    }
  }

  // Update inmediato del cache local + background sync
  protected async saveListData(listId: string, data: ShoppingListData): Promise<void> {
    console.log(`🛒 RemoteProvider: Saving list ${listId} data optimistically`);

    // 1. Update cache local inmediato (igual que LocalProvider)
    const localKey = `${SHOPPING_LIST_CACHE_KEYS.LOCAL_LIST_DATA_PREFIX}${listId}`;
    this.sessionService.setLocalFile(localKey, data);

    // 2. Enqueue to Service Worker generic queue (fire-and-forget)
    QueueClient.getInstance().enqueue('shopping-lists', listId, data);
  }

  protected async createListData(listId: string, data: ShoppingListData): Promise<void> {
    console.log(`🛒 RemoteProvider: Creating list ${listId} data optimistically`);

    // 1. Update cache local inmediato (igual que LocalProvider)
    const localKey = `${SHOPPING_LIST_CACHE_KEYS.LOCAL_LIST_DATA_PREFIX}${listId}`;
    this.sessionService.setLocalFile(localKey, data);

    // Create folder first, then file
    const folderPath = this.resolveListFolderPath(listId);
    const filePath = this.resolveListPath(listId);
    
    // Create file (SessionService will create folders as needed)
    await this.sessionService.updateFile(filePath, data);
  }

  protected async deleteListData(listId: string): Promise<void> {
    console.log(`🛒 RemoteProvider: Deleting list ${listId} optimistically`);

    // 1. Clear cache local inmediato
    const localKey = `${SHOPPING_LIST_CACHE_KEYS.LOCAL_LIST_DATA_PREFIX}${listId}`;
    this.sessionService.clearCache(localKey);

    // 2. Get metadata to resolve correct path
    const metadata = await this.getListsDetails();
    const listMeta = metadata.lists[listId];
    
    // 3. Delete entire folder if it's a local list, or just file if remote
    if (listMeta?.origin === 'remote' && listMeta.syncRef?.path) {
      // Remote list - only delete our reference
      await this.sessionService.deleteFile(listMeta.syncRef.path);
    } else {
      // Local list - delete entire folder
      const folderPath = this.resolveListFolderPath(listId);
      await this.sessionService.deleteFile(folderPath);
    }
  }

  // Force refresh a list from remote (Dropbox) and override local cache/UI
  public async forceRefreshListData(listId: string): Promise<ShoppingListData | null> {
    console.log(`🛒 RemoteProvider: Forcing refresh for list ${listId} from remote`);
    
    // Get metadata to resolve correct path
    const metadata = await this.getListsDetails();
    const listMeta = metadata.lists[listId];
    const filePath = this.resolveListPath(listId, listMeta?.syncRef);
    
    try {
      const remoteData = await this.sessionService.forceRemoteFetch(filePath);
      if (remoteData) {
        const localKey = `${SHOPPING_LIST_CACHE_KEYS.LOCAL_LIST_DATA_PREFIX}${listId}`;
        this.sessionService.setLocalFile(localKey, remoteData);

        // Keep lists metadata counts in sync with the latest snapshot
        try {
          const itemCount = Array.isArray(remoteData.items) ? remoteData.items.length : 0;
          const completedCount = Array.isArray(remoteData.items)
            ? remoteData.items.filter((i: any) => i.purchased).length
            : 0;
          const metadata = await this.getListsDetails();
          if (metadata.lists[listId]) {
            metadata.lists[listId] = {
              ...metadata.lists[listId],
              itemCount,
              completedCount,
              updatedAt: remoteData.updatedAt || new Date().toISOString(),
            };
            await this.saveListsDetails(metadata);
          }
        } catch (err) {
          console.error(`🛒 RemoteProvider: Failed to update metadata after force refresh for ${listId}:`, err);
        }

        return remoteData;
      }
      return null;
    } catch (e) {
      console.error(`🛒 RemoteProvider: Force refresh error for ${listId}:`, e);
      return null;
    }
  }

  async mergeLocalListsWithRemote(): Promise<{ success: boolean }> {
    console.log('🛒 RemoteProvider: Starting merge of local lists with remote');

    try {
      // Get local data
      const localMetadata = this.sessionService.getLocalFile(SHOPPING_LIST_CACHE_KEYS.LOCAL_SHOPPING_LISTS) || { lists: {} };

      if (Object.keys(localMetadata.lists).length === 0) {
        console.log('🛒 RemoteProvider: No local lists to merge');
        return { success: true };
      }

      console.log(`🛒 RemoteProvider: Found ${Object.keys(localMetadata.lists).length} local lists to merge`);

      // Update remote usando el nuevo patrón simplificado
      await this.saveListsDetails(localMetadata);

      // Upload individual list data files
      for (const listId of Object.keys(localMetadata.lists)) {
        const localListData = this.sessionService.getLocalFile(`${SHOPPING_LIST_CACHE_KEYS.LOCAL_LIST_DATA_PREFIX}${listId}`);
        if (localListData) {
          await this.saveListData(listId, localListData);
        }
      }

      console.log('🛒 RemoteProvider: Merge completed successfully');
      return { success: true };
    } catch (error) {
      console.error('🛒 RemoteProvider: Merge failed:', error);
      return { success: false };
    }
  }
}
