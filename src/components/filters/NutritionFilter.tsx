
import React from 'react';
import { FilterCriteria } from '@/types/search';
import { useTranslation } from 'react-i18next';

interface NutritionFilterProps {
  filters: FilterCriteria[];
  onAddFilter: (filter: FilterCriteria) => void;
  onRemoveFilter: (filter: FilterCriteria) => void;
}

const NutritionFilter: React.FC<NutritionFilterProps> = ({
  filters,
  onAddFilter,
  onRemoveFilter
}) => {
  const { t } = useTranslation();

  const nutritionOptions = [
    { field: 'protein.total', value: 10, label: 'High Protein (10g+)' },
    { field: 'fiber.total', value: 5, label: 'High Fiber (5g+)' },
    { field: 'sodium', value: 300, label: 'Low Sodium (<300mg)', operator: 'lte' as const },
    { field: 'vitaminC', value: 20, label: 'High Vitamin C (20mg+)' },
    { field: 'iron', value: 3, label: 'High Iron (3mg+)' },
  ];

  const getActiveNutritionFilters = () => {
    return filters.filter(f => f.type === 'nutrition');
  };

  const isNutritionActive = (field: string) => {
    return getActiveNutritionFilters().some(f => f.field === field);
  };

  const toggleNutrition = (option: typeof nutritionOptions[0]) => {
    const existing = filters.find(f => f.type === 'nutrition' && f.field === option.field);
    
    if (existing) {
      onRemoveFilter(existing);
    } else {
      onAddFilter({
        type: 'nutrition',
        field: option.field,
        value: option.value,
        operator: option.operator || 'gte'
      });
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-900">{t('nutrition')}</h4>
      <div className="space-y-1">
        {nutritionOptions.map((option) => {
          const isActive = isNutritionActive(option.field);
          
          return (
            <button
              key={option.field}
              onClick={() => toggleNutrition(option)}
              className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-colors w-full text-left ${
                isActive
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span className="text-xs">
                {t(option.label, option.label)}
              </span>
            </button>
          );
        })}
      </div>
      {getActiveNutritionFilters().length > 0 && (
        <p className="text-xs text-gray-500">
          {t('nutritionFiltersApplied')}
        </p>
      )}
    </div>
  );
};

export default NutritionFilter;
