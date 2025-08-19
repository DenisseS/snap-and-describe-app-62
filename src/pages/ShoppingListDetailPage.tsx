import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, ShoppingCart, RefreshCcw, Share2 } from "lucide-react";
import Layout from "@/components/Layout";
import BaseEditModal from "@/components/BaseEditModal";
import ShareListModal from "@/components/ShareListModal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import ProductSearchDropdown from "@/components/ProductSearchDropdown";
import DragDropShoppingList from "@/components/DragDropShoppingList";
import { useShoppingListDetail } from "@/hooks/useShoppingListDetail";
import { useNavigation } from "@/hooks/useNavigation";
import { DataState } from "@/types/userData";
import SyncStatusIndicator from "@/components/SyncStatusIndicator";
import { useQueueResource } from "@/hooks/useQueueResource";
import { QueueState } from "@/types/queue";
import { useAuthentication } from "@/hooks/useAuthentication";
import { QueueClient } from "@/services/sw/QueueClient";

interface ProductSearchResult {
  id: string;
  name: string;
  image: string;
  rating: number;
  category: string;
  slug: string;
}

const ShoppingListDetailPage: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const { t } = useTranslation();
  const { navigateToProduct } = useNavigation();
  const { listData, state, isSyncing, addItem, toggleItem, removeItem, updateItem, reorderItems, forceRefresh } = useShoppingListDetail(listId!);
  const { state: queueState } = useQueueResource("shopping-lists", listId!);
  const isSWProcessing = queueState === QueueState.PROCESSING;
  const { sessionService } = useAuthentication();
  const [showItemModal, setShowItemModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemUnit, setItemUnit] = useState("");
  const [itemNotes, setItemNotes] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);

  const isLoading = state === DataState.LOADING;
  const isProcessing = state === DataState.PROCESSING;
  const isEditing = !!editingItem;

  // Check queue pending items on mount and when list changes
  useEffect(() => {
    let mounted = true;
    if (!listId) return;
    const client = QueueClient.getInstance();
    client.status(listId).then((status) => {
      if (!mounted) return;
      const hasPending = Array.isArray(status?.items) && status.items.length > 0;
      if (hasPending && !status.processing) setShowSyncModal(true);
    }).catch(() => {});
    return () => { mounted = false; };
  }, [listId]);

  const handleProductSelect = (product: ProductSearchResult) => {
    console.log("🛒 ShoppingListDetailPage: Product selected:", product.name);
    setItemName(product.name);
    setSelectedProductId(product.id);
    setSelectedProductSlug(product.slug);
    setItemQuantity("");
    setItemUnit("");
    setItemNotes("");
    setEditingItem(null);
    setShowItemModal(true);
  };

  const handleCustomItemSelect = (itemName: string) => {
    console.log("🛒 ShoppingListDetailPage: Custom item selected:", itemName);
    setItemName(itemName);
    setSelectedProductId(null);
    setSelectedProductSlug(null);
    setItemQuantity("");
    setItemUnit("");
    setItemNotes("");
    setEditingItem(null);
    setShowItemModal(true);
  };

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemQuantity(item.quantity?.toString() || "");
    setItemUnit(item.unit || "");
    setItemNotes(item.notes || "");
    setSelectedProductId(item.productId || null);
    setSelectedProductSlug(item.slug || null);
    setShowItemModal(true);
  };

  const handleSaveItem = async () => {
    if (!itemName.trim()) return;

    try {
      const quantity = itemQuantity ? parseFloat(itemQuantity) : undefined;

      if (isEditing) {
        console.log("🛒 ShoppingListDetailPage: Updating item optimistically:", editingItem.id);
        // Use optimistic update instead of waiting for server response
        updateItem(editingItem.id, {
          name: itemName.trim(),
          quantity,
          unit: itemUnit || undefined,
          notes: itemNotes || undefined
        });
        resetModalState();
      } else {
        console.log("🛒 ShoppingListDetailPage: Adding item optimistically:", itemName);
        // Use optimistic update - immediately reset modal and let hook handle the server operation
        addItem(
          itemName.trim(),
          quantity,
          itemUnit || undefined,
          itemNotes || undefined,
          selectedProductId || undefined,
          selectedProductSlug || undefined
        );
        resetModalState();
      }
    } catch (error) {
      console.error("🛒 ShoppingListDetailPage: Error saving item:", error);
      throw error;
    }
  };

  const resetModalState = () => {
    setItemName("");
    setItemQuantity("");
    setItemUnit("");
    setItemNotes("");
    setSelectedProductId(null);
    setSelectedProductSlug(null);
    setEditingItem(null);
    setShowItemModal(false);

    const searchInput = document.querySelector("[data-search-input]") as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  const handleToggleItem = (itemId: string) => {
    console.log("🛒 ShoppingListDetailPage: Toggling item optimistically:", itemId);
    toggleItem(itemId);
  };

  const handleRemoveItem = (itemId: string) => {
    console.log("🛒 ShoppingListDetailPage: Removing item optimistically:", itemId);
    // Use optimistic update instead of waiting for server response
    removeItem(itemId);
  };

  const handleProductLinkClick = (productId: string) => {
    console.log("🛒 ShoppingListDetailPage: Navigating to product:", productId);
    navigateToProduct(productId);
  };

  const handleReorder = (itemIds: string[]) => {
    console.log("🛒 ShoppingListDetailPage: Reordering items:", itemIds);
    reorderItems(itemIds);
  };

  const handleStartSync = async () => {
    try {
      const token = await sessionService.getAccessToken();
      if (!token) {
        console.warn("🛒 ShoppingListDetailPage: Cannot start sync - no token");
        setShowSyncModal(false);
        return;
      }
      await QueueClient.getInstance().start(token);
    } catch (e) {
      console.error("🛒 ShoppingListDetailPage: Error starting queue processing", e);
    } finally {
      setShowSyncModal(false);
    }
  };

  const handleCancelSync = async () => {
    try {
      await QueueClient.getInstance().clearAll();
    } catch (e) {
      console.error("🛒 ShoppingListDetailPage: Error clearing entire queue", e);
    } finally {
      setShowSyncModal(false);
    }
  };
  const filteredItems = listData?.items || [];
  const pendingItems = filteredItems.filter(item => !item.purchased);
  const completedItems = filteredItems.filter(item => item.purchased);

  const headerProps = {
    title: listData?.name || t("shoppingList", "Lista de Compras"),
    showBackButton: true,
    showAvatar: true
  };

  const itemModalTexts = {
    title: t("editItem", "Editar Artículo"),
    description: "",
    cancel: t("cancel", "Cancelar"),
    save: t("save", "Guardar"),
    saving: t("saving", "Guardando...")
  };

  const handleForceRefresh = async () => {
    await forceRefresh();
  };

  return (
    <TooltipProvider>
      <Layout currentView="shopping-lists" headerProps={headerProps}>
        <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
          <div className="flex-1 overflow-auto" style={{ paddingBottom: "calc(var(--bottom-nav-height) + 1rem)" }}>
            <div className="p-4">
              {listData?.origin === 'remote' ? (
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg mb-4">
                  <Share2 className="h-4 w-4" />
                  <span>{t('remoteList', 'Lista compartida')}</span>
                  {listData.syncRef?.ownerEmail && (
                    <span className="text-blue-500">
                      {t('by', 'por')} {listData.syncRef.ownerEmail}
                    </span>
                  )}
                </div>
              ) : null}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <ProductSearchDropdown
                      onProductSelect={handleProductSelect}
                      onCustomItemSelect={handleCustomItemSelect}
                      placeholder={t("searchProducts", "Escribe aquí para buscar productos o crear artículos...")}
                      disabled={isProcessing}
                    />
                  </div>
                  {sessionService.isAuthenticated() && (
                    <>
                      <button
                        onClick={handleForceRefresh}
                        disabled={isProcessing}
                        className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-600 disabled:opacity-50"
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </button>
                      
                      {listData?.origin !== 'remote' && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setShowShareModal(true)}
                              disabled={isProcessing}
                              className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-green-100 hover:bg-green-200 text-green-600 disabled:opacity-50"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('shareList', 'Compartir Lista')}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Sync Status Indicator - Reserved space */}
              <SyncStatusIndicator isSyncing={isSyncing || isSWProcessing || isLoading} className="mb-4"/>


              {/* List Content */}
              {listData && (
                <div className="space-y-6">
                  {/* Pending Items */}
                  {pendingItems.length > 0 && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <ShoppingCart className="h-5 w-5 mr-2 text-blue-600"/>
                        {t("pending", "Pendientes")} ({pendingItems.length})
                      </h3>
                      <DragDropShoppingList
                        items={filteredItems}
                        onToggleItem={handleToggleItem}
                        onEditItem={handleEditClick}
                        onRemoveItem={handleRemoveItem}
                        onProductLinkClick={handleProductLinkClick}
                        onReorder={handleReorder}
                        isProcessing={isProcessing}
                        showCompleted={false}
                      />
                    </div>
                  )}

                  {/* Completed Items */}
                  {completedItems.length > 0 && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle2 className="h-5 w-5 mr-2 text-green-600"/>
                        {t("completed", "Completados")} ({completedItems.length})
                      </h3>
                      <DragDropShoppingList
                        items={filteredItems}
                        onToggleItem={handleToggleItem}
                        onEditItem={handleEditClick}
                        onRemoveItem={handleRemoveItem}
                        onProductLinkClick={handleProductLinkClick}
                        onReorder={handleReorder}
                        isProcessing={isProcessing}
                        showCompleted={true}
                      />
                    </div>
                  )}

                  {/* Empty state */}
                  {filteredItems.length === 0 && !isLoading && (
                    <div className="text-center py-12 relative">
                      <p className="text-sm text-green-600 font-medium mt-4 mb-16">
                        👆 {t("tapToStart", "Escribe aquí para empezar")}
                      </p>
                      <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4 mt-4"/>
                      <h3 className="text-lg font-medium text-gray-500 mb-2">
                        {t("noItemsYet", "Tu lista está vacía")}
                      </h3>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Item Modal - Unified for both Add and Edit */}
          <BaseEditModal
            isOpen={showItemModal}
            onClose={resetModalState}
            onSave={handleSaveItem}
            texts={itemModalTexts}
            canSave={!!itemName.trim()}
            focusOnSave={true}
          >
            <div>
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                {t("itemName", "Nombre del artículo")} *
              </label>
              <Input
                id="itemName"
                placeholder={t("enterItemName", "Ingresa el nombre del artículo")}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="itemQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("quantity", "Cantidad")}
                </label>
                <Input
                  id="itemQuantity"
                  type="number"
                  placeholder="1"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="itemUnit" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("unit", "Unidad")}
                </label>
                <Input
                  id="itemUnit"
                  placeholder="kg, lts, unid..."
                  value={itemUnit}
                  onChange={(e) => setItemUnit(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="itemNotes" className="block text-sm font-medium text-gray-700 mb-1">
                {t("notes", "Notas")}
              </label>
              <Textarea
                id="itemNotes"
                placeholder={t("itemNotes", "Notas adicionales...")}
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                rows={3}
              />
            </div>
          </BaseEditModal>

          {/* Confirm start processing modal */}
          <AlertDialog open={showSyncModal} onOpenChange={setShowSyncModal}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("processPendingTitle", "Procesar cambios pendientes")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("processPendingDesc", "Tienes cambios pendientes por sincronizar. ¿Quieres subirlos ahora?")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCancelSync}>{t("cancel", "Cancelar")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleStartSync}>
                  {t("processNow", "Procesar ahora")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Share List Modal */}
          {listData && (
            <ShareListModal
              isOpen={showShareModal}
              onClose={() => setShowShareModal(false)}
              list={{
                ...listData,
                itemCount: listData.itemCount ?? listData.items.length,
                completedCount: listData.completedCount ?? listData.items.filter(i => i.purchased).length
              }}
              folderPath={`/NutriInfo/lists/${listId}`}
            />
          )}
        </div>
      </Layout>
    </TooltipProvider>
  );
};

export default ShoppingListDetailPage;
