import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import FoodResults from '@/components/FoodResults';
import { getProductById } from '@/data/database';
import { getProductBySlug, getProductSlug } from '@/utils/productUtils';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import { useTranslatedProductDatabase } from '@/hooks/useTranslatedProductDatabase';
import { useTranslation } from 'react-i18next';

const ProductDetail: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  const { currentLanguage } = useProductTranslation();
  const translatedProductsDB = useTranslatedProductDatabase();
  const { t } = useTranslation();
  
  const product = productSlug ? getProductBySlug(translatedProductsDB, productSlug) : undefined;

  const handleSimilarProductSelect = (selectedProduct: { id: string; name: string; image: string; rating: number; status: string }) => {
    const productData = getProductById(selectedProduct.id);
    if (productData) {
      const slug = getProductSlug(productData, currentLanguage);
      navigate(`/product/${slug}`);
    }
  };

  const headerProps = {
    title: t('productDetails'),
    showBackButton: true,
    showAvatar: true
  };

  return (
    <Layout
      currentView="results"
      showBottomNav={true}
      headerProps={headerProps}
    >
      {product ? (
        <FoodResults
          foodName={product.name}
          foodImage={product.image}
          rating={product.rating}
          productId={product.id}
          onSimilarProductSelect={handleSimilarProductSelect}
        />
      ) : (
        <div className="h-full bg-gray-50 flex flex-col items-center justify-center p-4">
          <h1 className="text-xl font-bold text-gray-800 mb-2">{t('productNotFound')}</h1>
          <p className="text-gray-600 mb-4">{t('productNotFoundMessage')}</p>
          <Button onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('goHome')}
          </Button>
        </div>
      )}
    </Layout>
  );
};

export default ProductDetail;
