import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { LegalPage as LegalPageType } from '@/types/legal';
import CookiePreferencesButton from '@/components/CookiePreferencesButton';
import CookiePreferencesModal from '@/components/CookiePreferencesModal';
import { useCookiePreferences } from '@/hooks/useCookiePreferences';

interface LegalPageProps {
  page: LegalPageType;
}

export const LegalPage: React.FC<LegalPageProps> = ({ page }) => {
  const { showPreferences, openPreferences, closePreferences } = useCookiePreferences();
  
  return (
    <>
      <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {page.title}
        </h1>
        {page.description && (
          <p className="text-lg text-muted-foreground mb-4">
            {page.description}
          </p>
        )}
        {page.lastUpdated && (
          <p className="text-sm text-muted-foreground">
            Última actualización: {new Date(page.lastUpdated).toLocaleDateString()}
          </p>
        )}
      </header>
      
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold text-foreground mt-8 mb-4 first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-foreground mb-4 leading-relaxed">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside text-foreground mb-4 space-y-2">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside text-foreground mb-4 space-y-2">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-foreground">
                {children}
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-foreground">
                {children}
              </em>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary/30 pl-4 my-4 text-muted-foreground italic">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono text-foreground">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                {children}
              </pre>
            ),
            a: ({ href, children }) => {
              // Handle cookie preferences link
              if (href === '#cookie-preferences') {
                return (
                  <button 
                    onClick={openPreferences}
                    className="text-primary hover:text-primary/80 underline cursor-pointer"
                  >
                    {children}
                  </button>
                );
              }
              
              return (
                <a 
                  href={href} 
                  className="text-primary hover:text-primary/80 underline"
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {page.content}
        </ReactMarkdown>
      </div>
      
      {/* Show cookie preferences button if this is the privacy page */}
      {page.slug === 'privacy' && (
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="border-t pt-6">
            <CookiePreferencesButton className="mb-4" />
          </div>
        </div>
      )}
    </article>
    
    <CookiePreferencesModal 
      isOpen={showPreferences} 
      onClose={closePreferences} 
    />
    </>
  );
};

export default LegalPage;