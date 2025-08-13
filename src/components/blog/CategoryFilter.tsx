import React from 'react';
import { CategoryFilterMobile } from './CategoryFilterMobile';
import { CategoryFilterDesktop } from './CategoryFilterDesktop';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onCategoriesChange,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <CategoryFilterMobile
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoriesChange={onCategoriesChange}
      />
    );
  }

  return (
    <CategoryFilterDesktop
      categories={categories}
      selectedCategories={selectedCategories}
      onCategoriesChange={onCategoriesChange}
    />
  );
};