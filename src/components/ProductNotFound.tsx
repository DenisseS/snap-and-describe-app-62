
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const ProductNotFound: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="h-full bg-gray-50 flex items-center justify-center p-2">
      <div className="text-center">
        <p className="text-gray-500 text-sm">{t('productNotFound')}</p>
        <Button className="mt-2 text-sm">{t('goBack')}</Button>
      </div>
    </div>
  );
};

export default ProductNotFound;
