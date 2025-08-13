/**
 * Chain of Responsibility pattern para ejecutar estrategias de búsqueda en orden de prioridad
 */

import { Searchable } from '@/types/search';
import { SearchResult, SearchOptions } from './types';
import { MatchStrategy } from './strategies/MatchStrategy';

export class SearchStrategyChain<T extends Searchable> {
  private strategies: MatchStrategy<T>[] = [];

  /**
   * Añade una estrategia a la cadena
   */
  addStrategy(strategy: MatchStrategy<T>): this {
    this.strategies.push(strategy);
    // Ordenar por prioridad (mayor prioridad primero)
    this.strategies.sort((a, b) => b.getPriority() - a.getPriority());
    return this;
  }

  /**
   * Ejecuta las estrategias en orden de prioridad hasta encontrar resultados suficientes
   */
  executeSearch(items: T[], query: string, normalizedQuery: string, options: SearchOptions): SearchResult<T>[] {
    let allResults: SearchResult<T>[] = [];

    for (const strategy of this.strategies) {
      console.log(`Executing strategy: ${strategy.getType()}`);
      
      const strategyResults = strategy.findMatches(items, query, normalizedQuery);
      
      if (strategyResults.length > 0) {
        console.log(`Strategy ${strategy.getType()} found ${strategyResults.length} results`);
        
        // Para estrategias de alta prioridad (exact, starts_with), retornar inmediatamente
        if (strategy.getPriority() >= 90 && strategyResults.length > 0) {
          return this.limitAndSort(strategyResults, options);
        }
        
        // Para otras estrategias, acumular resultados
        allResults.push(...strategyResults);
      }
    }

    // Si no hay resultados de alta prioridad, retornar todos los resultados ordenados
    return this.limitAndSort(allResults, options);
  }

  /**
   * Aplica filtros, límites y ordenamiento a los resultados
   */
  private limitAndSort(results: SearchResult<T>[], options: SearchOptions): SearchResult<T>[] {
    // Remover duplicados basado en item.id
    const uniqueResults = results.filter((result, index, self) => 
      self.findIndex(r => r.item.id === result.item.id) === index
    );

    // Filtrar por score mínimo
    const filteredResults = uniqueResults
      .filter(result => !options.minScore || result.score >= options.minScore)
      .sort((a, b) => {
        // Primero ordenar por score (mayor score primero)
        if (Math.abs(a.score - b.score) > 0.01) {
          return b.score - a.score;
        }
        // En caso de empate, ordenar alfabéticamente
        return a.item.name.localeCompare(b.item.name);
      });

    return options.maxResults 
      ? filteredResults.slice(0, options.maxResults)
      : filteredResults;
  }

  /**
   * Retorna todas las estrategias registradas
   */
  getStrategies(): MatchStrategy<T>[] {
    return [...this.strategies];
  }

  /**
   * Limpia todas las estrategias
   */
  clearStrategies(): void {
    this.strategies = [];
  }
}