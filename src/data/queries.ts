
import { TranslatedProduct, Product } from './types';
import { productsCoreDB } from './products-core';

// Funciones de consulta compatibles con ambos tipos de productos
export const getProductById = (id: string, translatedProducts?: TranslatedProduct[]): TranslatedProduct | undefined => {
  if (translatedProducts) {
    return translatedProducts.find(product => product.id === id);
  }
  // Fallback para compatibilidad - devolver producto core (será traducido por el hook)
  const coreProduct = productsCoreDB.find(p => p.id === id);
  return coreProduct as any; // Será manejado por el sistema de traducción
};

export const getProductsByIds = (ids: string[], translatedProducts?: TranslatedProduct[]): TranslatedProduct[] => {
  if (translatedProducts) {
    return ids.map(id => getProductById(id, translatedProducts)).filter(Boolean) as TranslatedProduct[];
  }
  // Fallback
  return ids.map(id => productsCoreDB.find(p => p.id === id)).filter(Boolean) as any[];
};

export const getSimilarProducts = (productId: string, translatedProducts?: TranslatedProduct[]): TranslatedProduct[] => {
  const product = getProductById(productId, translatedProducts);
  if (!product) return [];
  
  if ('otherOptionsIds' in product) {
    return getProductsByIds(product.otherOptionsIds, translatedProducts);
  }
  return [];
};

export const getProductsByCategory = (category: string, translatedProducts?: TranslatedProduct[]): TranslatedProduct[] => {
  if (translatedProducts) {
    return translatedProducts.filter(product => product.category === category);
  }
  return [];
};

export const searchProducts = (query: string, translatedProducts?: TranslatedProduct[]): TranslatedProduct[] => {
  if (!translatedProducts) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return translatedProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  );
};

// Re-export de tipos y datos core para compatibilidad
export type { TranslatedProduct } from './types';
export { productsCoreDB } from './products-core';
