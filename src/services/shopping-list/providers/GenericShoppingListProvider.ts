import { ShoppingList, ShoppingListData, ShoppingListItem } from "@/types/shoppingList";
import { DataState } from "@/types/userData";
import { ShoppingListProvider, ShoppingListResult, ShoppingListOperationResult, CreateShoppingListParams, AddItemParams } from "../types";
import SessionService from "@/services/SessionService";

export abstract class GenericShoppingListProvider implements ShoppingListProvider {
  constructor (protected sessionService: SessionService) {}

  // Abstract methods that must be implemented by concrete providers
  protected abstract getListsDetails (): Promise<{ lists: Record<string, ShoppingList> }>;

  protected abstract saveListsDetails (metadata: { lists: Record<string, ShoppingList> }): Promise<void>;

  protected abstract getListData (listId: string): Promise<ShoppingListData | null>;

  protected abstract saveListData (listId: string, data: ShoppingListData): Promise<void>;

  protected abstract createListData (listId: string, data: ShoppingListData): Promise<void>;

  protected abstract deleteListData (listId: string): Promise<void>;

  // Method to update cache with optimistic data
  async updateCacheWithOptimisticData (listId: string, data: ShoppingListData): Promise<void> {
    console.log(`🛒 GenericProvider: Updating cache with optimistic data for ${listId}`);
    // Persist snapshot first
    await this.saveListData(listId, data);

    // Also refresh metadata counts to keep list overview in sync
    try {
      const itemCount = Array.isArray(data.items) ? data.items.length : 0;
      const completedCount = Array.isArray(data.items) ? data.items.filter(i => i.purchased).length : 0;
      const metadata = await this.getListsDetails();
      if (metadata.lists[listId]) {
        metadata.lists[listId] = {
          ...metadata.lists[listId],
          itemCount,
          completedCount,
          updatedAt: data.updatedAt || new Date().toISOString()
        };
        await this.saveListsDetails(metadata);
      }
    } catch (err) {
      console.error(`🛒 GenericProvider: Failed to update metadata counts during optimistic cache update for ${listId}:`, err);
    }
  }

  // Public interface methods
  async getShoppingLists_deprecated (): Promise<ShoppingListResult<Record<string, ShoppingList>>> {
    console.log("🛒 GenericProvider: Getting shopping lists (deprecated)");
    try {
      const metadata = await this.getListsDetails();
      return {
        data: metadata.lists,
        state: DataState.READY
      };
    } catch (error) {
      console.error("🛒 GenericProvider: Error getting shopping lists:", error);
      return {
        data: {},
        state: DataState.ERROR
      };
    }
  }

  async getShoppingLists (): Promise<ShoppingListResult<Record<string, ShoppingList>>> {
    console.log("🛒 GenericProvider: Getting shopping lists with sync");
    try {
      const metadata = await this.getListsDetails();
      return {
        data: metadata.lists,
        state: DataState.READY
      };
    } catch (error) {
      console.error("🛒 GenericProvider: Error getting shopping lists:", error);
      return {
        data: {},
        state: DataState.ERROR
      };
    }
  }

  async getShoppingListData (listId: string): Promise<ShoppingListResult<ShoppingListData | null>> {
    console.log(`🛒 GenericProvider: Getting list data for ${listId}`);
    try {
      const data = await this.getListData(listId);
      return {
        data,
        state: DataState.READY
      };
    } catch (error) {
      console.error(`🛒 GenericProvider: Error getting list data for ${listId}:`, error);
      return {
        data: null,
        state: DataState.ERROR
      };
    }
  }

  async createShoppingList (params: CreateShoppingListParams): Promise<ShoppingListOperationResult> {
    console.log("🛒 GenericProvider: Creating shopping list:", params.name);

    try {
      const { name, description, clientListId } = params;
      const listId = clientListId;
      const now = new Date().toISOString();

      const metadata = await this.getListsDetails();
      let minOrder = Infinity;
      Object.values(metadata.lists).forEach(l => {
        if (typeof l.order === "number" && l.order < minOrder) minOrder = l.order;
      });
      const newOrder = Number.isFinite(minOrder) ? minOrder - 1 : -1;

      const newList: ShoppingList = {
        id: listId,
        name,
        description,
        createdAt: now,
        updatedAt: now,
        itemCount: 0,
        completedCount: 0,
        order: newOrder
      };

      const newListData: ShoppingListData = {
        id: listId,
        name,
        description,
        items: [],
        createdAt: now,
        updatedAt: now
      };

      metadata.lists[listId] = newList;

      await this.saveListsDetails(metadata);
      await this.createListData(listId, newListData);
      return { success: true, listId };
    } catch (error) {
      console.error("🛒 GenericProvider: Error creating list:", error);
      return { success: false };
    }
  }

