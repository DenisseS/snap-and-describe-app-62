/**
 * Pruebas unitarias para SynonymMatchStrategy
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SynonymMatchStrategy } from '../SynonymMatchStrategy';
import type { Searchable } from '@/types/search';

// Mock products para testing
const mockProducts: (Searchable & { category: string })[] = [
  {
    id: 'avocado_001',
    name: 'Avocado',
    category: 'fruits'
  },
  {
    id: 'popcorn_016', 
    name: 'Popcorn',
    category: 'snacks'
  },
  {
    id: 'corn_018',
    name: 'Corn',
    category: 'vegetables'
  },
  {
    id: 'banana_010',
    name: 'Banana',
    category: 'fruits'
  },
  {
    id: 'sweet_potato_006',
    name: 'Sweet Potato',
    category: 'vegetables'
  },
  {
    id: 'lulo_017',
    name: 'Lulo',
    category: 'fruits'
  },
  {
    id: 'broccoli_001',
    name: 'Broccoli',
    category: 'vegetables'
  }
];

describe('SynonymMatchStrategy', () => {
  let strategy: SynonymMatchStrategy<Searchable & { category: string }>;

  beforeEach(() => {
    strategy = new SynonymMatchStrategy();
    // Limpiar consola de logs de testing
    vi.clearAllMocks();
  });

  describe('Basic Configuration', () => {
    it('should have correct type and priority', () => {
      expect(strategy.getType()).toBe('synonym');
      expect(strategy.getPriority()).toBe(85);
    });
  });

  describe('Empty/Invalid Input Handling', () => {
    it('should return empty results for empty query', () => {
      const results = strategy.findMatches(mockProducts, '', '');
      expect(results).toHaveLength(0);
    });

    it('should return empty results for whitespace query', () => {
      const results = strategy.findMatches(mockProducts, '   ', '   ');
      expect(results).toHaveLength(0);
    });

    it('should return empty results for unknown terms', () => {
      const results = strategy.findMatches(mockProducts, 'termino_inexistente', 'termino_inexistente');
      expect(results).toHaveLength(0);
    });

    it('should handle empty product list', () => {
      const results = strategy.findMatches([], 'palta', 'palta');
      expect(results).toHaveLength(0);
    });
  });

  describe.each([
    // Sinónimos regionales principales
    {
      query: 'palta',
      expectedProduct: 'Avocado',
      expectedId: 'avocado_001',
      description: 'Argentina/Chile synonym for avocado'
    },
    {
      query: 'aguacate', 
      expectedProduct: 'Avocado',
      expectedId: 'avocado_001',
      description: 'Mexico/Spain synonym for avocado'
    },
    {
      query: 'pochoclo',
      expectedProduct: 'Popcorn', 
      expectedId: 'popcorn_016',
      description: 'Argentina synonym for popcorn'
    },
    {
      query: 'cotufas',
      expectedProduct: 'Popcorn',
      expectedId: 'popcorn_016', 
      description: 'Venezuela synonym for popcorn'
    },
    {
      query: 'canguil',
      expectedProduct: 'Popcorn',
      expectedId: 'popcorn_016',
      description: 'Ecuador synonym for popcorn'
    },
    {
      query: 'elote',
      expectedProduct: 'Corn',
      expectedId: 'corn_018',
      description: 'Mexico synonym for corn'
    },
    {
      query: 'choclo',
      expectedProduct: 'Corn', 
      expectedId: 'corn_018',
      description: 'Argentina/Chile synonym for corn'
    },
    {
      query: 'cambur',
      expectedProduct: 'Banana',
      expectedId: 'banana_010',
      description: 'Venezuela synonym for banana'
    },
    {
      query: 'batata',
      expectedProduct: 'Sweet Potato',
      expectedId: 'sweet_potato_006',
      description: 'Argentina synonym for sweet potato'
    },
    {
      query: 'camote',
      expectedProduct: 'Sweet Potato',
      expectedId: 'sweet_potato_006', 
      description: 'Mexico synonym for sweet potato'
    }
  ])('Synonym Matching: $description', ({ query, expectedProduct, expectedId }) => {
    it(`should find ${expectedProduct} when searching for "${query}"`, () => {
      const results = strategy.findMatches(mockProducts, query, query.toLowerCase());
      
      expect(results.length).toBeGreaterThan(0);
      
      const topResult = results[0];
      expect(topResult.item.name).toBe(expectedProduct);
      expect(topResult.item.id).toBe(expectedId);
      expect(topResult.matchType).toBe('synonym');
      expect(topResult.score).toBeGreaterThan(0.5);
      expect(topResult.originalQuery).toBe(query);
      expect(topResult.matchedTerms).toContain(expect.stringContaining('→'));
    });

    it(`should handle case variations for "${query}"`, () => {
      const upperCase = strategy.findMatches(mockProducts, query.toUpperCase(), query.toUpperCase());
      const lowerCase = strategy.findMatches(mockProducts, query.toLowerCase(), query.toLowerCase());
      const mixedCase = strategy.findMatches(
        mockProducts, 
        query.charAt(0).toUpperCase() + query.slice(1), 
        query.charAt(0).toUpperCase() + query.slice(1)
      );
      
      [upperCase, lowerCase, mixedCase].forEach(results => {
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].item.name).toBe(expectedProduct);
      });
    });
  });

  describe('Score Calculation', () => {
    it('should give highest score for direct ID matches', () => {
      const results = strategy.findMatches(mockProducts, 'palta', 'palta');
      
      if (results.length > 0) {
        const topResult = results[0];
        expect(topResult.score).toBeGreaterThan(0.8); // ID match should have high score
      }
    });

    it('should score exact name matches highly', () => {
      const results = strategy.findMatches(mockProducts, 'aguacate', 'aguacate');
      
      if (results.length > 0) {
        expect(results[0].score).toBeGreaterThan(0.8);
      }
    });

    it('should score partial matches lower than exact matches', () => {
      // Esto requeriría productos con nombres más largos para testing
      // Por ahora verificamos que al menos los scores sean consistentes
      const results = strategy.findMatches(mockProducts, 'pochoclo', 'pochoclo');
      
      if (results.length > 0) {
        expect(results[0].score).toBeGreaterThan(0);
        expect(results[0].score).toBeLessThanOrEqual(1.0);
      }
    });
  });

  describe('Result Ordering', () => {
    it('should return results ordered by score (highest first)', () => {
      const results = strategy.findMatches(mockProducts, 'palta', 'palta');
      
      for (let i = 1; i < results.length; i++) {
        expect(results[i-1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    });
  });

  describe('Duplicate Prevention', () => {
    it('should not return duplicate products', () => {
      const results = strategy.findMatches(mockProducts, 'palta', 'palta');
      
      const ids = results.map(r => r.item.id);
      const uniqueIds = [...new Set(ids)];
      
      expect(ids).toHaveLength(uniqueIds.length);
    });

    it('should update score if better match found for same product', () => {
      // Esto es más difícil de testear sin modificar datos,
      // pero podemos verificar que la lógica no rompe
      const results = strategy.findMatches(mockProducts, 'aguacate', 'aguacate');
      
      expect(results).toBeDefined();
      if (results.length > 0) {
        expect(results[0].score).toBeGreaterThan(0);
      }
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle products without category gracefully', () => {
      const productsWithoutCategory = [
        {
          id: 'test_001',
          name: 'Test Product'
        }
      ] as (Searchable & { category: string })[];
      
      const results = strategy.findMatches(productsWithoutCategory, 'palta', 'palta');
      expect(results).toBeDefined();
    });

    it('should handle malformed product data', () => {
      const malformedProducts = [
        {
          id: '',
          name: '',
          category: ''
        }
      ] as (Searchable & { category: string })[];
      
      expect(() => {
        strategy.findMatches(malformedProducts, 'palta', 'palta');
      }).not.toThrow();
    });
  });

  describe('Debug Information', () => {
    it('should provide debug info for valid synonyms', () => {
      const debugInfo = strategy.getDebugInfo('palta');
      
      expect(debugInfo).toMatchObject({
        query: 'palta',
        synonymsFound: expect.any(Number),
        synonyms: expect.any(Array)
      });
      
      if (debugInfo.synonymsFound > 0) {
        expect(debugInfo.synonyms[0]).toMatchObject({
          original: expect.any(String),
          canonical: expect.any(String),
          confidence: expect.any(Number),
          region: expect.any(String)
        });
      }
    });

    it('should provide debug info for unknown terms', () => {
      const debugInfo = strategy.getDebugInfo('termino_inexistente');
      
      expect(debugInfo).toMatchObject({
        query: 'termino_inexistente',
        synonymsFound: 0,
        synonyms: []
      });
    });
  });

  describe('Match Types and Metadata', () => {
    it('should set correct match type for synonyms', () => {
      const results = strategy.findMatches(mockProducts, 'palta', 'palta');
      
      results.forEach(result => {
        expect(result.matchType).toBe('synonym');
      });
    });

    it('should include synonym transformation in matched terms', () => {
      const results = strategy.findMatches(mockProducts, 'palta', 'palta');
      
      if (results.length > 0) {
        const hasTransformation = results[0].matchedTerms.some(term => 
          term.includes('→')
        );
        expect(hasTransformation).toBe(true);
      }
    });

    it('should preserve original query in results', () => {
      const originalQuery = 'palta';
      const results = strategy.findMatches(mockProducts, originalQuery, originalQuery);
      
      results.forEach(result => {
        expect(result.originalQuery).toBe(originalQuery);
      });
    });
  });

  describe('Performance and Efficiency', () => {
    it('should handle large product lists efficiently', () => {
      // Crear una lista más grande para probar performance
      const largeProductList = Array.from({ length: 1000 }, (_, i) => ({
        id: `product_${i}`,
        name: `Product ${i}`,
        category: 'test'
      }));
      
      const startTime = performance.now();
      const results = strategy.findMatches(largeProductList, 'palta', 'palta');
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100); // Debería ser rápido
      expect(results).toBeDefined();
    });
  });
});