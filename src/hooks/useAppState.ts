
import { useNavigation } from './useNavigation';
import { useCamera } from './useCamera';
import { useLanguage } from './useLanguage';
import { getHeaderProps } from '@/utils/navigationUtils';

interface FavoriteItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  status: string;
}

export const useAppState = () => {
  const {
    currentView,
    navigateTo,
    navigateBack,
    navigateToProduct,
    handleHomeClick,
    handleExploreClick,
    handleRecipesClick,
    handleFavoritesClickDirect
  } = useNavigation();

  const {
    capturedImage,
    currentProductId,
    analysisResult,
    handlePhotoTaken
  } = useCamera(navigateToProduct);

  const { handleLanguageToggle } = useLanguage();

  // Regular handlers with history
  const handleScanStart = () => {
    navigateTo('camera');
  };

  const handleBack = () => {
    navigateBack();
  };

  const handleRetake = () => {
    navigateTo('camera');
  };

  const handleFavoritesClick = () => {
    navigateTo('favorites');
  };

  const handleFavoriteItemSelect = (item: FavoriteItem) => {
    navigateToProduct(item.id);
  };

  const handleSimilarProductSelect = (product: { id: string; name: string; image: string; rating: number; status: string }) => {
    navigateToProduct(product.id);
  };

  const handleExploreItemSelect = (item: FavoriteItem) => {
    navigateToProduct(item.id);
  };

  return {
    currentView,
    capturedImage,
    analysisResult,
    currentProductId,
    headerProps: getHeaderProps(currentView, navigateTo, navigateBack),
    handleLanguageToggle,
    handleScanStart,
    handlePhotoTaken,
    handleBack,
    handleRetake,
    handleFavoritesClick,
    handleFavoriteItemSelect,
    handleSimilarProductSelect,
    handleExploreItemSelect,
    navigateTo,
    navigateBack,
    navigateToProduct,
    // Direct navigation handlers for bottom nav
    handleHomeClick,
    handleExploreClick,
    handleRecipesClick,
    handleFavoritesClickDirect
  };
};
