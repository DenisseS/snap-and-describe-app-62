
import React from 'react';
import { useTranslation } from 'react-i18next';
import AllergenCard from './AllergenCard';
import { getPriorityAllergens, getAllergenConfig } from '@/data/allergens';

interface AllergenData {
  [key: string]: boolean;
}

interface AllergensSectionProps {
  allergens: AllergenData;
  displayLimit?: number;
  className?: string;
}

const AllergensSection: React.FC<AllergensSectionProps> = ({ 
  allergens, 
  displayLimit = 8,
  className = '' 
}) => {
  const { t } = useTranslation();

  // Get priority allergens and filter to show only those the product CONTAINS
  // For dietary preferences (vegan/vegetarian), we show them if they are FALSE (product is not vegan/vegetarian)
  // For allergens, we show them if they are FALSE (product contains the allergen)
  const containedAllergens = getPriorityAllergens()
    .filter(config => {
      const hasAllergen = allergens.hasOwnProperty(config.id);
      if (!hasAllergen) return false;
      
      // For allergens ending with "Free", show if FALSE (contains the allergen)
      // For dietary preferences, show if FALSE (doesn't meet the preference)
      return allergens[config.id] === false;
    })
    .slice(0, displayLimit);

  if (containedAllergens.length === 0) {
    return (
      <div className={`text-center text-gray-500 p-4 ${className}`}>
        <p className="text-sm">{t('thisProductNotContainAllergens')}</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      {containedAllergens.map((allergenConfig) => (
        <AllergenCard
          key={allergenConfig.id}
          allergen={allergenConfig}
        />
      ))}
    </div>
  );
};

export default AllergensSection;
