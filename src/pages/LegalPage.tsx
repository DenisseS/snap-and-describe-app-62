import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LegalPage as LegalPageComponent } from '@/components/legal/LegalPage';
import { NotFound } from '@/components/blog/NotFound';
import { getLegalPage } from '@/services/LegalService';
import SEOHead from '@/components/SEOHead';

const LegalPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  
  if (!slug) {
    return <NotFound />;
  }

  const page = getLegalPage(slug, i18n.language);
  
  if (!page) {
    return <NotFound />;
  }

  const headerProps = {
    title: page.title,
    showBackButton: true,
    showAvatar: true
  };

  return (
    <>
      <SEOHead
        title={`${page.title} - Nutrition Scanner`}
        description={`${page.title} information for Nutrition Scanner app`}
        canonical={`/legal/${slug}`}
        keywords={['legal', 'terms', 'privacy', 'nutrition app']}
      />
      <Layout 
        currentView="legal" 
        showBottomNav={true} 
        hideHeader={false}
        headerProps={headerProps}
      >
        <div className="content-with-pagination">
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="pb-24">
                <LegalPageComponent page={page} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default LegalPage;