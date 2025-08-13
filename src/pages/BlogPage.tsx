import React from 'react';
import Layout from '@/components/Layout';
import { BlogList } from '@/components/blog/BlogList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';

const BlogPage: React.FC = () => {
  const { t } = useTranslation('blog');
  
  const headerProps = {
    title: t('title'),
    showBackButton: true,
    showAvatar: true
  };

  return (
    <>
      <SEOHead
        title={`${t('title')} - Nutrition Scanner`}
        description={t('subtitle')}
        canonical="/blog"
        keywords={['nutrition blog', 'health tips', 'diet advice', 'nutritional science', 'food facts']}
      />
      <Layout 
        currentView="blog" 
        showBottomNav={true} 
        hideHeader={false}
        headerProps={headerProps}
      >
        <div className="content-with-pagination">
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="container mx-auto px-4 py-8 pb-24">
                <div className="max-w-4xl mx-auto">
                  <header className="text-center mb-12">
                    <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                      {t('title')}
                    </h1>
                    <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      {t('subtitle')}
                    </p>
                  </header>
                  <BlogList />
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default BlogPage;