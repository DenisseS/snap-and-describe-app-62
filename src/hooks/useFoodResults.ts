import { useState, useEffect } from 'react';
import { getProductById } from '@/data/database';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import { useTranslatedProductDatabase } from '@/hooks/useTranslatedProductDatabase';
import { useFavoriteActions } from '@/hooks/useFavoriteActions';

interface UseFoodResultsProps {
  productId: string;
  onSimilarProductSelect?: (product: { id: string; name: string; image: string; rating: number; status: string }) => void;
}

export const useFoodResults = ({ productId, onSimilarProductSelect }: UseFoodResultsProps) => {
  const translatedProductsDB = useTranslatedProductDatabase();
  const { getFavoriteStatus, updateFavoriteStatus } = useFavoriteActions();
  const [expandedCard, setExpandedCard] = useState<string | null>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get product data from translated database
  const product = getProductById(productId, translatedProductsDB);

  // Get user status from favorites system
  const userStatus = getFavoriteStatus(productId);

  const handleCardClick = (cardType: string) => {
    setExpandedCard(expandedCard === cardType ? null : cardType);
  };

  const handleHeartClick = async () => {
    const newStatus = userStatus === 'heart' ? null : 'heart';
    setIsLoading(true);
    
    try {
      await updateFavoriteStatus(productId, newStatus);
    } catch (error) {
      console.error('Error saving preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThumbsDownClick = async () => {
    const newStatus = userStatus === 'thumb-down' ? null : 'thumb-down';
    setIsLoading(true);
    
    try {
      await updateFavoriteStatus(productId, newStatus);
    } catch (error) {
      console.error('Error saving preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeeMore = () => {
    setIsModalOpen(true);
  };

  const handleSimilarProductSelect = (product: { id: string; name: string; image: string; rating: number; status: string }) => {
    if (onSimilarProductSelect) {
      onSimilarProductSelect(product);
    }
  };

  // Product name is already translated from the database
  const translatedName = product ? product.name : '';

  return {
    product,
    translatedName,
    expandedCard,
    isModalOpen,
    userStatus,
    isLoading,
    handleCardClick,
    handleHeartClick,
    handleThumbsDownClick,
    handleSeeMore,
    handleSimilarProductSelect,
    setIsModalOpen
  };
};
