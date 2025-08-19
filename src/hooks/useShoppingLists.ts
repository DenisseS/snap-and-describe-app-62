
import { useState, useEffect } from 'react';
import { ShoppingList } from '@/types/shoppingList';
import { DataState } from '@/types/userData';
import { useAuthentication } from '@/hooks/useAuthentication';
import ShoppingListService from '@/services/ShoppingListService';
import { generateListId } from '@/utils/id';

interface UseShoppingListsReturn {
  lists: Record<string, ShoppingList>;
  state: DataState;
  isSyncing: boolean;
  createList: (name: string, description?: string) => Promise<string | null>;
  updateList: (listId: string, updates: Partial<ShoppingList>) => Promise<boolean>;
  deleteList: (listId: string) => Promise<boolean>;
  reorderLists: (listIds: string[]) => Promise<boolean>;
  addRemoteList: (remoteListInfo: {
    id: string;
    name: string;
    origin: 'remote';
    syncRef: { path: string; ownerEmail?: string };
  }) => Promise<boolean>;
}

export const useShoppingLists = (): UseShoppingListsReturn => {
  const { sessionService } = useAuthentication();
  const [lists, setLists] = useState<Record<string, ShoppingList>>({});
  const [state, setState] = useState<DataState>(DataState.IDLE);
  const [isSyncing, setIsSyncing] = useState(false);
  const service = ShoppingListService.getInstance();

  // Configure service when available and load data
  useEffect(() => {
    if (sessionService) {
      service.setSessionService(sessionService);
      loadLists();
    }
  }, []);

  const loadLists = async () => {
    try {
      console.log('🛒 loadLists->useEffect: Loading shopping lists...');
      setState(DataState.LOADING);
      const result = await service.getShoppingLists();
      setLists(result.data);
      setState(result.state);

      // Si hay syncHandler, configurar sync en background
      if (result.syncHandler) {
        console.log('🛒 useShoppingLists: Setting up background sync for lists metadata');
        result.syncHandler(
          (updatedLists) => {
            console.log('🛒 useShoppingLists: Lists metadata updated from sync:', Object.keys(updatedLists));
            setLists(updatedLists);
          },
          (syncing) => {
            console.log('🛒 useShoppingLists: Sync status changed:', syncing);
            setIsSyncing(syncing);
          }
        );
      }
    } catch (error) {
      console.error('Error loading lists:', error);
      setState(DataState.ERROR);
      setIsSyncing(false);
    }
  };

  const createList = async (name: string, description?: string): Promise<string | null> => {

    try {
      const clientListId = generateListId(name);
      const result = await service.createShoppingList({ name, description, clientListId });
      if (result.success) {
        const now = new Date().toISOString();
        const finalId = result.listId || clientListId;
        // Compute order so new lists appear first without disturbing existing relative order
        let minOrder = Infinity;
        Object.values(lists).forEach(l => {
          if (typeof l.order === 'number' && l.order < minOrder) minOrder = l.order;
        });
        const newOrder = Number.isFinite(minOrder) ? minOrder - 1 : -1;
        const newList: ShoppingList = {
          id: finalId,
          name,
          description,
          createdAt: now,
          updatedAt: now,
          itemCount: 0,
          completedCount: 0,
          order: newOrder
        };

        setLists(prev => ({ ...prev, [finalId]: newList }));
        return finalId;
      }
      return null;
    } catch (error) {
      console.error('Error creating list:', error);
      return null;
    }
  };

  const updateList = async (listId: string, updates: Partial<ShoppingList>): Promise<boolean> => {
    // Update optimista
    const originalList = lists[listId];
    if (!originalList) return false;

    const updatedList = { ...originalList, ...updates, updatedAt: new Date().toISOString() };
    setLists(prev => ({ ...prev, [listId]: updatedList }));

    try {
      const success = await service.updateShoppingList(listId, updates);
      if (!success) {
        // Revertir si falla
        setLists(prev => ({ ...prev, [listId]: originalList }));
      }
      return success;
    } catch (error) {
      console.error('Error updating list:', error);
      // Revertir si falla
      setLists(prev => ({ ...prev, [listId]: originalList }));
      return false;
    }
  };

  const deleteList = async (listId: string): Promise<boolean> => {
    // Update optimista - remover inmediatamente
    const originalLists = lists;
    setLists(prev => {
      const { [listId]: deleted, ...rest } = prev;
      return rest;
    });

    try {
      const success = await service.deleteShoppingList(listId);
      if (!success) {
        // Revertir si falla
        setLists(originalLists);
      }
      return success;
    } catch (error) {
      console.error('Error deleting list:', error);
      // Revertir si falla
      setLists(originalLists);
      return false;
    }
  };

  const reorderLists = async (listIds: string[]): Promise<boolean> => {
    // Optimistic update - reorder immediately
    const originalLists = lists;
    const reorderedLists: Record<string, ShoppingList> = {};

    listIds.forEach((listId, index) => {
      if (originalLists[listId]) {
        reorderedLists[listId] = {
          ...originalLists[listId],
          order: index,
          updatedAt: new Date().toISOString()
        };
      }
    });

    setLists(reorderedLists);

    try {
      const success = await service.reorderLists(listIds);
      if (!success) {
        // Revert if fails
        setLists(originalLists);
      }
      return success;
    } catch (error) {
      console.error('Error reordering lists:', error);
      // Revert if fails
      setLists(originalLists);
      return false;
    }
  };

  const addRemoteList = async (remoteListInfo: {
    id: string;
    name: string;
    origin: 'remote';
    syncRef: { path: string; ownerEmail?: string };
  }): Promise<boolean> => {
    try {
      console.log('🛒 useShoppingLists: Adding remote list:', remoteListInfo);
      
      const now = new Date().toISOString();
      // Create the remote list entry
      const remoteList: ShoppingList = {
        id: remoteListInfo.id,
        name: remoteListInfo.name,
        createdAt: now,
        updatedAt: now,
        itemCount: 0,
        completedCount: 0,
        origin: remoteListInfo.origin,
        syncRef: remoteListInfo.syncRef,
        order: 0 // Will be adjusted when first loaded
      };

      // Update local state optimistically
      setLists(prev => ({ ...prev, [remoteListInfo.id]: remoteList }));

      // Save to backend via service
      const success = await service.updateShoppingList(remoteListInfo.id, remoteList);
      
      if (!success) {
        // Remove from local state if backend failed
        setLists(prev => {
          const { [remoteListInfo.id]: removed, ...rest } = prev;
          return rest;
        });
      }
      
      return success;
    } catch (error) {
      console.error('🛒 useShoppingLists: Error adding remote list:', error);
      // Remove from local state on error
      setLists(prev => {
        const { [remoteListInfo.id]: removed, ...rest } = prev;
        return rest;
      });
      return false;
    }
  };

  return {
    lists,
    state,
    isSyncing,
    createList,
    updateList,
    deleteList,
    reorderLists,
    addRemoteList
  };
};
