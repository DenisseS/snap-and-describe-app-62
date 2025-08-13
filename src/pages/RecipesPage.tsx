
import React from 'react';
import Layout from '@/components/Layout';
import RecipesView from '@/components/RecipesView';
import { useTranslation } from 'react-i18next';

const RecipesPage: React.FC = () => {
  const { t } = useTranslation();

  const headerProps = {
    title: t('recipes'),
    showBackButton: true,
    showAvatar: true
  };

  return (
    <Layout
      currentView="recipes"
      headerProps={headerProps}
    >
      <RecipesView />
    </Layout>
  );
};

export default RecipesPage;
