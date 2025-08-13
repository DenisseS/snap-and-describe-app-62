
import React from 'react';
import { FilterCriteria } from '@/types/search';
import { useTranslation } from 'react-i18next';
import { X, Filter, ArrowLeft } from 'lucide-react';
import AllergenFilter from './AllergenFilter';
import CategoryFilter from './CategoryFilter';
import NutritionFilter from './NutritionFilter';
import RatingFilter from './RatingFilter';

interface FilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: FilterCriteria[];
  onFiltersChange: (filters: FilterCriteria[]) => void;
  appliedCount?: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  appliedCount = 0,
}) => {
  const {t} = useTranslation();

  const addFilter = (filter: FilterCriteria) => {
    // Remove existing filter of same type and field if exists
    const newFilters = filters.filter(f => !(f.type === filter.type && f.field === filter.field));
    newFilters.push(filter);
    onFiltersChange(newFilters);
  };

  const removeFilter = (filterToRemove: FilterCriteria) => {
    const newFilters = filters.filter(f =>
      !(f.type === filterToRemove.type && f.field === filterToRemove.field)
    );
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  // Collapsed state (mini button)
  if (!isOpen) {
    return (
      <div className="px-4 py-2 border-b bg-white z-50 relative">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
        >
          <Filter className="w-4 h-4"/>
          {t('filters')}
          {appliedCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              {appliedCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full pb-20">
      {/* Header */}
      <div className="px-4 py-4 border-b flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-full -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5"/>
            <span className="font-semibold text-lg">{t('filters')}</span>
            {appliedCount > 0 && (
              <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full">
                  {appliedCount}
                </span>
            )}
          </div>
        </div>
        {appliedCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50"
          >
            {t('clearAll')}
          </button>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          <NutritionFilter
            filters={filters}
            onAddFilter={addFilter}
            onRemoveFilter={removeFilter}
          />
          <CategoryFilter
            filters={filters}
            onAddFilter={addFilter}
            onRemoveFilter={removeFilter}
          />
          <RatingFilter
            filters={filters}
            onAddFilter={addFilter}
            onRemoveFilter={removeFilter}
          />
          <AllergenFilter
            filters={filters}
            onAddFilter={addFilter}
            onRemoveFilter={removeFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
