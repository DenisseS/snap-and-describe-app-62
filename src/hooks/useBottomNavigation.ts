
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigationContext, NavigationState } from '@/contexts/NavigationContext';

export const useBottomNavigation = () => {
  const navigate = useNavigate();
  const { 
    setNavigationState, 
    clearStack, 
    setBaseRoute 
  } = useNavigationContext();

  const handleHomeClick = useCallback(() => {
    console.log('🏠 BottomNav: Home clicked - clearing stack');
    setNavigationState(NavigationState.BOTTOM_NAV);
    clearStack();
    navigate('/');
  }, [setNavigationState, clearStack, navigate]);

  const handleExploreClick = useCallback(() => {
    console.log('📷 BottomNav: Explore clicked - setting base route');
    setNavigationState(NavigationState.BOTTOM_NAV);
    setBaseRoute('/explore');
    navigate('/explore');
  }, [setNavigationState, setBaseRoute, navigate]);

  const handleRecipesClick = useCallback(() => {
    console.log('👨‍🍳 BottomNav: Recipes clicked - setting base route');
    setNavigationState(NavigationState.BOTTOM_NAV);
    setBaseRoute('/recipes');
    navigate('/recipes');
  }, [setNavigationState, setBaseRoute, navigate]);

  const handleFavoritesClick = useCallback(() => {
    console.log('❤️ BottomNav: Favorites clicked - setting base route');
    setNavigationState(NavigationState.BOTTOM_NAV);
    setBaseRoute('/favorites');
    navigate('/favorites');
  }, [setNavigationState, setBaseRoute, navigate]);

  const handleBlogClick = useCallback(() => {
    console.log('📝 BottomNav: Blog clicked - setting base route');
    setNavigationState(NavigationState.BOTTOM_NAV);
    setBaseRoute('/blog');
    navigate('/blog');
  }, [setNavigationState, setBaseRoute, navigate]);

  const handleCameraClick = useCallback(() => {
    console.log('📸 BottomNav: Camera clicked - navigating to camera');
    setNavigationState(NavigationState.FROM_HOME);
    navigate('/camera');
  }, [setNavigationState, navigate]);

  return {
    handleHomeClick,
    handleExploreClick,
    handleRecipesClick,
    handleFavoritesClick,
    handleBlogClick,
    handleCameraClick
  };
};
