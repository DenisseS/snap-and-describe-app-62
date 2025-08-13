export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}