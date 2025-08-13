
import React from 'react';
import { useTranslation } from 'react-i18next';
import ActionButtons from './ActionButtons';
import { ProcessingLevel } from '@/data/types';
import { useProductTranslation } from '@/hooks/useProductTranslation';

interface FoodCardProps {
  foodName: string;
  foodImage: string;
  rating: number;
  isFavorited: boolean;
  isDisliked: boolean;
  isLoading: boolean;
  onHeartClick: () => void;
  onThumbsDownClick: () => void;
  processingLevel?: ProcessingLevel;
}

const FoodCard: React.FC<FoodCardProps> = ({
  foodName,
  foodImage,
  rating,
  isFavorited,
  isDisliked,
  isLoading,
  onHeartClick,
  onThumbsDownClick,
  processingLevel
}) => {
  const { t } = useTranslation();

  // Calculate if this is an excellent option based on rating and processing level
  const getOptionQuality = (rating: number, processingLevel?: ProcessingLevel) => {
    if (!processingLevel) return null;
    
    // Excellent: High rating (8+) AND minimal/processed (NOVA 1-2)
    if (rating >= 8 && processingLevel.nova <= 2) {
      return { text: t('excellentOption'), color: 'text-green-600' };
    }
    
    // Good: Good rating (6.5+) AND not ultra-processed (NOVA 1-3)
    if (rating >= 6.5 && processingLevel.nova <= 3) {
      return { text: t('goodOption'), color: 'text-blue-500' };
    }
    
    // Fair: Decent rating (5+) OR minimal processing
    if (rating >= 5 || processingLevel.nova <= 2) {
      return { text: t('acceptableOption'), color: 'text-yellow-600' };
    }
    
    // Poor: Low rating AND ultra-processed
    return { text: t('consumeModerately'), color: 'text-orange-600' };
  };

  const optionQuality = getOptionQuality(rating, processingLevel);

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm">
      <div className="flex items-start space-x-3">
        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={foodImage} 
            alt={foodName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h2 className="text-base font-semibold text-gray-900 truncate pr-2">{foodName}</h2>
            <ActionButtons
              isFavorited={isFavorited}
              isDisliked={isDisliked}
              isLoading={isLoading}
              onHeartClick={onHeartClick}
              onThumbsDownClick={onThumbsDownClick}
            />
          </div>
          
          {optionQuality && (
            <div className="mb-2">
              <p className={`${optionQuality.color} font-medium text-sm`}>
                {optionQuality.text}
              </p>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <span className="text-blue-500 font-bold text-base">{rating}/10</span>
            <div className="flex-1 bg-gray-200 rounded-full h-1">
              <div 
                className="bg-blue-500 h-1 rounded-full" 
                style={{ width: `${(rating / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
