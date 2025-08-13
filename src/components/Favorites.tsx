import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTranslatedProductDatabase } from '@/hooks/useTranslatedProductDatabase';
import { useUserFavorites } from '@/hooks/useUserFavorites';
import { DataState } from '@/types/userData';
import DataView from '@/components/DataView';
import ProductCard from '@/components/ProductCard';

interface FavoriteItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  status: string;
}

interface FavoritesProps {
  onItemSelect: (item: FavoriteItem) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ onItemSelect }) => {
  const { t } = useTranslation();
  const translatedProductsDB = useTranslatedProductDatabase();
  const { favorites, state } = useUserFavorites();

  // Convert favorites data to FavoriteItem array directly during render - ONLY items with 'heart' status
  const favoriteItems: FavoriteItem[] = [];

  if (favorites) {
    Object.entries(favorites).forEach(([productId, favoriteData]) => {
      // Only include items with 'heart' status in the favorites list
      if (favoriteData.status === 'heart') {
        // Find product in translated database
        const product = translatedProductsDB.find(p => p.id === productId);
        if (product) {
          favoriteItems.push({
            ...product, // Include all product fields for DataView compatibility
            status: favoriteData.status
          });
        }
      }
    });

    console.log('📱 Favorites: Computed favorite items from profile data (hearts only)', favoriteItems);
  }

  const renderItem = useCallback((item: FavoriteItem) => (
    <ProductCard key={item.id} item={item} onClick={() => onItemSelect(item)} />
  ), [onItemSelect]);

  const isLoading = state === DataState.LOADING;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  return (
    <DataView
      items={favoriteItems}
      renderItem={renderItem}
      searchPlaceholder={t('searchYourFavorites')}
      showFilters={false}
    />
  );
};

export default Favorites;
