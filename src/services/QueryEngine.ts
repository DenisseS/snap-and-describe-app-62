
import { Searchable, FilterCriteria, QueryOptions, QueryResult, FilterDefinition } from '@/types/search';
import { HybridSearchEngine } from './search/HybridSearchEngine';

export class QueryEngine<T extends Searchable> {
  private filterRegistry: Map<string, FilterDefinition> = new Map();
  private searchEngine: HybridSearchEngine<T> | null = null;

  registerFilter(definition: FilterDefinition) {
    this.filterRegistry.set(definition.type, definition);
  }

  executeQuery(items: T[], options: QueryOptions = {}): QueryResult<T> {
    let filteredItems = [...items];
    const appliedFilters: FilterCriteria[] = [];

    // Inicializar/actualizar motor de búsqueda si es necesario
    if (!this.searchEngine) {
      this.searchEngine = new HybridSearchEngine(items);
    } else {
      this.searchEngine.updateItems(items);
    }

    // Aplicar búsqueda de texto con el nuevo motor híbrido
    if (options.searchTerm && options.searchTerm.trim()) {
      console.log('QueryEngine: Executing hybrid search for:', options.searchTerm);
      
      const searchResults = this.searchEngine.search(options.searchTerm, {
        threshold: 0.4,
        maxResults: 1000 // Sin límite para mantener compatibilidad
      });

      // Extraer items de los resultados de búsqueda
      filteredItems = searchResults.map(result => result.item);
      
      console.log(`QueryEngine: Search found ${filteredItems.length} results`);
    }

    // Aplicar filtros (mantener lógica existente)
    if (options.filters) {
      for (const filter of options.filters) {
        const filterDef = this.filterRegistry.get(filter.type);
        if (filterDef) {
          filteredItems = filterDef.applyFilter(filteredItems, filter) as T[];
          appliedFilters.push(filter);
        }
      }
    }

    // Aplicar ordenamiento (mantener lógica existente)
    if (options.sortBy) {
      filteredItems.sort((a, b) => {
        const aValue = (a as any)[options.sortBy!];
        const bValue = (b as any)[options.sortBy!];
        
        if (options.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return {
      items: filteredItems,
      totalCount: filteredItems.length,
      appliedFilters
    };
  }

  getRegisteredFilters(): FilterDefinition[] {
    return Array.from(this.filterRegistry.values());
  }
}
