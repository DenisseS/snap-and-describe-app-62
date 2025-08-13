
import React from 'react';
import FoodCard from './FoodCard';
import FoodResultsSections from './FoodResultsSections';
import NutritionModal from './NutritionModal';
import ProductNotFound from './ProductNotFound';
import { useFoodResults } from '@/hooks/useFoodResults';

interface FoodResultsProps {
  foodName: string;
  foodImage: string;
  rating: number;
  productId: string;
  onSimilarProductSelect?: (product: { id: string; name: string; image: string; rating: number; status: string }) => void;
}

const FoodResults: React.FC<FoodResultsProps> = ({ 
  foodImage,
  rating,
  productId,
  onSimilarProductSelect 
}) => {
  const {
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
  } = useFoodResults({ productId, onSimilarProductSelect });

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 p-2 space-y-2 overflow-y-auto">
        {/* Food Card - Fixed height */}
        <div className="flex-shrink-0">
          <FoodCard
            foodName={translatedName}
            foodImage={foodImage}
            rating={rating}
            isFavorited={userStatus === 'heart'}
            isDisliked={userStatus === 'thumb-down'}
            isLoading={isLoading}
            onHeartClick={handleHeartClick}
            onThumbsDownClick={handleThumbsDownClick}
            processingLevel={product.processingLevel}
          />
        </div>

        {/* Expandable Sections - Takes remaining space */}
        <FoodResultsSections
          product={product}
          expandedCard={expandedCard}
          onCardClick={handleCardClick}
          onSeeMore={handleSeeMore}
          onSimilarProductSelect={handleSimilarProductSelect}
        />
      </div>

      {/* Nutrition Modal */}
      <NutritionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={product}
      />
    </div>
  );
};

export default FoodResults;
