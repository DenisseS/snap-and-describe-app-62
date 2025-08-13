
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductById } from '@/data/database';
import { getProductSlug } from '@/utils/productUtils';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import { useNavigationContext, NavigationState } from '@/contexts/NavigationContext';

type ViewType = 'home' | 'camera' | 'results' | 'favorites' | 'explore' | 'recipes';

interface NavigationStateType {
  current: ViewType;
  previous?: ViewType;
}

export const useNavigation = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useProductTranslation();
  const { setNavigationState: setNavState } = useNavigationContext();
  const [navigationState, setNavigationState] = useState<NavigationStateType>({
    current: 'home'
  });

  // Navigation functions
  const navigateTo = (view: ViewType) => {
    setNavigationState(prev => ({
      current: view,
      previous: prev.current
    }));
    setNavState(NavigationState.REGULAR);
  };

  // Direct navigation without saving history (for bottom nav)
  const navigateDirectly = (view: ViewType) => {
    setNavigationState(prev => ({
      current: view,
      previous: undefined // Don't save history for direct navigation
    }));
  };

  const navigateBack = () => {
    const previousView = navigationState.previous || 'home';
    setNavigationState(prev => ({
      current: previousView,
      previous: undefined
    }));
  };

  // Navigate to product detail page with referrer information
  const navigateToProduct = (productId: string) => {
    const product = getProductById(productId);
    if (product) {
      const slug = getProductSlug(product, currentLanguage);
      
      // Pass current view as referrer parameter
      const referrer = navigationState.current;
      setNavState(NavigationState.REGULAR);
      navigate(`/product/${slug}?referrer=${referrer}`);
    }
  };

  // Bottom navigation handlers (direct navigation)
  const handleHomeClick = () => {
    navigate('/');
    navigateDirectly('home');
  };

  const handleExploreClick = () => {
    navigateDirectly('explore');
  };

  const handleRecipesClick = () => {
    navigateDirectly('recipes');
  };

  const handleFavoritesClickDirect = () => {
    navigateDirectly('favorites');
  };

  return {
    currentView: navigationState.current,
    navigateTo,
    navigateBack,
    navigateDirectly,
    navigateToProduct,
    handleHomeClick,
    handleExploreClick,
    handleRecipesClick,
    handleFavoritesClickDirect
  };
};
