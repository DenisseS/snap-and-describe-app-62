/**
 * Estrategia de matching fuzzy usando Fuse.js
 */

import Fuse from 'fuse.js';
import { Searchable } from '@/types/search';
import { SearchResult, SearchOptions } from '../types';
import { MatchStrategy } from './MatchStrategy';

export class FuzzyMatchStrategy<T extends Searchable> implements MatchStrategy<T> {
  private fuse: Fuse<T>;

  constructor(items: T[]) {
    this.fuse = new Fuse(items, this.getFuseConfig());
  }

  private getFuseConfig() {
    return {
      threshold: 0.3,        // Más estricto para evitar matches irrelevantes
      location: 0,           // Posición esperada del match
      distance: 50,          // Distancia máxima reducida
      maxPatternLength: 32,  // Máximo patrón de búsqueda
      minMatchCharLength: 3, // Mínimo de 3 caracteres para evitar matches débiles
      keys: [
        { name: 'name', weight: 0.8 },
        { name: 'category', weight: 0.3 }
      ],
      includeScore: true,
      includeMatches: true,
      shouldSort: true
    };
  }

  findMatches(items: T[], query: string, normalizedQuery: string): SearchResult<T>[] {
    // Actualizar items si es necesario
    this.updateItems(items);

    const fuseResults = this.fuse.search(query);
    const results: SearchResult<T>[] = [];

    for (const fuseResult of fuseResults) {
      const { item, score = 1 } = fuseResult;
      
      // Convertir score de Fuse.js (0 es mejor) a nuestro sistema (1 es mejor)
      // Aplicar score más conservador para fuzzy matches
      const fuzzyScore = Math.max(0, (1 - score) * 0.7);

      // Solo incluir si el score es suficientemente alto
      if (fuzzyScore < 0.3) continue;

      const matchedTerms = fuseResult.matches
        ? fuseResult.matches.map(match => match.value || '')
        : [item.name];

      results.push({
        item,
        score: fuzzyScore,
        matchType: 'fuzzy',
        matchedTerms,
        originalQuery: query
      });
    }

    return results;
  }

  updateItems(items: T[]): void {
    this.fuse = new Fuse(items, this.getFuseConfig());
  }

  getType(): string {
    return 'fuzzy';
  }

  getPriority(): number {
    return 80;
  }
}