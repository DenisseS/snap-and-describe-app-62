
import { Product, TranslatedProduct } from '@/data/types';
import i18n from '@/i18n';

type Language = 'en' | 'es';

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

export const generateSlugForLanguage = (product: Product | TranslatedProduct, language: Language): string => {
  // Handle both Product (with nameKey) and TranslatedProduct (with name)
  let translatedName: string;
  
  if ('nameKey' in product) {
    // Product type - use translation
    translatedName = i18n.t(`database:products.${product.nameKey}.name`, { 
      defaultValue: product.nameKey,
      lng: language 
    });
  } else {
    // TranslatedProduct type - use name directly
    translatedName = product.name;
  }
  
  return generateSlug(translatedName);
};

export const getProductBySlug = (products: (Product | TranslatedProduct)[], slug: string): TranslatedProduct | undefined => {
  // Try to find product by slug in any language
  return products.find(product => {
    let originalSlug: string;
    
    if ('nameKey' in product) {
      // Product type - generate slug from nameKey
      const originalName = i18n.t(`database:products.${product.nameKey}.name`, { 
        defaultValue: product.nameKey,
        lng: 'es' 
      });
      originalSlug = generateSlug(originalName);
    } else {
      // TranslatedProduct type - use name directly
      originalSlug = generateSlug(product.name);
    }
    
    if (originalSlug === slug) return true;
    
    // Check English translation slug
    let englishName: string;
    if ('nameKey' in product) {
      englishName = i18n.t(`database:products.${product.nameKey}.name`, { 
        defaultValue: product.nameKey,
        lng: 'en' 
      });
    } else {
      englishName = product.name; // Already translated
    }
    if (generateSlug(englishName) === slug) return true;
    
    return false;
  }) as TranslatedProduct | undefined;
};

export const getProductSlug = (product: Product | TranslatedProduct, language: Language = 'es'): string => {
  return generateSlugForLanguage(product, language);
};
