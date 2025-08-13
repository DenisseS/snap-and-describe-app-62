
// Base interfaces for the extensible search system

export interface Searchable {
  id: string;
  name: string;
  [key: string]: any;
}

export interface FilterCriteria {
  type: string;
  field: string;
  value: any;
  operator?: 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in';
}

export interface QueryOptions {
  searchTerm?: string;
  filters?: FilterCriteria[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface QueryResult<T extends Searchable> {
  items: T[];
  totalCount: number;
  appliedFilters: FilterCriteria[];
}

export interface FilterDefinition {
  type: string;
  label: string;
  component: React.ComponentType<any>;
  applyFilter: (items: Searchable[], criteria: FilterCriteria) => Searchable[];
}
