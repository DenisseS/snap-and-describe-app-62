import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getSiteUrl, getCdnUrl } from '@/utils/envConfig';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  schema?: any;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonical,
  image = '/splash.png',
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  keywords = [],
  schema
}) => {
  const siteUrl = getSiteUrl();
  const cdnUrl = getCdnUrl();
  const fullImageUrl = image.startsWith('http') ? image : `${cdnUrl}${image}`;
  const fullCanonicalUrl = canonical ? `${siteUrl}${canonical}` : `${siteUrl}${typeof window !== 'undefined' ? window.location.pathname : ''}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      {canonical && <link rel="canonical" href={fullCanonicalUrl} />}
      {author && <meta name="author" content={author} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Nutrition Scanner" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}

      {/* PWA Meta Tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Nutrition Scanner" />
      <meta name="theme-color" content="#3B82F6" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    </Helmet>
  );
};

export default SEOHead;