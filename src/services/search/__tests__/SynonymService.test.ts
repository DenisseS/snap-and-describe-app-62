/**
 * Pruebas unitarias para SynonymService
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SynonymService } from '../SynonymService';

describe('SynonymService', () => {
  let synonymService: SynonymService;

  beforeEach(() => {
    synonymService = SynonymService.getInstance();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = SynonymService.getInstance();
      const instance2 = SynonymService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('findSynonyms - Basic Functionality', () => {
    it('should return empty array for empty term', () => {
      expect(synonymService.findSynonyms('')).toEqual([]);
      expect(synonymService.findSynonyms('   ')).toEqual([]);
    });

    it('should return empty array for unknown terms', () => {
      expect(synonymService.findSynonyms('termino_inexistente')).toEqual([]);
      expect(synonymService.findSynonyms('xyz123')).toEqual([]);
    });
  });

  describe.each([
    // Casos de sinónimos regionales - América Latina
    { 
      synonym: 'palta', 
      canonical: 'avocado', 
      productId: 'avocado_001',
      region: 'AR',
      country: 'Argentina'
    },
    { 
      synonym: 'aguacate', 
      canonical: 'avocado', 
      productId: 'avocado_001',
      region: 'MX',
      country: 'México'
    },
    // Casos de palomitas - múltiples regionalismos
    { 
      synonym: 'pochoclo', 
      canonical: 'popcorn', 
      productId: 'popcorn_016',
      region: 'AR',
      country: 'Argentina'
    },
    { 
      synonym: 'cotufas', 
      canonical: 'popcorn', 
      productId: 'popcorn_016',
      region: 'VE',
      country: 'Venezuela'
    },
    { 
      synonym: 'cabritas', 
      canonical: 'popcorn', 
      productId: 'popcorn_016',
      region: 'CL',
      country: 'Chile'
    },
    { 
      synonym: 'canguil', 
      canonical: 'popcorn', 
      productId: 'popcorn_016',
      region: 'EC',
      country: 'Ecuador'
    },
    // Casos de maíz
    { 
      synonym: 'elote', 
      canonical: 'corn', 
      productId: 'corn_018',
      region: 'MX',
      country: 'México'
    },
    { 
      synonym: 'choclo', 
      canonical: 'corn', 
      productId: 'corn_018',
      region: 'AR',
      country: 'Argentina'
    },
    // Casos de plátano
    { 
      synonym: 'cambur', 
      canonical: 'banana', 
      productId: 'banana_010',
      region: 'VE',
      country: 'Venezuela'
    },
    { 
      synonym: 'guineo', 
      canonical: 'banana', 
      productId: 'banana_010',
      region: 'DO',
      country: 'República Dominicana'
    },
    // Casos de papa dulce
    { 
      synonym: 'batata', 
      canonical: 'sweet potato', 
      productId: 'sweet_potato_006',
      region: 'AR',
      country: 'Argentina'
    },
    { 
      synonym: 'camote', 
      canonical: 'sweet potato', 
      productId: 'sweet_potato_006',
      region: 'MX',
      country: 'México'
    }
  ])('Regional Synonyms: $synonym → $canonical', ({ synonym, canonical, productId, region, country }) => {
    it(`should find synonym match for "${synonym}"`, () => {
      const matches = synonymService.findSynonyms(synonym);
      
      expect(matches).toHaveLength(1);
      expect(matches[0]).toMatchObject({
        canonicalTerm: canonical,
        originalTerm: synonym,
        productId: productId,
        confidence: 0.9,
        regionInfo: {
          region: region,
          country: country,
          language: expect.any(String)
        }
      });
    });

    it(`should be case insensitive for "${synonym}"`, () => {
      const upperCase = synonymService.findSynonyms(synonym.toUpperCase());
      const lowerCase = synonymService.findSynonyms(synonym.toLowerCase());
      const mixedCase = synonymService.findSynonyms(
        synonym.charAt(0).toUpperCase() + synonym.slice(1).toLowerCase()
      );
      
      expect(upperCase).toHaveLength(1);
      expect(lowerCase).toHaveLength(1);
      expect(mixedCase).toHaveLength(1);
      
      expect(upperCase[0].canonicalTerm).toBe(canonical);
      expect(lowerCase[0].canonicalTerm).toBe(canonical);
      expect(mixedCase[0].canonicalTerm).toBe(canonical);
    });
  });

  describe.each([
    // Términos canónicos - deberían encontrarse a sí mismos
    { term: 'avocado', productId: 'avocado_001', confidence: 1.0 },
    { term: 'popcorn', productId: 'popcorn_016', confidence: 1.0 },
    { term: 'corn', productId: 'corn_018', confidence: 1.0 },
    { term: 'banana', productId: 'banana_010', confidence: 1.0 },
    { term: 'sweet potato', productId: 'sweet_potato_006', confidence: 1.0 }
  ])('Canonical Terms: $term', ({ term, productId, confidence }) => {
    it(`should find canonical term "${term}" with confidence ${confidence}`, () => {
      const matches = synonymService.findSynonyms(term);
      
      expect(matches).toHaveLength(1);
      expect(matches[0]).toMatchObject({
        canonicalTerm: term,
        originalTerm: term,
        productId: productId,
        confidence: confidence
      });
      expect(matches[0].regionInfo).toBeUndefined();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it.each([
      'palta123',     // Sinónimo válido con números
      'aguacate_xyz', // Sinónimo válido con guión bajo
      'pochocl0',     // Error tipográfico con número
      'palat',        // Error tipográfico
      'agaucate',     // Error tipográfico
      'pohoclo',      // Error tipográfico
      '   palta   ',  // Espacios extra (debería normalizarse)
      'PALTA',        // Mayúsculas
      'Aguacate'      // Capitalización
    ])('should handle edge case: "%s"', (term) => {
      const matches = synonymService.findSynonyms(term);
      
      // Los errores tipográficos no deberían encontrar matches
      if (term.includes('123') || term.includes('_xyz') || 
          term.includes('0') || term === 'palat' || 
          term === 'agaucate' || term === 'pohoclo') {
        expect(matches).toHaveLength(0);
      } else {
        // Los términos válidos (con espacios, mayúsculas) sí deberían funcionar
        expect(matches.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Helper Methods', () => {
    it('should check if term has synonyms', () => {
      expect(synonymService.hasSynonyms('palta')).toBe(true);
      expect(synonymService.hasSynonyms('aguacate')).toBe(true);
      expect(synonymService.hasSynonyms('pochoclo')).toBe(true);
      expect(synonymService.hasSynonyms('termino_inexistente')).toBe(false);
    });

    it('should get canonical term', () => {
      expect(synonymService.getCanonicalTerm('palta')).toBe('avocado');
      expect(synonymService.getCanonicalTerm('pochoclo')).toBe('popcorn');
      expect(synonymService.getCanonicalTerm('elote')).toBe('corn');
      expect(synonymService.getCanonicalTerm('termino_inexistente')).toBe(null);
    });

    it('should get region info', () => {
      const regionInfo = synonymService.getRegionInfo('palta');
      expect(regionInfo).toMatchObject({
        region: 'AR',
        country: 'Argentina',
        language: expect.any(String)
      });

      expect(synonymService.getRegionInfo('termino_inexistente')).toBe(null);
    });

    it('should get stats', () => {
      const stats = synonymService.getStats();
      expect(stats).toMatchObject({
        totalTerms: expect.any(Number),
        withRegionInfo: expect.any(Number)
      });
      expect(stats.totalTerms).toBeGreaterThan(0);
      expect(stats.withRegionInfo).toBeLessThanOrEqual(stats.totalTerms);
    });
  });

  describe('findAllVariations', () => {
    it('should find all variations for canonical terms', () => {
      const avocadoVariations = synonymService.findAllVariations('avocado');
      expect(avocadoVariations.length).toBeGreaterThan(0);
      
      const canonicalTerms = avocadoVariations.map(v => v.canonicalTerm);
      expect(canonicalTerms.every(term => term === 'avocado')).toBe(true);
    });

    it('should return empty array for unknown canonical terms', () => {
      const variations = synonymService.findAllVariations('termino_inexistente');
      expect(variations).toHaveLength(0);
    });
  });

  describe('Normalization Integration', () => {
    it('should handle accented characters correctly', () => {
      // Test con acentos - debería normalizar correctamente
      const withAccent = synonymService.findSynonyms('brócoli');
      const withoutAccent = synonymService.findSynonyms('brocoli');
      
      expect(withAccent).toHaveLength(1);
      expect(withoutAccent).toHaveLength(0); // Sin acento no debería encontrar
    });

    it('should handle special characters', () => {
      const normal = synonymService.findSynonyms('col rizada');
      const withDash = synonymService.findSynonyms('col-rizada');
      const withUnderscore = synonymService.findSynonyms('col_rizada');
      
      expect(normal).toHaveLength(1);
      expect(withDash).toHaveLength(0);
      expect(withUnderscore).toHaveLength(0);
    });
  });
});