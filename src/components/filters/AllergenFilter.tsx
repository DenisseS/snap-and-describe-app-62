
import React from 'react';
import { FilterCriteria } from '@/types/search';
import { useTranslation } from 'react-i18next';
import { getPriorityAllergens } from '@/data/allergens';

interface AllergenFilterProps {
  filters: FilterCriteria[];
  onAddFilter: (filter: FilterCriteria) => void;
  onRemoveFilter: (filter: FilterCriteria) => void;
}

const AllergenFilter: React.FC<AllergenFilterProps> = ({
  filters,
  onAddFilter,
  onRemoveFilter
}) => {
  const { t } = useTranslation();
  const allergens = getPriorityAllergens().slice(0, 6); // Top 6 allergens

  const getActiveAllergenFilters = () => {
    return filters.filter(f => f.type === 'allergen');
  };

  const isAllergenActive = (allergenId: string) => {
    return getActiveAllergenFilters().some(f => f.field === allergenId);
  };

  const toggleAllergen = (allergenId: string) => {
    console.log('AllergenFilter: Toggling allergen', allergenId);
    const existing = filters.find(f => f.type === 'allergen' && f.field === allergenId);
    
    if (existing) {
      console.log('AllergenFilter: Removing existing filter', existing);
      onRemoveFilter(existing);
    } else {
      const newFilter: FilterCriteria = {
        type: 'allergen',
        field: allergenId,
        value: true, // true means product is safe for this allergen (doesn't contain it)
        operator: 'equals'
      };
      console.log('AllergenFilter: Adding new filter', newFilter);
      onAddFilter(newFilter);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-900">{t('allergens')}</h4>
      <div className="grid grid-cols-2 gap-2">
        {allergens.map((allergen) => {
          const isActive = isAllergenActive(allergen.id);
          const IconComponent = allergen.icon;
          
          return (
            <button
              key={allergen.id}
              onClick={() => toggleAllergen(allergen.id)}
              className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className={`p-1 rounded ${allergen.colors.iconBg}`}>
                <IconComponent className={`w-3 h-3 ${allergen.colors.iconColor}`} />
              </div>
              <span className="text-xs truncate">
                {t(allergen.translationKey, allergen.name)}
              </span>
            </button>
          );
        })}
      </div>
      {getActiveAllergenFilters().length > 0 && (
        <p className="text-xs text-gray-500">
          {t('showingProductsWithoutSelectedAllergens', 'Showing products without selected allergens')}
        </p>
      )}
    </div>
  );
};

export default AllergenFilter;
