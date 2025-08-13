
import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProductSearch } from '@/hooks/useProductSearch';
import { useProductTranslation } from '@/hooks/useProductTranslation';

interface ProductSearchResult {
  id: string;
  name: string;
  image: string;
  rating: number;
  category: string;
  slug: string;
}

interface ProductSearchDropdownProps {
  onProductSelect: (product: ProductSearchResult) => void;
  onCustomItemSelect: (itemName: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ProductSearchDropdown: React.FC<ProductSearchDropdownProps> = ({
  onProductSelect,
  onCustomItemSelect,
  placeholder = "Buscar productos...",
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { results, isLoading, hasSearched } = useProductSearch(searchTerm);
  const { translateCategory } = useProductTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setIsOpen(value.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (results.length > 0) {
        // Select first result if available
        handleProductSelect(results[0]);
      } else if (searchTerm.trim()) {
        // Create custom item if no results but has search term
        handleCustomSelect();
      }
    }
  };

  const handleProductSelect = (product: ProductSearchResult) => {
    onProductSelect(product);
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleCustomSelect = () => {
    if (searchTerm.trim()) {
      onCustomItemSelect(searchTerm.trim());
      setSearchTerm('');
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-yellow-800 font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const showResults = isOpen && searchTerm.length > 0;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Input de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          data-search-input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.length > 0 && setIsOpen(true)}
          disabled={disabled}
          className="pl-10 pr-16"
        />
        {/* Green plus button that appears when input is empty */}
        {!searchTerm && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-green-100 hover:bg-green-200 text-green-600 rounded-xl"
              onClick={() => inputRef.current?.focus()}
              disabled={disabled}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Dropdown de resultados */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {/* Estado de carga */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Buscando productos...</span>
            </div>
          )}

          {/* Resultados de productos */}
          {!isLoading && results.length > 0 && (
            <div className="py-2">
              {results.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 hover:shadow-md cursor-pointer group transition-all duration-200 border border-transparent hover:border-gray-200 rounded-lg mx-2"
                  onClick={() => handleProductSelect(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {highlightMatch(product.name, searchTerm)}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>{translateCategory(product.category)}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Opción para crear artículo personalizado */}
          {!isLoading && searchTerm.trim() && (
            <>
              {results.length > 0 && (
                <div className="border-t border-gray-100" />
              )}
              <div
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 hover:shadow-md cursor-pointer group transition-all duration-200 border border-transparent hover:border-gray-200 rounded-lg mx-2"
                onClick={handleCustomSelect}
              >
                <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">
                    {searchTerm}
                  </div>
                  <div className="text-sm text-gray-500">
                    Artículo personalizado
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearchDropdown;
