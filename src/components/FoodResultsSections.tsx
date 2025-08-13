
import React from 'react';
import { useTranslation } from 'react-i18next';
import ExpandableSection from './ExpandableSection';
import NutritionSections from './NutritionSections';
import AllergensSection from './AllergensSection';
import ProcessingSection from './ProcessingSection';
import SimilarProducts from './SimilarProducts';
import { TranslatedProduct } from '@/data/types';

interface FoodResultsSectionsProps {
  product: TranslatedProduct;
  expandedCard: string | null;
  onCardClick: (cardType: string) => void;
  onSeeMore: () => void;
  onSimilarProductSelect: (product: { id: string; name: string; image: string; rating: number; status: string }) => void;
}

const FoodResultsSections: React.FC<FoodResultsSectionsProps> = ({
  product,
  expandedCard,
  onCardClick,
  onSeeMore,
  onSimilarProductSelect
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 min-h-0 space-y-2">
      {/* Nutrition Info Section */}
      <ExpandableSection
        title={t('nutriInfo')}
        isExpanded={expandedCard === 'nutri'}
        onClick={() => onCardClick('nutri')}
      >
        <NutritionSections 
          product={product}
          onSeeMore={onSeeMore}
        />
      </ExpandableSection>

      {/* Processing Level Section */}
      <ExpandableSection
        title={t('processingLevel')}
        isExpanded={expandedCard === 'processing'}
        onClick={() => onCardClick('processing')}
      >
        <ProcessingSection processingLevel={product.processingLevel} />
      </ExpandableSection>

      {/* Allergens Section */}
      <ExpandableSection
        title={t('allergens')}
        isExpanded={expandedCard === 'allergens'}
        onClick={() => onCardClick('allergens')}
      >
        <AllergensSection 
          allergens={product.allergens}
          displayLimit={4}
        />
      </ExpandableSection>

      {/* Other Options Section */}
      <ExpandableSection
        title={t('otherOptions')}
        isExpanded={expandedCard === 'other'}
        onClick={() => onCardClick('other')}
      >
        <SimilarProducts 
          currentProduct={product.id}
          onItemSelect={onSimilarProductSelect}
        />
      </ExpandableSection>
    </div>
  );
};

export default FoodResultsSections;
