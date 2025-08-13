import React from 'react';
import HorizontalProductScroll from './HorizontalProductScroll';
import { getSimilarProducts } from '@/data/database';
import { useTranslatedProductDatabase } from '@/hooks/useTranslatedProductDatabase';

interface SimilarProduct {
  id: string;
  name: string;
  image: string;
  rating: number;
  status: string;
}

interface SimilarProductsProps {
  currentProduct: string;
  onItemSelect: (item: SimilarProduct) => void;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ 
  currentProduct, 
  onItemSelect 
}) => {
  const translatedProductsDB = useTranslatedProductDatabase();
  
  // Get similar products from database with translated products
  const similarProductsFromDB = getSimilarProducts(currentProduct, translatedProductsDB);
  
  // Convert to SimilarProduct format
  const similarProducts: SimilarProduct[] = similarProductsFromDB.map(product => ({
    id: product.id,
    name: product.name,
    image: product.image,
    rating: product.rating,
    status: 'similar'
  }));

  return (
    <HorizontalProductScroll 
      products={similarProducts}
      onProductSelect={onItemSelect}
    />
  );
};

export default SimilarProducts;
