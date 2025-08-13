/**
 * Servicio de sinónimos optimizado para búsqueda O(1)
 * Agnóstico al usuario, usa términos genéricos como fallback
 */

import { SYNONYM_DATABASE, SynonymEntry } from '@/data/synonyms';
import { TextNormalizationService } from './TextNormalizationService';

export interface SynonymMatch {
  canonicalTerm: string;    // Término genérico
  originalTerm: string;     // Término buscado
  productId: string;        // ID del producto real para matching preciso
  confidence: number;       // Score de confianza
  regionInfo?: {           // Información regional opcional
    region: string;
    country: string;
    language?: string;
  };
}

export class SynonymService {
  private searchIndex: { [key: string]: SynonymEntry };
  private static instance: SynonymService;

  constructor() {
    this.searchIndex = SYNONYM_DATABASE.searchIndex;
  }

  /**
   * Singleton para optimizar memoria
   */
  static getInstance(): SynonymService {
    if (!this.instance) {
      this.instance = new SynonymService();
    }
    return this.instance;
  }

  /**
   * Busca sinónimos de un término - Búsqueda O(1)
   * @param term Término a buscar
   * @returns Array de matches encontrados
   */
  findSynonyms(term: string): SynonymMatch[] {
    if (!term || term.trim().length === 0) {
      console.log('SynonymService: Empty term provided');
      return [];
    }

    const normalizedTerm = TextNormalizationService.normalize(term, {}, 'standard');
    console.log(`SynonymService: Searching for "${term}" -> normalized: "${normalizedTerm}"`);
    console.log('SynonymService: Available terms in index:', Object.keys(this.searchIndex).slice(0, 10));
    
    const matches: SynonymMatch[] = [];

    // Búsqueda directa O(1)
    const synonymEntry = this.searchIndex[normalizedTerm];
    
    if (synonymEntry) {
      console.log(`SynonymService: Found synonym match for "${normalizedTerm}":`, synonymEntry);
      matches.push({
        canonicalTerm: synonymEntry.canonical,
        originalTerm: term,
        productId: synonymEntry.productId,
        confidence: synonymEntry.confidence,
        regionInfo: synonymEntry.regionInfo
      });
    } else {
      console.log(`SynonymService: No synonym found for "${normalizedTerm}"`);
    }

    console.log(`SynonymService: Returning ${matches.length} matches`);
    return matches;
  }

  /**
   * Verifica si un término tiene sinónimos
   */
  hasSynonyms(term: string): boolean {
    const normalizedTerm = TextNormalizationService.normalize(term, {}, 'standard');
    return !!this.searchIndex[normalizedTerm];
  }

  /**
   * Obtiene el término canónico para un término dado
   */
  getCanonicalTerm(term: string): string | null {
    const normalizedTerm = TextNormalizationService.normalize(term, {}, 'standard');
    const entry = this.searchIndex[normalizedTerm];
    return entry ? entry.canonical : null;
  }

  /**
   * Obtiene información regional de un término
   */
  getRegionInfo(term: string): SynonymMatch['regionInfo'] | null {
    const normalizedTerm = TextNormalizationService.normalize(term, {}, 'standard');
    const entry = this.searchIndex[normalizedTerm];
    return entry?.regionInfo || null;
  }

  /**
   * Obtiene estadísticas del índice de sinónimos
   */
  getStats(): { totalTerms: number; withRegionInfo: number } {
    const total = Object.keys(this.searchIndex).length;
    const withRegion = Object.values(this.searchIndex)
      .filter(entry => !!entry.regionInfo).length;
    
    return {
      totalTerms: total,
      withRegionInfo: withRegion
    };
  }

  /**
   * Busca todos los sinónimos de un término canónico
   * Útil para mostrar variaciones regionales
   */
  findAllVariations(canonicalTerm: string): SynonymMatch[] {
    const normalizedCanonical = TextNormalizationService.normalize(canonicalTerm, {}, 'standard');
    const variations: SynonymMatch[] = [];

    // Buscar todos los términos que mapean al mismo canónico
    Object.entries(this.searchIndex).forEach(([term, entry]) => {
      const normalizedEntry = TextNormalizationService.normalize(entry.canonical, {}, 'standard');
      
      if (normalizedEntry === normalizedCanonical && term !== normalizedCanonical) {
        variations.push({
          canonicalTerm: entry.canonical,
          originalTerm: term,
          productId: entry.productId,
          confidence: entry.confidence,
          regionInfo: entry.regionInfo
        });
      }
    });

    return variations;
  }
}