import { useState, useEffect } from "react";
import { ShoppingListData, ShoppingListItem } from "@/types/shoppingList";
import { DataState } from "@/types/userData";
import { useAuthentication } from "@/hooks/useAuthentication";
import ShoppingListService from "@/services/ShoppingListService";
import { generateItemId } from "@/utils/id";

interface UseShoppingListDetailReturn {
  listData: ShoppingListData | null;
  state: DataState;
  isSyncing: boolean;
  addItem: (name: string, quantity?: number, unit?: string, notes?: string, productId?: string, slug?: string) => Promise<boolean>;
  updateItem: (itemId: string, updates: Partial<ShoppingListItem>) => void;
  toggleItem: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  reorderItems: (itemIds: string[]) => void;
  forceRefresh: () => Promise<boolean>;
}

export const useShoppingListDetail = (listId: string): UseShoppingListDetailReturn => {
  const { sessionService } = useAuthentication();
  const [listData, setListData] = useState<ShoppingListData | null>(null);
  const [state, setState] = useState<DataState>(DataState.IDLE);
  const [isSyncing, setIsSyncing] = useState(false);
  const service = ShoppingListService.getInstance();

  // Configure service with session service when available
  useEffect(() => {
    if (sessionService) {
      service.setSessionService(sessionService);
      loadListData();
    }
  }, [sessionService, listId]);

  const loadListData = async () => {
    if (!listId) return;

    console.log(`🛒 useShoppingListDetail: Loading data for list ${listId}`);
    setState(DataState.LOADING);

    try {
      const result = await service.getShoppingListData(listId);
      setListData(result.data);
      setState(result.state);
      console.log(`🛒 useShoppingListDetail: Data loaded for list ${listId}:`, result.data?.items?.length, "items");

      // Si hay un handler de sync, iniciar sincronización en background
      if (result.syncHandler) {
        result.syncHandler(
          (updatedData) => {
            console.log("🛒 useShoppingListDetail: Received sync update");
            setListData(updatedData);
          },
          (syncing) => {
            setIsSyncing(syncing);
          }
        );
      }
    } catch (error) {
      console.error("🛒 useShoppingListDetail: Error loading list data:", error);
      setState(DataState.ERROR);
    }
  };

  const addItem = async (name: string, quantity?: number, unit?: string, notes?: string, productId?: string, slug?: string): Promise<boolean> => {
    if (!listData) return false;

    console.log(`🛒 useShoppingListDetail: Adding item to list ${listId}:`, name, { productId, slug });
    const itemId = generateItemId();
    // Create optimistic item
    const optimisticItem: ShoppingListItem = {
      id: itemId,
      name: name.trim(),
      quantity,
      unit,
      notes,
      productId,
      slug,
      purchased: false,
      addedAt: new Date().toISOString()
    };

    const optimisticItems = [optimisticItem, ...listData.items];

    try {
      // Update cache with the same data as UI to maintain consistency
      const updatedListData = {
        ...listData,
        items: optimisticItems,
        updatedAt: new Date().toISOString()
      };
      // 1. Update cache immediately to keep it in sync with UI
      await service.updateCacheWithOptimisticData(listId, updatedListData);

      // 2. Apply optimistic update immediately to UI
      setListData(updatedListData);

      // 3. Perform server operation in background with final ID
      const success = await service.addItemToList({ listId, itemName: name, quantity, unit, notes, productId, slug, clientItemId: itemId });

      if (success) {
        console.log(`🛒 useShoppingListDetail: Item added successfully, cache and UI in sync`);
      } else {
        // Revert both UI and cache on failure
        const revertedData = { ...listData, items: listData.items };
        setListData(revertedData);
        await service.updateCacheWithOptimisticData(listId, revertedData);
      }
      return success;
    } catch (error) {
      console.error("🛒 useShoppingListDetail: Error adding item, reverting:", error);
      // Revert both UI and cache on error
      const revertedData = { ...listData, items: listData.items };
      setListData(revertedData);
      await service.updateCacheWithOptimisticData(listId, revertedData);
      return false;
    }
  };

  const updateItem = (itemId: string, updates: Partial<ShoppingListItem>): void => {
    if (!listData) return;

    console.log(`🛒 useShoppingListDetail: Updating item ${itemId} optimistically`);

    // 1. Apply optimistic update immediately to UI
    const optimisticItems = listData.items.map(item => {
      if (item.id === itemId) {
        return { ...item, ...updates };
      }
      return item;
    });

    const updatedListData = {
      ...listData,
      items: optimisticItems,
      updatedAt: new Date().toISOString()
    };
    setListData(updatedListData);

    // 2. Update cache immediately and perform server update in background
    service.updateCacheWithOptimisticData(listId, updatedListData).then(() => {
      return service.updateItemInList(listId, itemId, updates);
    }).then(success => {
      if (success) {
        console.log(`🛒 useShoppingListDetail: Item updated successfully, cache and UI in sync`);
      } else {
        console.error("🛒 useShoppingListDetail: Update failed, but trusting optimistic update");
      }
    }).catch(error => {
      console.error("🛒 useShoppingListDetail: Error updating item:", error);
    });
  };

  const toggleItem = (itemId: string): void => {
    if (!listData) return;

    console.log(`🛒 useShoppingListDetail: Toggling item ${itemId} optimistically`);

    // 1. Apply optimistic update to UI
    const optimisticItems = listData.items.map(item => {
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

    const updatedListData = {
      ...listData,
      items: optimisticItems,
      updatedAt: new Date().toISOString()
    };
    setListData(updatedListData);

    // 2. Update cache immediately; Remote provider enqueues snapshot for background sync
    service.updateCacheWithOptimisticData(listId, updatedListData)
      .then(() => {
        console.log('🛒 useShoppingListDetail: Toggle enqueued for background sync (snapshot saved)');
      })
      .catch(error => {
        console.error('🛒 useShoppingListDetail: Error saving toggle snapshot:', error);
      });
  };
  const removeItem = (itemId: string): void => {
    if (!listData) return;

    console.log(`🛒 useShoppingListDetail: Removing item ${itemId} optimistically`);

    // 1. Apply optimistic removal to UI
    const optimisticItems = listData.items.filter(item => item.id !== itemId);

    const updatedListData = {
      ...listData,
      items: optimisticItems,
      updatedAt: new Date().toISOString()
    };
    setListData(updatedListData);

    // 2. Update cache immediately and perform server update in background
    service.updateCacheWithOptimisticData(listId, updatedListData).then(() => {
      return service.removeItemFromList(listId, itemId);
    }).then(success => {
      if (success) {
        console.log(`🛒 useShoppingListDetail: Remove successful, cache and UI in sync`);
      } else {
        console.error("🛒 useShoppingListDetail: Remove failed, but trusting optimistic update");
      }
    }).catch(error => {
      console.error("🛒 useShoppingListDetail: Error removing item:", error);
    });
  };

  const reorderItems = (itemIds: string[]): void => {
    if (!listData) return;

    console.log(`🛒 useShoppingListDetail: Reordering items optimistically:`, itemIds);

    // 1. Apply optimistic reordering to UI
    const reorderedItems = itemIds.map(id => listData.items.find(item => item.id === id)).filter(Boolean) as ShoppingListItem[];

    const updatedListData = {
      ...listData,
      items: reorderedItems,
      updatedAt: new Date().toISOString()
    };
    setListData(updatedListData);

    // 2. Update cache immediately and perform server reorder in background
    service.updateCacheWithOptimisticData(listId, updatedListData).then(() => {
      return service.reorderItems(listId, itemIds);
    }).then(success => {
      if (success) {
        console.log(`🛒 useShoppingListDetail: Reorder successful, cache and UI in sync`);
      } else {
        console.error("🛒 useShoppingListDetail: Reorder failed, but trusting optimistic update");
      }
    }).catch(error => {
      console.error("🛒 useShoppingListDetail: Error reordering items:", error);
    });
  };

  const forceRefresh = async (): Promise<boolean> => {
    if (!listId) return false;
    console.log(`🛒 useShoppingListDetail: Force refreshing list ${listId} from remote`);
    setIsSyncing(true);
    setState(DataState.LOADING);
    try {
      const remoteData = await service.forceRefreshListData(listId);
      if (remoteData) {
        setListData(remoteData);
        setState(DataState.IDLE);
        return true;
      }
      setState(DataState.ERROR);
      return false;
    } catch (e) {
      console.error("🛒 useShoppingListDetail: Force refresh error:", e);
      setState(DataState.ERROR);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };
  return {
    listData,
    state,
    isSyncing,
    addItem,
    updateItem,
    toggleItem,
    removeItem,
    reorderItems,
    forceRefresh
  };
};
