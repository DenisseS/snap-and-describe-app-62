
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import { useTranslatedProductDatabase } from '@/hooks/useTranslatedProductDatabase';
import { getProductById } from '@/data/database';
import { getProductSlug } from '@/utils/productUtils';

interface Product {
  id: string;
  name: string;
  image: string;
  rating: number;
  status: string;
}

interface HorizontalProductScrollProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const HorizontalProductScroll: React.FC<HorizontalProductScrollProps> = ({
  products,
  onProductSelect
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { translateProductName, currentLanguage } = useProductTranslation();
  const translatedProductsDB = useTranslatedProductDatabase();

  const handleProductClick = (product: Product) => {
    // Get the full product data to generate proper slug
    const fullProduct = getProductById(product.id, translatedProductsDB);
    if (fullProduct) {
      const slug = getProductSlug(fullProduct, currentLanguage);
      navigate(`/product/${slug}`);
    } else {
      // Fallback to calling the provided handler
      onProductSelect(product);
    }
  };

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-500 text-sm">{t('noSimilarProductsAvailable')}</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {products.map((product) => {
          // Find the full product data to get translations - already translated from DB
          const fullProduct = translatedProductsDB.find(p => p.id === product.id);
          const translatedName = fullProduct ? fullProduct.name : product.name;
          
          return (
            <div
              key={product.id}
              className="flex-shrink-0 cursor-pointer group"
              onClick={() => handleProductClick(product)}
            >
              <div className="w-28 h-28 bg-gray-200 rounded-2xl overflow-hidden mb-2 group-hover:shadow-md transition-shadow">
                <img 
                  src={product.image} 
                  alt={translatedName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-28 text-center">
                <p className="text-sm text-gray-900 font-medium leading-tight truncate">
                  {translatedName}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalProductScroll;
