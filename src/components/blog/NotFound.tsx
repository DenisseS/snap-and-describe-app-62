import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';

export const NotFound: React.FC = () => {
  const { t } = useTranslation('blog');

  return (
    <Layout currentView="blog">
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            {t('postNotFound')}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t('postNotFoundDescription')}
          </p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToBlog')}
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};