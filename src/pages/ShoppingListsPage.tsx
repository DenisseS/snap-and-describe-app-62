import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, ShoppingCart, Calendar, Trash2 } from 'lucide-react';
import Layout from '@/components/Layout';
import LoginSuggestionBanner from '@/components/LoginSuggestionBanner';
import BaseEditModal from '@/components/BaseEditModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useShoppingLists } from '@/hooks/useShoppingLists';
import { useAuthentication } from '@/hooks/useAuthentication';
import { AuthState } from '@/types/auth';
import { DataState } from '@/types/userData';
import AuthExplanationModal from "@/components/AuthExplanationModal";
import DragDropShoppingListsPage from '@/components/DragDropShoppingListsPage';
import SyncStatusIndicator from '@/components/SyncStatusIndicator';

const ShoppingListsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { authState, sessionService } = useAuthentication();
  const { lists, state, isSyncing, createList, deleteList, reorderLists } = useShoppingLists();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showLoginBanner, setShowLoginBanner] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const isAuthenticated = authState === AuthState.AUTHENTICATED;
  const isLoading = state === DataState.LOADING;
  const isProcessing = state === DataState.PROCESSING;

  const handleCreateList = useCallback(async () => {
    if (!newListName.trim()) return;
    
    console.log('🛒 ShoppingListsPage: Creating new list:', newListName);
    
    try {
      const listId = await createList(newListName.trim(), newListDescription.trim() || undefined);
      if (listId) {
        setNewListName('');
        setNewListDescription('');
        setShowCreateDialog(false);
        console.log('🛒 ShoppingListsPage: List created successfully, navigating to detail');
        navigate(`/shopping-lists/${listId}`);
      }
    } catch (error) {
      console.error('🛒 ShoppingListsPage: Error creating list:', error);
      throw error;
    }
  }, [newListName, newListDescription, createList, navigate]);

  const handleDeleteList = useCallback(async (listId: string) => {
    console.log('🛒 ShoppingListsPage: Deleting list:', listId);
    setIsDeleting(listId);
    
    try {
      const success = await deleteList(listId);
      if (success) {
        console.log('🛒 ShoppingListsPage: List deleted successfully');
        
        // Clear cache for the deleted list
        if (sessionService) {
          // Clear both local and remote cache keys for the deleted list
          sessionService.clearCache(`LOCAL_LIST_DATA_${listId}`);
          sessionService.clearCache(`/shopping-list-${listId}.json`);
          console.log(`🛒 ShoppingListsPage: Cache cleared for deleted list ${listId}`);
        }
      } else {
        console.error('🛒 ShoppingListsPage: Failed to delete list');
      }
    } catch (error) {
      console.error('🛒 ShoppingListsPage: Error deleting list:', error);
    } finally {
      setIsDeleting(null);
    }
  }, [deleteList, sessionService]);

  const handleListClick = useCallback((listId: string) => {
    console.log('🛒 ShoppingListsPage: Navigating to list:', listId);
    navigate(`/shopping-lists/${listId}`);
  }, [navigate]);

  const handleLoginBannerClick = useCallback(() => {
    setShowAuthModal(true);
  }, []);

  const handleLoginBannerDismiss = useCallback(() => {
    setShowLoginBanner(false);
  }, []);

  const handleReorderLists = useCallback(async (listIds: string[]) => {
    console.log('🛒 ShoppingListsPage: Reordering lists:', listIds);
    await reorderLists(listIds);
  }, [reorderLists]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const listEntries = Object.entries(lists);

  const headerProps = {
    title: t('shoppingList'),
    showBackButton: true,
    showAvatar: true
  };

  const createListTexts = {
    title: t('createNewList', 'Crear Nueva Lista'),
    description: '',
    cancel: t('cancel', 'Cancelar'),
    save: t('create', 'Crear'),
    saving: t('creating', 'Creando...')
  };

  return (
    <Layout currentView="shopping-lists" headerProps={headerProps}>
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <div className="flex-1 overflow-auto p-4" style={{ paddingTop: '1rem', paddingBottom: 'calc(var(--bottom-nav-height) + 1rem)' }}>
          {!isAuthenticated && showLoginBanner && (
            <LoginSuggestionBanner
              onLoginClick={handleLoginBannerClick}
              onDismiss={handleLoginBannerDismiss}
            />
          )}

          {/* Create List Button */}
          <div className="mb-6">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isProcessing}
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('createList', 'Crear Lista')}
            </Button>
          </div>

          {/* Sync Status Indicator */}
          <SyncStatusIndicator isSyncing={isSyncing || isLoading} />


          {/* Shopping Lists */}
          {listEntries.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                {t('noListsYet', 'No tienes listas aún')}
              </h3>
              <p className="text-gray-400 mb-4">
                {t('createFirstList', 'Crea tu primera lista de compras')}
              </p>
            </div>
          ) : (
            <DragDropShoppingListsPage
              lists={lists}
              onListClick={handleListClick}
              onDeleteList={handleDeleteList}
              onReorder={handleReorderLists}
              isDeleting={isDeleting}
              formatDate={formatDate}
            />
          )}
        </div>

        <BaseEditModal
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSave={handleCreateList}
          texts={createListTexts}
          canSave={!!newListName.trim()}
        >
          <div>
            <label htmlFor="listName" className="block text-sm font-medium text-gray-700 mb-1">
              {t('listName', 'Nombre de la lista')}
            </label>
            <Input
              id="listName"
              placeholder={t('enterListName', 'Ingresa el nombre de la lista')}
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="listDescription" className="block text-sm font-medium text-gray-700 mb-1">
              {t('description', 'Descripción')} ({t('optional', 'opcional')})
            </label>
            <Textarea
              id="listDescription"
              placeholder={t('enterListDescription', 'Descripción de la lista')}
              value={newListDescription}
              onChange={(e) => setNewListDescription(e.target.value)}
              rows={3}
            />
          </div>
        </BaseEditModal>

        <AuthExplanationModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </Layout>
  );
};

export default ShoppingListsPage;