  async updateShoppingList (listId: string, updates: Partial<ShoppingList>): Promise<boolean> {
    console.log(`🛒 GenericProvider: Updating list ${listId}`);

    try {
      const metadata = await this.getListsDetails();
      if (metadata.lists[listId]) {
        metadata.lists[listId] = {
          ...metadata.lists[listId],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        await this.saveListsDetails(metadata);
        return true;
      }
      return false;
    } catch (error) {
      console.error("🛒 GenericProvider: Error updating list:", error);
      return false;
    }
  }

  async deleteShoppingList (listId: string): Promise<boolean> {
    console.log(`🛒 GenericProvider: Deleting list ${listId}`);

    try {
      const metadata = await this.getListsDetails();
      delete metadata.lists[listId];

      await this.saveListsDetails(metadata);
      await this.deleteListData(listId);

      return true;
    } catch (error) {
      console.error("🛒 GenericProvider: Error deleting list:", error);
      return false;
    }
  }

  async addItemToList (params: AddItemParams): Promise<boolean> {
    try {
      const { listId, itemName, quantity, unit, notes, productId, slug, clientItemId } = params;
      console.log(`🛒 GenericProvider: Optimized addItem - atomic operation for ${listId}`);

      const listData = await this.getListData(listId);
      if (!listData) return false;

      const exists = Array.isArray(listData.items) && listData.items.some(it => it.id === clientItemId);

      const items = exists
        ? listData.items
        : [...listData.items, {
          id: clientItemId,
          name: itemName,
          quantity,
          unit,
          notes,
          purchased: false,
          addedAt: new Date().toISOString(),
          productId,
          slug
        } as ShoppingListItem];

      const updatedListData: ShoppingListData = {
        ...listData,
        items,
        updatedAt: new Date().toISOString()
      };

      await this.saveListDataAndUpdateCounts(listId, updatedListData);
      return true;
    } catch (error) {
      console.error("🛒 GenericProvider: Error adding item:", error);
      return false;
    }
  }

  async updateItemInList (listId: string, itemId: string, updates: Partial<ShoppingListItem>): Promise<boolean> {
    try {
      // OPTIMIZACIÓN: Usar operación atómica en lugar de get+update
      console.log(`🛒 GenericProvider: Optimized updateItem - atomic operation for ${listId}`);

      const listData = await this.getListData(listId);
      if (!listData) return false;
      const updatedItems = listData.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return item;
      });

      const updatedListData: ShoppingListData = {
        ...listData,
        items: updatedItems,
        updatedAt: new Date().toISOString()
      };

      await this.saveListDataAndUpdateCounts(listId, updatedListData);
      return true;
    } catch (error) {
      console.error("🛒 GenericProvider: Error updating item:", error);
      return false;
    }
  }

  async toggleItemPurchased (listId: string, itemId: string): Promise<boolean> {
    try {
      // OPTIMIZACIÓN: Usar operación atómica en lugar de get+update
      console.log(`🛒 GenericProvider: Optimized toggle - atomic operation for ${listId}`);

      const listData = await this.getListData(listId);
      if (!listData) return false;
      const updatedItems = listData.items.map(item => {
        if (item.id === itemId) {
          const purchased = !item.purchased;
          return {
            ...item,
            purchased,
            purchasedAt: purchased ? new Date().toISOString() : undefined
          };
        }
        return item;
      });

      const updatedListData: ShoppingListData = {
        ...listData,
        items: updatedItems,
        updatedAt: new Date().toISOString()
      };

      await this.saveListDataAndUpdateCounts(listId, updatedListData);
      return true;
    } catch (error) {
      console.error("🛒 GenericProvider: Error toggling item:", error);
      return false;
    }
  }

  async removeItemFromList (listId: string, itemId: string): Promise<boolean> {
    try {
      console.log(`🛒 GenericProvider: Optimized removeItem - atomic operation for ${listId}`);

      const listData = await this.getListData(listId);
      if (!listData) return false;
      const updatedItems = listData.items.filter(item => item.id !== itemId);

      const updatedListData: ShoppingListData = {
        ...listData,
        items: updatedItems,
        updatedAt: new Date().toISOString()
      };

      await this.saveListDataAndUpdateCounts(listId, updatedListData);
      return true;
    } catch (error) {
      console.error("🛒 GenericProvider: Error removing item:", error);
      return false;
    }
  }

  async reorderItems (listId: string, itemIds: string[]): Promise<boolean> {
    try {
      console.log(`🛒 GenericProvider: Optimized reorderItems - atomic operation for ${listId}`);

      const listData = await this.getListData(listId);
      if (!listData) return false;

      // Reorder items according to the provided order
      const reorderedItems = itemIds.map(id => listData.items.find(item => item.id === id)).filter(Boolean) as ShoppingListItem[];

      // Make sure we haven't lost any items in the reordering
      if (reorderedItems.length !== listData.items.length) {
        console.error(`🛒 GenericProvider: Item count mismatch during reorder. Expected ${listData.items.length}, got ${reorderedItems.length}`);
        return false;
      }

      const updatedListData: ShoppingListData = {
        ...listData,
        items: reorderedItems,
        updatedAt: new Date().toISOString()
      };

      await this.saveListDataAndUpdateCounts(listId, updatedListData);
      return true;
    } catch (error) {
      console.error("🛒 GenericProvider: Error reordering items:", error);
      return false;
    }
  }

  protected async saveListDataAndUpdateCounts (listId: string, updatedListData: ShoppingListData): Promise<void> {
    console.log(`🛒 GenericProvider: Saving list data and updating metadata counts for ${listId}`);

    // 1) Persist latest list snapshot (optimistic in each provider)
    await this.saveListData(listId, updatedListData);

    // 2) Derive counts from the snapshot and update lists metadata
    try {
      const itemCount = Array.isArray(updatedListData.items) ? updatedListData.items.length : 0;
      const completedCount = Array.isArray(updatedListData.items)
        ? updatedListData.items.filter(i => i.purchased).length
        : 0;

      const metadata = await this.getListsDetails();
      const existing = metadata.lists[listId];

      if (existing) {
        metadata.lists[listId] = {
          ...existing,
          // Only counts and updatedAt are affected by item operations
          itemCount,
          completedCount,
          updatedAt: updatedListData.updatedAt || new Date().toISOString()
        };

        await this.saveListsDetails(metadata);
      } else {
        // If metadata entry is missing, create a minimal one to avoid UI desync
        metadata.lists[listId] = {
          id: listId,
          name: updatedListData.name,
          description: updatedListData.description,
          createdAt: updatedListData.createdAt,
          updatedAt: updatedListData.updatedAt || new Date().toISOString(),
          itemCount,
          completedCount,
          order: 0
        } as any; // keep compatibility with potential extra fields
        await this.saveListsDetails(metadata);
      }
    } catch (err) {
      console.error(`🛒 GenericProvider: Failed to update lists metadata counts for ${listId}:`, err);
      // Intentionally swallow to not break UI optimistic flow
    }
  }

  async reorderLists (listIds: string[]): Promise<boolean> {
    try {
      console.log("🛒 GenericProvider: Reordering shopping lists:", listIds);

      const metadata = await this.getListsDetails();
      const reorderedLists: Record<string, ShoppingList> = {};

      // Reorder lists according to the provided order
      listIds.forEach((listId, index) => {
        if (metadata.lists[listId]) {
          reorderedLists[listId] = {
            ...metadata.lists[listId],
            order: index,
            updatedAt: new Date().toISOString()
          };
        }
      });

      await this.saveListsDetails({ lists: reorderedLists });
      return true;
    } catch (error) {
      console.error("🛒 GenericProvider: Error reordering lists:", error);
      return false;
    }
  }
}