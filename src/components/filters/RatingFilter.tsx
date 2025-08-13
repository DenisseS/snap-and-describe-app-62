
import React from 'react';
import { FilterCriteria } from '@/types/search';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';

interface RatingFilterProps {
  filters: FilterCriteria[];
  onAddFilter: (filter: FilterCriteria) => void;
  onRemoveFilter: (filter: FilterCriteria) => void;
}

const RatingFilter: React.FC<RatingFilterProps> = ({
  filters,
  onAddFilter,
  onRemoveFilter
}) => {
  const { t } = useTranslation();

  const ratingOptions = [
    { value: 8, label: '8+ excellent' },
    { value: 6, label: '6+ good' },
    { value: 4, label: '4+ fair' }
  ];

  const getActiveRatingFilter = () => {
    return filters.find(f => f.type === 'rating');
  };

  const isRatingActive = (rating: number) => {
    const activeFilter = getActiveRatingFilter();
    return activeFilter?.value === rating;
  };

  const selectRating = (rating: number) => {
    const existing = getActiveRatingFilter();
    
    if (existing && existing.value === rating) {
      onRemoveFilter(existing);
    } else {
      if (existing) {
        onRemoveFilter(existing);
      }
      onAddFilter({
        type: 'rating',
        field: 'rating',
        value: rating,
        operator: 'gte'
      });
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-900">{t('rating')}</h4>
      <div className="space-y-1">
        {ratingOptions.map((option) => {
          const isActive = isRatingActive(option.value);
          
          return (
            <button
              key={option.value}
              onClick={() => selectRating(option.value)}
              className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-colors w-full ${
                isActive
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-xs">
                {t(option.label, option.label)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RatingFilter;
