
import React from 'react';
import { useTranslation } from 'react-i18next';
import NutritionCard from './NutritionCard';
import CaloriesSection from './CaloriesSection';
import { TranslatedProduct } from '@/data/types';

interface NutritionSectionsProps {
  product: TranslatedProduct;
  onSeeMore: () => void;
}

const NutritionSections: React.FC<NutritionSectionsProps> = ({ product, onSeeMore }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-1">
      <NutritionCard 
        type="protein" 
        isExpanded={true}
        onClick={() => {}}
        nutritionData={product.nutrition}
      />
      <NutritionCard 
        type="fats" 
        isExpanded={true}
        onClick={() => {}}
        nutritionData={product.nutrition}
      />
      <NutritionCard 
        type="fiber" 
        isExpanded={true}
        onClick={() => {}}
        nutritionData={product.nutrition}
      />
      <div className="text-center pt-1">
        <button 
          className="text-blue-500 font-medium underline text-xs"
          onClick={onSeeMore}
        >
          {t('seeMore')}
        </button>
      </div>
    </div>
  );
};

export default NutritionSections;
