import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getAllLegalPages } from '@/services/LegalService';
import { FileText, HelpCircle, Shield, Mail, Info, Users, AlertTriangle, Heart, BookOpen } from 'lucide-react';

const SupportPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const legalPages = getAllLegalPages(i18n.language);

  const getIcon = (slug: string) => {
    switch (slug) {
      case 'about': return <Info className="h-4 w-4" />;
      case 'help': return <HelpCircle className="h-4 w-4" />;
      case 'contact': return <Mail className="h-4 w-4" />;
      case 'features': return <Heart className="h-4 w-4" />;
      case 'terms': return <FileText className="h-4 w-4" />;
      case 'privacy': return <Shield className="h-4 w-4" />;
      case 'nutrition-disclaimer': return <AlertTriangle className="h-4 w-4" />;
      case 'user-guide': return <BookOpen className="h-4 w-4" />;
      case 'recipe-guide': return <BookOpen className="h-4 w-4" />;
      case 'how-it-works': return <Info className="h-4 w-4" />;
      case 'food-safety': return <Shield className="h-4 w-4" />;
      case 'developer': return <Users className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    const titles = {
      general: t('legal:categories.general', 'General Information'),
      legal: t('legal:categories.legal', 'Legal Documents'),
      guides: t('legal:categories.guides', 'User Guides'),
      safety: t('legal:categories.safety', 'Safety Information'),
      developer: t('legal:categories.developer', 'Developer Information'),
      other: t('legal:categories.other', 'Other Information')
    };
    return titles[category] || titles.other;
  };

  // Group pages dynamically by their category frontmatter
  const pagesByCategory = legalPages.reduce((acc, page) => {
    const category = page.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(page);
    return acc;
  }, {} as Record<string, typeof legalPages>);

  const renderPagesByCategory = (category: string, pages: typeof legalPages) => {
    if (pages.length === 0) return null;

    return (
      <AccordionItem value={category} key={category}>
        <AccordionTrigger className="text-left">
          <div className="flex items-center gap-2">
            <span className="font-medium">{getCategoryTitle(category)}</span>
            <span className="text-sm text-muted-foreground">({pages.length})</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-2">
            {pages.map(page => (
              <Link
                key={page.slug}
                to={`/legal/${page.slug}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                {getIcon(page.slug)}
                <div className="flex-1">
                  <div className="font-medium text-sm">{page.title}</div>
                  {page.description && (
                    <div className="text-xs text-muted-foreground mt-1">{page.description}</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  const headerProps = {
    title: t('legal:support.title', 'Support & Legal'),
    showBackButton: true,
    showAvatar: true
  };

  return (
    <Layout 
      currentView="legal" 
      showBottomNav={true} 
      hideHeader={false}
      headerProps={headerProps}
    >
      <div className="content-with-pagination">
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="pb-24 p-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    {t('legal:support.title', 'Support & Legal Information')}
                  </CardTitle>
                  <CardDescription>
                    {t('legal:support.description', 'Find all the information you need about our app, including legal documents, user guides, and support resources.')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                    {Object.entries(pagesByCategory).map(([category, pages]) => 
                      renderPagesByCategory(category, pages)
                    )}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </div>
    </Layout>
  );
};

export default SupportPage;