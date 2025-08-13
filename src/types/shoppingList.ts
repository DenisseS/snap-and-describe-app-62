
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
}

export interface ShoppingListData {
  id: string;
  name: string;
  description?: string;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}
