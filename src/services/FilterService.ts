
import { QueryEngine } from './QueryEngine';
import { FilterDefinition, Searchable, FilterCriteria } from '@/types/search';

// Create a generic query engine instance
export const queryEngine = new QueryEngine<Searchable>();

// Filter definitions for different types
const categoryFilter: FilterDefinition = {
  type: 'category',
  label: 'Category',
  component: null as any, // Will be set by components
  applyFilter: (items: Searchable[], criteria: FilterCriteria) => {
    return items.filter(item => 
      (item as any).category === criteria.value
    );
  }
};

const allergenFilter: FilterDefinition = {
  type: 'allergen',
  label: 'Allergen',
  component: null as any,
  applyFilter: (items: Searchable[], criteria: FilterCriteria) => {
    return items.filter(item => {
      const allergens = (item as any).allergens;
      if (!allergens) return false;
      // criteria.field is the allergen type (e.g., 'glutenFree')
      // criteria.value is true (meaning we want products that are safe for this allergen)
      return allergens[criteria.field] === criteria.value;
    });
  }
};

const ratingFilter: FilterDefinition = {
  type: 'rating',
  label: 'Rating',
  component: null as any,
  applyFilter: (items: Searchable[], criteria: FilterCriteria) => {
    return items.filter(item => {
      const rating = (item as any).rating;
      if (!rating) return false;
      
      switch (criteria.operator) {
        case 'gte':
          return rating >= criteria.value;
        case 'lte':
          return rating <= criteria.value;
        case 'gt':
          return rating > criteria.value;
        case 'lt':
          return rating < criteria.value;
        default:
          return rating === criteria.value;
      }
    });
  }
};

const nutritionFilter: FilterDefinition = {
  type: 'nutrition',
  label: 'Nutrition',
  component: null as any,
  applyFilter: (items: Searchable[], criteria: FilterCriteria) => {
    return items.filter(item => {
      const nutrition = (item as any).nutrition;
      if (!nutrition) return false;
      
      // criteria.field could be like 'protein.total', 'calories.total', etc.
      const fieldParts = criteria.field.split('.');
      let value = nutrition;
      
      for (const part of fieldParts) {
        value = value?.[part];
        if (value === undefined) return false;
      }
      
      switch (criteria.operator) {
        case 'gte':
          return value >= criteria.value;
        case 'lte':
          return value <= criteria.value;
        case 'gt':
          return value > criteria.value;
        case 'lt':
          return value < criteria.value;
        default:
          return value === criteria.value;
      }
    });
  }
};

// Register all filters
queryEngine.registerFilter(categoryFilter);
queryEngine.registerFilter(allergenFilter);
queryEngine.registerFilter(ratingFilter);
queryEngine.registerFilter(nutritionFilter);
