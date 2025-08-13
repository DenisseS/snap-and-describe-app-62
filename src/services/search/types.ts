
import { Searchable } from '@/types/search';

export interface SearchResult<T extends Searchable> {
  item: T;
  score: number;
  matchType: 'exact' | 'fuzzy' | 'partial' | 'synonym';
  matchedTerms: string[];
  originalQuery: string;
}

export interface SearchOptions {
  threshold: number;        // 0-1, tolerancia para fuzzy search
  maxResults?: number;      // Máximo número de resultados
  minScore?: number;        // Score mínimo para incluir resultado
}
