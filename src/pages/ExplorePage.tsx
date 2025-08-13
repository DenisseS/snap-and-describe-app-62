
import React from 'react';
import Layout from '@/components/Layout';
import Explore from '@/components/Explore';
import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';

const ExplorePage: React.FC = () => {
  const { t } = useTranslation();

  const headerProps = {
    title: t('exploreProducts'),
    showBackButton: true,
    showAvatar: true
  };

  return (
    <>
      <SEOHead
        title={`${t('exploreProducts')} - Nutrition Scanner`}
        description="Explore thousands of food products with detailed nutritional information, ingredients, and health insights. Find the right foods for your diet and lifestyle."
        canonical="/explore"
        keywords={['food products', 'nutrition database', 'food search', 'healthy eating', 'nutrition facts']}
      />
      <Layout
        currentView="explore"
        headerProps={headerProps}
      >
        <Explore />
      </Layout>
    </>
  );
};

export default ExplorePage;
