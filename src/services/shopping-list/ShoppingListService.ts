
import { ShoppingList, ShoppingListData, ShoppingListItem } from '@/types/shoppingList';
import { DataState } from '@/types/userData';
import SessionService from '../SessionService';
import { ShoppingListProvider, ShoppingListResult, ShoppingListOperationResult, CreateShoppingListParams, AddItemParams } from './types';
import { LocalShoppingListProvider } from './providers/LocalShoppingListProvider';
import { RemoteShoppingListProvider } from './providers/RemoteShoppingListProvider';

class ShoppingListService {
  private static instance: ShoppingListService;
  private sessionService: SessionService | null = null;
  private localProvider: LocalShoppingListProvider | null = null;
  private remoteProvider: RemoteShoppingListProvider | null = null;

  private constructor() {}

  public static getInstance(): ShoppingListService {
    if (!ShoppingListService.instance) {
      ShoppingListService.instance = new ShoppingListService();
    }
    return ShoppingListService.instance;
  }

  public setSessionService(service: SessionService): void {
    this.sessionService = service;
    this.localProvider = new LocalShoppingListProvider(service);
    this.remoteProvider = new RemoteShoppingListProvider(service);
  }

  private getProvider(): ShoppingListProvider {
    if (!this.sessionService) {
      throw new Error('🛒 ShoppingListService: SessionService not configured');
    }

    if (this.sessionService.isAuthenticated()) {
      if (!this.remoteProvider) {
        throw new Error('🛒 ShoppingListService: RemoteProvider not initialized');
      }
      console.log('🛒 ShoppingListService: Using RemoteProvider');
      return this.remoteProvider;
    } else {
      if (!this.localProvider) {
        throw new Error('🛒 ShoppingListService: LocalProvider not initialized');
      }
      console.log('🛒 ShoppingListService: Using LocalProvider');
      return this.localProvider;
    }
  }

  // Delegate all methods to the appropriate provider
  public async getShoppingLists_deprecated(): Promise<ShoppingListResult<Record<string, ShoppingList>>> {
    console.log('🛒 ShoppingListService: Getting shopping lists (deprecated)...');
    return this.getProvider().getShoppingLists();
  }

  public async getShoppingLists(): Promise<ShoppingListResult<Record<string, ShoppingList>> & {
    syncHandler?: (onUpdate: (data: Record<string, ShoppingList>) => void, onSyncStatusChange: (isSyncing: boolean) => void) => void;
  }> {
    console.log('🛒 ShoppingListService: Getting shopping lists with sync...');
    const result = await this.getProvider().getShoppingLists();
    
    // Si el provider soporta sync, añadir el handler
    if ('syncHandler' in result) {
      return result as any;
    }
    
    return result;
  }

  public async getShoppingListData(listId: string): Promise<ShoppingListResult<ShoppingListData | null> & {
    syncHandler?: (onUpdate: (data: ShoppingListData) => void, onSyncStatusChange: (isSyncing: boolean) => void) => void;
  }> {
    console.log(`🛒 ShoppingListService: Getting list data for ${listId}`);
    const result = await this.getProvider().getShoppingListData(listId);
    
    // Si el provider soporta sync, añadir el handler
    if ('syncHandler' in result) {
      return result as any;
    }
    
    return result;
  }

  public async createShoppingList(params: CreateShoppingListParams): Promise<ShoppingListOperationResult> {
    console.log('🛒 ShoppingListService: Creating shopping list:', params.name);
    return this.getProvider().createShoppingList(params);
  }

  public async updateShoppingList(listId: string, updates: Partial<ShoppingList>): Promise<boolean> {
    console.log(`🛒 ShoppingListService: Updating list ${listId}:`, updates);
    return this.getProvider().updateShoppingList(listId, updates);
  }

  public async deleteShoppingList(listId: string): Promise<boolean> {
    console.log(`🛒 ShoppingListService: Deleting list ${listId}`);
    return this.getProvider().deleteShoppingList(listId);
  }

  public async addItemToList(params: AddItemParams): Promise<boolean> {
    console.log(`🛒 ShoppingListService: Adding item to list ${params.listId}:`, params.itemName, { productId: params.productId, slug: params.slug });
    return this.getProvider().addItemToList(params);
  }

  public async updateItemInList(listId: string, itemId: string, updates: Partial<ShoppingListItem>): Promise<boolean> {
    console.log(`🛒 ShoppingListService: Updating item ${itemId} in list ${listId}`);
    return this.getProvider().updateItemInList(listId, itemId, updates);
  }

  public async toggleItemPurchased(listId: string, itemId: string): Promise<boolean> {
    console.log(`🛒 ShoppingListService: Toggling item ${itemId} in list ${listId}`);
    return this.getProvider().toggleItemPurchased(listId, itemId);
  }

  public async removeItemFromList(listId: string, itemId: string): Promise<boolean> {
    console.log(`🛒 ShoppingListService: Removing item ${itemId} from list ${listId}`);
    return this.getProvider().removeItemFromList(listId, itemId);
  }

  public async reorderItems(listId: string, itemIds: string[]): Promise<boolean> {
    console.log(`🛒 ShoppingListService: Reordering items in list ${listId}:`, itemIds);
    return this.getProvider().reorderItems(listId, itemIds);
  }

  public async reorderLists(listIds: string[]): Promise<boolean> {
    console.log('🛒 ShoppingListService: Reordering lists:', listIds);
    return this.getProvider().reorderLists(listIds);
  }

  public async updateCacheWithOptimisticData(listId: string, data: ShoppingListData): Promise<void> {
    console.log(`🛒 ShoppingListService: Updating cache with optimistic data for ${listId}`);
    return this.getProvider().updateCacheWithOptimisticData(listId, data);
  }

  // Force refresh the list data from remote and override local cache
  public async forceRefreshListData(listId: string): Promise<ShoppingListData | null> {
    console.log(`🛒 ShoppingListService: Force refreshing list ${listId} from remote`);
    if (this.sessionService?.isAuthenticated() && this.remoteProvider && (this.remoteProvider as any).forceRefreshListData) {
      return (this.remoteProvider as any).forceRefreshListData(listId);
    }
    // If not authenticated, simply return current local data
    return this.getProvider().getShoppingListData(listId).then(r => r.data);
  }

  public async mergeLocalListsWithRemote(): Promise<{ success: boolean }> {
    console.log('🛒 ShoppingListService: Starting merge of local lists with remote');
    
    if (!this.remoteProvider || !this.remoteProvider.mergeLocalListsWithRemote) {
      return { success: false };
    }
    
    return this.remoteProvider.mergeLocalListsWithRemote();
  }
}

export default ShoppingListService;
