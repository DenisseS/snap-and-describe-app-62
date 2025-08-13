
import { useTranslation } from 'react-i18next';
import { Product, TranslatedProduct } from '@/data/types';

type Language = 'en' | 'es';

export const useProductTranslation = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage = (i18n.language || 'es') as Language;

  // Translate product name using nameKey
  const translateProductName = (product: Product): string => {
    if (product.nameKey) {
      return t(`database:products.${product.nameKey}.name`, { 
        defaultValue: product.nameKey 
      });
    }
    return product.nameKey || 'Unknown Product';
  };

  // Translate product description using descriptionKey
  const translateProductDescription = (product: Product): string => {
    if (product.descriptionKey) {
      return t(`database:products.${product.descriptionKey}.description`, { 
        defaultValue: '' 
      });
    }
    return '';
  };

  // Translate category using categoryKey
  const translateCategory = (categoryKey: string): string => {
    return t(`database:categories.${categoryKey}`, { defaultValue: categoryKey });
  };

  // Translate vitamin names
  const translateVitamins = (vitamins: string[]): string[] => {
    return vitamins.map(vitamin => 
      t(`database:vitamins.${vitamin}`, { defaultValue: vitamin })
    );
  };

  // Translate mineral names
  const translateMinerals = (minerals: string[]): string[] => {
    return minerals.map(mineral => 
      t(`database:minerals.${mineral}`, { defaultValue: mineral })
    );
  };

  // Translate processing level category
  const translateProcessingCategory = (category: string): string => {
    return t(`database:processing.${category}`, { defaultValue: category });
  };

  // Translate processing level description using key
  const translateProcessingDescription = (descriptionKey: string, fallbackCategory?: string): string => {
    return t(`database:processing.${descriptionKey}`, { 
      defaultValue: fallbackCategory || descriptionKey 
    });
  };

  // Translate processing level indicators using keys
  const translateProcessingIndicators = (indicatorsKeys: string[], fallbackIndicators?: string[]): string[] => {
    return indicatorsKeys.map(key => 
      t(`database:processing.${key}`, { defaultValue: key })
    );
  };

  return {
    translateProductName,
    translateProductDescription,
    translateCategory,
    translateVitamins,
    translateMinerals,
    translateProcessingCategory,
    translateProcessingDescription,
    translateProcessingIndicators,
    currentLanguage
  };
};
