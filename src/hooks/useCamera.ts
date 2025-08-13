
import { useState } from 'react';
import { useTranslatedProductDatabase } from '@/hooks/useTranslatedProductDatabase';

export const useCamera = (navigateToProduct: (productId: string) => void) => {
  const translatedProductsDB = useTranslatedProductDatabase();
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [currentProductId, setCurrentProductId] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState({
    foodName: 'Nombre del producto',
    rating: 8
  });

  const handlePhotoTaken = async (photo: string) => {
    console.log('📷 useCamera: Photo taken, starting analysis...');
    setCapturedImage(photo);
    setIsAnalyzing(true);
    
    try {
      // Simulate analysis delay (2-3 seconds for realism)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Select random product from database
      const randomIndex = Math.floor(Math.random() * translatedProductsDB.length);
      const selectedProduct = translatedProductsDB[randomIndex];
      
      console.log('🎯 useCamera: Selected random product:', selectedProduct.name);
      
      setCurrentProductId(selectedProduct.id);
      setAnalysisResult({
        foodName: selectedProduct.name,
        rating: selectedProduct.rating
      });
      
      setIsAnalyzing(false);
      
      // Navigate to product detail page
      navigateToProduct(selectedProduct.id);
      
    } catch (error) {
      console.error('❌ useCamera: Error analyzing food:', error);
      setIsAnalyzing(false);
    }
  };

  return {
    capturedImage,
    currentProductId,
    analysisResult,
    isAnalyzing,
    handlePhotoTaken
  };
};
