
import { Searchable } from '@/types/search';
import { TextNormalizationService } from './TextNormalizationService';
import { SearchResult, SearchOptions } from './types';
import { SearchStrategyChain } from './SearchStrategyChain';
import { ExactMatchStrategy, StartsWithMatchStrategy, ContainsMatchStrategy } from './strategies/MatchStrategy';
import { FuzzyMatchStrategy } from './strategies/FuzzyMatchStrategy';
import { SynonymMatchStrategy } from './strategies/SynonymMatchStrategy';

/**
 * Motor de búsqueda híbrido refactorizado usando Strategy pattern y Chain of Responsibility
 * Implementa scoring inteligente que prioriza:
 * 1. Matches exactos
 * 2. Matches que empiezan con el término (starts with)
 * 3. Matches de sinónimos regionales (canguil → palomitas de maíz)
 * 4. Matches fuzzy para errores tipográficos
 * 5. Matches parciales (contains)
 */
export class HybridSearchEngine<T extends Searchable> {
  private items: T[];
  private strategyChain: SearchStrategyChain<T>;

  constructor(items: T[]) {
    this.items = items;
    this.strategyChain = this.initializeStrategyChain();
  }

  /**
   * Inicializa la cadena de estrategias de búsqueda
   */
  private initializeStrategyChain(): SearchStrategyChain<T> {
    const normalizer = (text: string) => TextNormalizationService.normalize(text, {}, 'standard');
    
    const chain = new SearchStrategyChain<T>();
    
    // Añadir estrategias en orden de prioridad
    chain
      .addStrategy(new ExactMatchStrategy<T>(normalizer))        // Prioridad 100
      .addStrategy(new StartsWithMatchStrategy<T>(normalizer))   // Prioridad 90
      .addStrategy(new SynonymMatchStrategy<T>())                // Prioridad 85
      .addStrategy(new FuzzyMatchStrategy<T>(this.items))        // Prioridad 80
      .addStrategy(new ContainsMatchStrategy<T>(normalizer));    // Prioridad 70

    return chain;
  }

  /**
   * Realiza búsqueda híbrida usando Chain of Responsibility
   * Ejecuta estrategias en orden de prioridad con scoring inteligente
   */
  search(query: string, options: SearchOptions = { threshold: 0.4 }): SearchResult<T>[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const normalizedQuery = TextNormalizationService.normalize(query, {}, 'standard');
    
    console.log('HybridSearchEngine: Executing search for:', query);
    console.log('HybridSearchEngine: Normalized query:', normalizedQuery);

    // Ejecutar cadena de estrategias
    const results = this.strategyChain.executeSearch(this.items, query, normalizedQuery, options);
    
    console.log(`HybridSearchEngine: Found ${results.length} total results`);
    
    return results;
  }

  /**
   * Obtiene información sobre las estrategias registradas
   */
  getStrategiesInfo(): { type: string; priority: number }[] {
    return this.strategyChain.getStrategies().map(strategy => ({
      type: strategy.getType(),
      priority: strategy.getPriority()
    }));
  }

  /**
   * Actualiza los elementos y reinicializa las estrategias
   */
  updateItems(items: T[]): void {
    this.items = items;
    // Reinicializar la cadena de estrategias con los nuevos items
    this.strategyChain = this.initializeStrategyChain();
  }
}
