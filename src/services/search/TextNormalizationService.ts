
/**
 * Servicio para normalización de texto en búsquedas usando Strategy pattern
 * Maneja acentos, mayúsculas y caracteres especiales
 */

import { 
  NormalizationStrategy, 
  StandardNormalizationStrategy,
  AggressiveNormalizationStrategy,
  ConservativeNormalizationStrategy,
  NormalizationOptions
} from './strategies/NormalizationStrategy';

export class TextNormalizationService {
  private static readonly DEFAULT_OPTIONS: NormalizationOptions = {
    removeAccents: true,
    toLowerCase: true,
    removeSpecialChars: true,
    trimWhitespace: true
  };

  private static strategies: Map<string, NormalizationStrategy> = new Map([
    ['standard', new StandardNormalizationStrategy(TextNormalizationService.DEFAULT_OPTIONS)],
    ['aggressive', new AggressiveNormalizationStrategy()],
    ['conservative', new ConservativeNormalizationStrategy()]
  ]);

  /**
   * Normaliza un texto para búsqueda usando la estrategia especificada
   */
  static normalize(text: string, options: Partial<NormalizationOptions> = {}, strategyName: string = 'standard'): string {
    if (!text) return '';
    
    // Si se proporcionan opciones específicas, usar estrategia estándar con esas opciones
    if (Object.keys(options).length > 0) {
      const config = { ...this.DEFAULT_OPTIONS, ...options };
      const customStrategy = new StandardNormalizationStrategy(config);
      return customStrategy.normalize(text);
    }

    // Usar estrategia predefinida
    const strategy = this.strategies.get(strategyName) || this.strategies.get('standard')!;
    return strategy.normalize(text);
  }

  /**
   * Normaliza múltiples términos
   */
  static normalizeTerms(terms: string[], options?: Partial<NormalizationOptions>): string[] {
    return terms
      .map(term => this.normalize(term, options))
      .filter(term => term.length > 0);
  }

  /**
   * Crea variaciones de un término para búsqueda
   */
  static createSearchVariations(term: string): string[] {
    const variations = new Set<string>();
    
    // Original
    variations.add(term);
    
    // Normalizado
    const normalized = this.normalize(term);
    variations.add(normalized);
    
    // Sin acentos pero con mayúsculas
    const withoutAccents = this.normalize(term, { removeAccents: true, toLowerCase: false });
    variations.add(withoutAccents);
    
    // Solo minúsculas
    const lowerCase = this.normalize(term, { removeAccents: false, toLowerCase: true });
    variations.add(lowerCase);

    return Array.from(variations).filter(v => v.length > 0);
  }
}
