// SEO utilities for generating meta data and structured data

export interface BlogPostSEO {
  title: string;
  description: string;
  slug: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  categories: string[];
  keywords: string[];
  image?: string;
}

export interface ProductSEO {
  title: string;
  description: string;
  slug: string;
  image?: string;
  brand?: string;
  category: string;
  nutrition: any;
}

export const generateBlogPostSchema = (post: BlogPostSEO, siteUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "datePublished": post.publishedDate,
    "dateModified": post.modifiedDate || post.publishedDate,
    "url": `${siteUrl}/blog/${post.slug}`,
    "image": post.image ? `${siteUrl}${post.image}` : `${siteUrl}/splash.png`,
    "publisher": {
      "@type": "Organization",
      "name": "Nutrition Scanner",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/splash.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`
    }
  };
};

export const generateProductSchema = (product: ProductSEO, siteUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "url": `${siteUrl}/product/${product.slug}`,
    "image": product.image ? `${siteUrl}${product.image}` : `${siteUrl}/splash.png`,
    "brand": product.brand ? {
      "@type": "Brand",
      "name": product.brand
    } : undefined,
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "USD"
    }
  };
};

export const generateWebsiteSchema = (siteUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Nutrition Scanner",
    "description": "Scan and analyze food nutrition information instantly. Get detailed nutritional data, allergen information, and personalized recommendations.",
    "url": siteUrl,
    "applicationCategory": "Health & Fitness",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "Nutrition Scanner Team"
    }
  };
};

export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>, siteUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${siteUrl}${item.url}`
    }))
  };
};