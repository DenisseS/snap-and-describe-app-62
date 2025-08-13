
import { ShoppingList, ShoppingListData, ShoppingListItem } from '@/types/shoppingList';
import { DataState } from '@/types/userData';

export interface ShoppingListResult<T> {
  data: T;
  state: DataState;
}

export interface ShoppingListOperationResult {
  success: boolean;
  listId?: string;
}

export interface CreateShoppingListParams {
  name: string;
  clientListId: string;
  description?: string;
}

export interface AddItemParams {
  listId: string;
  itemName: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  productId?: string;
  slug?: string;
  clientItemId?: string;
}

export interface ShoppingListProvider {
  getShoppingLists_deprecated?(): Promise<ShoppingListResult<Record<string, ShoppingList>>>;
  getShoppingLists(): Promise<ShoppingListResult<Record<string, ShoppingList>>>;
  getShoppingListData(listId: string): Promise<ShoppingListResult<ShoppingListData | null>>;
  createShoppingList(params: CreateShoppingListParams): Promise<ShoppingListOperationResult>;
  updateShoppingList(listId: string, updates: Partial<ShoppingList>): Promise<boolean>;
  deleteShoppingList(listId: string): Promise<boolean>;
  addItemToList(params: AddItemParams): Promise<boolean>;
  updateItemInList(listId: string, itemId: string, updates: Partial<ShoppingListItem>): Promise<boolean>;
  toggleItemPurchased(listId: string, itemId: string): Promise<boolean>;
  removeItemFromList(listId: string, itemId: string): Promise<boolean>;
  reorderItems(listId: string, itemIds: string[]): Promise<boolean>;
  reorderLists(listIds: string[]): Promise<boolean>;
  updateCacheWithOptimisticData(listId: string, data: ShoppingListData): Promise<void>;
  mergeLocalListsWithRemote?(): Promise<{ success: boolean }>;
}
