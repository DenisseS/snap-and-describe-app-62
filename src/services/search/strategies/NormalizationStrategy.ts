/**
 * Strategy pattern para diferentes estrategias de normalización de texto
 */

export interface NormalizationOptions {
  removeAccents: boolean;
  toLowerCase: boolean;
  removeSpecialChars: boolean;
  trimWhitespace: boolean;
}

export interface NormalizationStrategy {
  normalize(text: string): string;
  getName(): string;
}

/**
 * Estrategia de normalización estándar para búsquedas
 */
export class StandardNormalizationStrategy implements NormalizationStrategy {
  constructor(private options: NormalizationOptions) {}

  normalize(text: string): string {
    if (!text) return '';
    
    let normalized = text;

    // Trimear espacios
    if (this.options.trimWhitespace) {
      normalized = normalized.trim();
    }

    // Convertir a minúsculas
    if (this.options.toLowerCase) {
      normalized = normalized.toLowerCase();
    }

    // Remover acentos usando normalización Unicode
    if (this.options.removeAccents) {
      normalized = normalized
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }

    // Remover caracteres especiales pero mantener espacios
    if (this.options.removeSpecialChars) {
      normalized = normalized.replace(/[^\w\s]/g, '');
    }

    // Normalizar espacios múltiples
    normalized = normalized.replace(/\s+/g, ' ');

    return normalized;
  }

  getName(): string {
    return 'standard';
  }
}

/**
 * Estrategia de normalización agresiva para matches fuzzy
 */
export class AggressiveNormalizationStrategy implements NormalizationStrategy {
  normalize(text: string): string {
    if (!text) return '';
    
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^\w]/g, '');
  }

  getName(): string {
    return 'aggressive';
  }
}

/**
 * Estrategia de normalización conservadora que mantiene más características del texto original
 */
export class ConservativeNormalizationStrategy implements NormalizationStrategy {
  normalize(text: string): string {
    if (!text) return '';
    
    return text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  getName(): string {
    return 'conservative';
  }
}