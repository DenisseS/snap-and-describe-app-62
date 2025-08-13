import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getProductById } from '@/data/database';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import { useTranslatedProductDatabase } from '@/hooks/useTranslatedProductDatabase';
import { getProductSlug } from '@/utils/productUtils';
import DataView from './DataView';
import ProductCard from './ProductCard';

interface ExploreItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  status: string;
}

interface ExploreProps {
  onItemSelect?: (item: ExploreItem) => void;
}

const Explore: React.FC<ExploreProps> = ({ onItemSelect }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguage } = useProductTranslation();
  const translatedProductsDB = useTranslatedProductDatabase();

  // Convert all products to ExploreItem format - already translated
  const allItems: ExploreItem[] = translatedProductsDB.map(product => ({
    ...product, // Include all product fields for filtering
    status: 'explore'
  }));

  const handleItemSelect = (item: ExploreItem) => {
    if (onItemSelect) {
      onItemSelect(item);
    } else {
      // Get the full product data to generate proper slug
      const product = getProductById(item.id);
      if (product) {
        const slug = getProductSlug(product, currentLanguage);
        navigate(`/product/${slug}?referrer=explore`);
      }
    }
  };

  const renderItem = useCallback((item: ExploreItem) => (
    <ProductCard key={item.id} item={item} onClick={() => handleItemSelect(item)} />
  ), [handleItemSelect]);

  return (
    <DataView
      items={allItems}
      renderItem={renderItem}
      searchPlaceholder={t('searchFoodProducts')}
      showFilters={true}
    />
  );
};

export default Explore;
