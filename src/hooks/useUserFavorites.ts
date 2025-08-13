
import { useUserData } from './useUserData';
import { useMemo } from 'react';

interface UseUserFavoritesReturn {
  favorites: Record<string, { status: 'heart' | 'thumb-down' }> | null;
  state: import('@/types/userData').DataState;
  refetch: () => Promise<void>;
  updateFavorites: (favorites: Record<string, { status: 'heart' | 'thumb-down' }>) => Promise<void>;
}

export const useUserFavorites = (): UseUserFavoritesReturn => {
  const { profile, state, refetch, updateProfile } = useUserData();

  const favorites = useMemo(() => {
    return profile?.favorites || null;
  }, [profile?.favorites]);

  const updateFavorites = async (newFavorites: Record<string, { status: 'heart' | 'thumb-down' }>) => {
    if (!profile) return;
    
    const updatedProfile = {
      ...profile,
      favorites: newFavorites
    };
    
    await updateProfile(updatedProfile);
  };

  return {
    favorites,
    state,
    refetch,
    updateFavorites
  };
};
