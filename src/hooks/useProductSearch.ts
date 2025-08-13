import { useState, useEffect, useMemo } from 'react';
import { queryEngine } from '@/services/FilterService';
import { TranslatedProduct } from '@/data/types';
import { getProductSlug } from '@/utils/productUtils';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import { useTranslatedProductDatabase } from '@/hooks/useTranslatedProductDatabase';

interface ProductSearchResult {
  id: string;
  name: string;
  image: string;
  rating: number;
  category: string;
  slug: string;
}

interface UseProductSearchReturn {
  results: ProductSearchResult[];
  isLoading: boolean;
  hasSearched: boolean;
  searchTerm: string;
}

export const useProductSearch = (query: string, debounceMs: number = 300): UseProductSearchReturn => {
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const { currentLanguage } = useProductTranslation();
  const translatedProductsDB = useTranslatedProductDatabase();

  // Debounce del término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Realizar búsqueda cuando cambia el término debounced
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    // Realizar búsqueda usando el queryEngine con productos traducidos
    const searchResults = queryEngine.executeQuery(translatedProductsDB, {
      searchTerm: debouncedQuery,
      sortBy: 'rating',
      sortOrder: 'desc'
    });

    // Convertir resultados al formato necesario
    const formattedResults: ProductSearchResult[] = searchResults.items
      .slice(0, 8)
      .map(item => {
        const product = item as TranslatedProduct;
        return {
          id: product.id,
          name: product.name,
          image: product.image,
          rating: product.rating,
          category: product.category,
          slug: getProductSlug(product, currentLanguage)
        };
      });

    setResults(formattedResults);
    setIsLoading(false);

    console.log(`🔍 Product search for "${debouncedQuery}": ${formattedResults.length} results`);
  }, [debouncedQuery, currentLanguage, translatedProductsDB]);

  return {
    results,
    isLoading,
    hasSearched,
    searchTerm: debouncedQuery
  };
};
