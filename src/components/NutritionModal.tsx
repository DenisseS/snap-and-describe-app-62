
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import NutritionSection from './NutritionSection';
import VitaminsMineralsSection from './VitaminsMineralsSection';
import CaloriesSection from './CaloriesSection';

interface NutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    image: string;
    nutrition: {
      protein: {
        description: string;
        total: number;
        caloriesFrom: number;
        dailyPercentage: number;
        healthRanking: number;
      };
      carbs: {
        description: string;
        total: number;
        caloriesFrom: number;
        dailyPercentage: number;
        healthRanking: number;
      };
      fats: {
        description: string;
        total: number;
        caloriesFrom: number;
        dailyPercentage: number;
        healthRanking: number;
      };
      fiber: {
        description: string;
        total: number;
        caloriesFrom: number;
        dailyPercentage: number;
        healthRanking: number;
      };
      calories: {
        description: string;
        total: number;
        fromCarbs: number;
        fromProtein: number;
        fromFat: number;
      };
      vitamins: string[];
      minerals: string[];
      saturatedFat?: number;
      sugar?: number;
      sodium?: number;
      cholesterol?: number;
    };
  } | null;
}

const NutritionModal: React.FC<NutritionModalProps> = ({ isOpen, onClose, product }) => {
  const { t } = useTranslation();

  if (!product) return null;

  const { nutrition } = product;

  // Additional fields for each section with translations
  const fatsAdditionalFields = nutrition.saturatedFat 
    ? [{ label: t('saturatedFat'), value: nutrition.saturatedFat }] 
    : [];

  const carbsAdditionalFields = nutrition.sugar 
    ? [{ label: t('sugars'), value: nutrition.sugar }] 
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{t('nutriInfo')} - {product.name}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {/* Protein Section */}
            <NutritionSection 
              title={t('protein')}
              data={nutrition.protein}
            />

            {/* Fats Section */}
            <NutritionSection 
              title={t('fats')}
              data={nutrition.fats}
              additionalFields={fatsAdditionalFields}
            />

            {/* Fiber Section */}
            <NutritionSection 
              title={t('fiber')}
              data={nutrition.fiber}
            />

            {/* Carbohydrates Section */}
            <NutritionSection 
              title={t('carbohydrates')}
              data={nutrition.carbs}
              additionalFields={carbsAdditionalFields}
            />

            {/* Vitamins & Minerals Section */}
            <VitaminsMineralsSection 
              vitamins={nutrition.vitamins}
              minerals={nutrition.minerals}
              sodium={nutrition.sodium}
              cholesterol={nutrition.cholesterol}
            />

            {/* Calories Section */}
            <CaloriesSection calories={nutrition.calories} />

            <div className="text-xs text-gray-500 italic">
              {t('dailyValueNote')}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NutritionModal;
