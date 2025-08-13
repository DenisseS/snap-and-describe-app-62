
import { useCallback } from 'react';
import { useUserFavorites } from './useUserFavorites';
import { useTranslation } from 'react-i18next';

export const useFavoriteActions = () => {
  const { favorites, updateFavorites } = useUserFavorites();
  const { t } = useTranslation();

  const updateFavoriteStatus = useCallback(async (productId: string, status: 'heart' | 'thumb-down' | null) => {
    try {
      const currentFavorites = favorites || {};
      const updatedFavorites = { ...currentFavorites };
      
      if (status === null) {
        // Remove from favorites
        delete updatedFavorites[productId];
      } else {
        // Add or update favorite
        updatedFavorites[productId] = { status };
      }
      
      await updateFavorites(updatedFavorites);
      
      console.log('✅ Favorite updated:', { productId, status });
    } catch (error) {
      console.error('❌ Error updating favorite:', error);
    }
  }, [favorites, updateFavorites]);

  const getFavoriteStatus = useCallback((productId: string): 'heart' | 'thumb-down' | null => {
    return favorites?.[productId]?.status || null;
  }, [favorites]);

  const isFavorite = useCallback((productId: string): boolean => {
    return getFavoriteStatus(productId) === 'heart';
  }, [getFavoriteStatus]);

  return {
    updateFavoriteStatus,
    getFavoriteStatus,
    isFavorite
  };
};
