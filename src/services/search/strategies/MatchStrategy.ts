/**
 * Strategy pattern para diferentes estrategias de matching
 */

import { Searchable } from '@/types/search';
import { SearchResult } from '../types';

export interface MatchStrategy<T extends Searchable> {
  findMatches(items: T[], query: string, normalizedQuery: string): SearchResult<T>[];
  getType(): string;
  getPriority(): number;
}

/**
 * Estrategia de match exacto
 */
export class ExactMatchStrategy<T extends Searchable> implements MatchStrategy<T> {
  constructor(private normalizer: (text: string) => string) {}

  findMatches(items: T[], query: string, normalizedQuery: string): SearchResult<T>[] {
    const results: SearchResult<T>[] = [];

    for (const item of items) {
      const normalizedName = this.normalizer(item.name);
      const normalizedCategory = this.normalizer((item as any).category || '');

      // Match exacto en nombre (prioridad máxima)
      if (normalizedName === normalizedQuery) {
        results.push({
          item,
          score: 1.0,
          matchType: 'exact',
          matchedTerms: [item.name],
          originalQuery: query
        });
        continue;
      }

      // Match exacto en categoría
      if (normalizedCategory === normalizedQuery) {
        results.push({
          item,
          score: 0.95,
          matchType: 'exact',
          matchedTerms: [(item as any).category || ''],
          originalQuery: query
        });
      }
    }

    return results;
  }

  getType(): string {
    return 'exact';
  }

  getPriority(): number {
    return 100;
  }
}

/**
 * Estrategia de match que empieza con el término (starts with)
 */
export class StartsWithMatchStrategy<T extends Searchable> implements MatchStrategy<T> {
  constructor(private normalizer: (text: string) => string) {}

  findMatches(items: T[], query: string, normalizedQuery: string): SearchResult<T>[] {
    const results: SearchResult<T>[] = [];

    for (const item of items) {
      const normalizedName = this.normalizer(item.name);
      const normalizedCategory = this.normalizer((item as any).category || '');

      let matchScore = 0;
      const matchedTerms: string[] = [];

      // Match que empieza con el término en nombre (alta prioridad)
      if (normalizedName.startsWith(normalizedQuery)) {
        // Score más alto cuanto más similar sea la longitud
        const lengthRatio = normalizedQuery.length / normalizedName.length;
        matchScore = Math.max(matchScore, 0.85 + (lengthRatio * 0.1));
        matchedTerms.push(item.name);
      }

      // Match que empieza con el término en categoría
      if (normalizedCategory.startsWith(normalizedQuery)) {
        matchScore = Math.max(matchScore, 0.75);
        matchedTerms.push((item as any).category || '');
      }

      if (matchScore > 0) {
        results.push({
          item,
          score: matchScore,
          matchType: 'partial',
          matchedTerms,
          originalQuery: query
        });
      }
    }

    return results;
  }

  getType(): string {
    return 'starts_with';
  }

  getPriority(): number {
    return 90;
  }
}

/**
 * Estrategia de match parcial (contains)
 */
export class ContainsMatchStrategy<T extends Searchable> implements MatchStrategy<T> {
  constructor(private normalizer: (text: string) => string) {}

  findMatches(items: T[], query: string, normalizedQuery: string): SearchResult<T>[] {
    const results: SearchResult<T>[] = [];

    // Solo aplicar si el query tiene suficiente longitud para evitar matches débiles
    if (normalizedQuery.length < 3) {
      return results;
    }

    for (const item of items) {
      const normalizedName = this.normalizer(item.name);
      const normalizedCategory = this.normalizer((item as any).category || '');

      let matchScore = 0;
      const matchedTerms: string[] = [];

      // Match parcial en nombre
      if (normalizedName.includes(normalizedQuery)) {
        // Score basado en la posición y longitud relativa
        const position = normalizedName.indexOf(normalizedQuery);
        const lengthRatio = normalizedQuery.length / normalizedName.length;
        
        // Menor score cuanto más tarde aparezca el match
        const positionPenalty = position / normalizedName.length;
        matchScore = Math.max(matchScore, (0.6 + lengthRatio * 0.2) * (1 - positionPenalty * 0.3));
        matchedTerms.push(item.name);
      }

      // Match parcial en categoría (score más bajo)
      if (normalizedCategory.includes(normalizedQuery)) {
        matchScore = Math.max(matchScore, 0.4);
        matchedTerms.push((item as any).category || '');
      }

      if (matchScore > 0) {
        results.push({
          item,
          score: matchScore,
          matchType: 'partial',
          matchedTerms,
          originalQuery: query
        });
      }
    }

    return results;
  }

  getType(): string {
    return 'contains';
  }

  getPriority(): number {
    return 70;
  }
}