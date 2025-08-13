import { useProductTranslation } from '@/hooks/useProductTranslation';
import { productsCoreDB } from '@/data/products-core';
import { TranslatedProduct } from '@/data/types';

const cacheByLang: Record<string, TranslatedProduct[]> = {};

export const useTranslatedProductDatabase = (): TranslatedProduct[] => {
  const {
    translateProductName,
    translateProductDescription,
    translateCategory,
    currentLanguage
  } = useProductTranslation();

  if (!cacheByLang[currentLanguage]) {
    console.log(`🌐 Translating ${productsCoreDB.length} products to ${currentLanguage}`);
    cacheByLang[currentLanguage] = productsCoreDB.map(product => ({
      ...product,
      name: translateProductName(product),
      category: translateCategory(product.categoryKey),
      description: translateProductDescription(product),
      processingLevel: product.processingLevel
    }));
  }

  return cacheByLang[currentLanguage];
};