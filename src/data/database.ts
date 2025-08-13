
import { TranslatedProduct } from './types';
import { productsCoreDB } from './products-core';
import { getProductById, getProductsByIds, getSimilarProducts, getProductsByCategory, searchProducts } from './queries';

// Función deprecada - ahora se debe usar useTranslatedProductDatabase hook
export const getProductsDB = (language: string = 'en'): TranslatedProduct[] => {
  console.warn('getProductsDB is deprecated. Use useTranslatedProductDatabase hook instead.');
  return productsCoreDB as any; // Compatibility fallback
};

// Re-exports para compatibilidad hacia atrás
export type { TranslatedProduct, UserFavorites, Product } from './types';
export { productsCoreDB } from './products-core';
export {
  getProductById,
  getProductsByIds,
  getSimilarProducts,
  getProductsByCategory,
  searchProducts
};
