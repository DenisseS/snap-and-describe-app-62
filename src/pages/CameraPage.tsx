
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import CameraScanner from '@/components/CameraScanner';
import { useCamera } from '@/hooks/useCamera';
import { getProductSlug } from '@/utils/productUtils';
import { getProductById } from '@/data/database';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import { useTranslatedProductDatabase } from '@/hooks/useTranslatedProductDatabase';
import { useTranslation } from 'react-i18next';

const CameraPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage } = useProductTranslation();
  const translatedProductsDB = useTranslatedProductDatabase();

  const navigateToProduct = (productId: string) => {
    console.log('📱 CameraPage: Navigate to product:', productId);
    const product = getProductById(productId, translatedProductsDB);
    if (product) {
      const slug = getProductSlug(product, currentLanguage);
      navigate(`/product/${slug}`);
    }
  };

  const { handlePhotoTaken, isAnalyzing } = useCamera(navigateToProduct);

  const headerProps = {
    title: t('scanFood'),
    showBackButton: true,
    showAvatar: true
  };

  return (
    <Layout
      currentView="camera"
      headerProps={headerProps}
    >
      <CameraScanner onPhotoTaken={handlePhotoTaken} isAnalyzing={isAnalyzing} />
    </Layout>
  );
};

export default CameraPage;
