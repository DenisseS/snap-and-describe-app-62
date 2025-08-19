
export interface ShoppingListItem {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  purchased: boolean;
  addedAt: string;
  purchasedAt?: string;
  // NUEVOS CAMPOS para vinculación con productos
  productId?: string; // ID del producto de la BD si existe
  slug?: string; // Slug para navegación al ProductDetail
}

export interface ShoppingList {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  completedCount: number;
  order?: number;
  // Sharing fields
  origin?: 'local' | 'remote';
  sharedWith?: string[]; // emails of people shared with (only on owner's lists)
  syncRef?: {
    path: string;
    fileId?: string;
    ownerEmail?: string;
  };
}

export interface ShoppingListData {
  id: string;
  name: string;
  description?: string;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
  // Sharing fields (inherited from ShoppingList)
  origin?: 'local' | 'remote';
  sharedWith?: string[];
  syncRef?: {
    path: string;
    fileId?: string;
    ownerEmail?: string;
  };
  // Metadata for compatibility
  itemCount?: number;
  completedCount?: number;
}
