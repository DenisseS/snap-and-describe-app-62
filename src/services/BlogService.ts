import { BlogPost } from '@/types/blog';

// Import all markdown files from the blog directory with language support
const blogFiles = import.meta.glob('../data/blog/**/*.md', { 
  query: '?raw',
  import: 'default',
  eager: true 
});

interface BlogMetadata {
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

class BlogService {
  private posts: Map<string, BlogPost[]> = new Map();
  private initialized = false;

  private parseFrontMatter(content: string): { metadata: BlogMetadata; content: string } {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);
    
    if (!match) {
      throw new Error('Invalid markdown format - missing frontmatter');
    }

    const [, frontMatter, markdownContent] = match;
    const metadata: any = {};
    
    frontMatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        
        // Remove quotes if present
        const cleanValue = value.replace(/^["'](.*)["']$/, '$1');
        
        // Parse arrays (tags, seoKeywords)
        if (key.trim() === 'tags' || key.trim() === 'seoKeywords') {
          metadata[key.trim()] = JSON.parse(cleanValue);
        } else if (key.trim() === 'readTime') {
          metadata[key.trim()] = parseInt(cleanValue);
        } else {
          metadata[key.trim()] = cleanValue;
        }
      }
    });

    return { metadata: metadata as BlogMetadata, content: markdownContent };
  }

  private getSlugFromPath(path: string): string {
    const filename = path.split('/').pop() || '';
    return filename.replace('.md', '');
  }

  private getLanguageFromPath(path: string): string {
    const parts = path.split('/');
    const langIndex = parts.findIndex(part => part === 'blog') + 1;
    return parts[langIndex] || 'es'; // Default to Spanish
  }

  private initializePosts(): void {
    if (this.initialized) return;

    // Group posts by language
    Object.entries(blogFiles).forEach(([path, content]) => {
      const language = this.getLanguageFromPath(path);
      const slug = this.getSlugFromPath(path);
      const { metadata, content: markdownContent } = this.parseFrontMatter(content as string);
      
      const post: BlogPost = {
        slug,
        title: metadata.title,
        excerpt: metadata.excerpt,
        content: markdownContent,
        category: metadata.category,
        tags: metadata.tags,
        publishedAt: metadata.publishedAt,
        readTime: metadata.readTime,
        featuredImage: metadata.featuredImage,
        seoTitle: metadata.seoTitle,
        seoDescription: metadata.seoDescription,
        seoKeywords: metadata.seoKeywords,
      };

      if (!this.posts.has(language)) {
        this.posts.set(language, []);
      }
      this.posts.get(language)!.push(post);
    });

    this.initialized = true;
  }

  getBlogPost(slug: string, language: string = 'es'): BlogPost | undefined {
    this.initializePosts();
    const languagePosts = this.posts.get(language) || this.posts.get('es') || [];
    return languagePosts.find(post => post.slug === slug);
  }

  getAllBlogPosts(language: string = 'es'): BlogPost[] {
    this.initializePosts();
    const languagePosts = this.posts.get(language) || this.posts.get('es') || [];
    return languagePosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  getBlogCategories(language: string = 'es'): string[] {
    this.initializePosts();
    const languagePosts = this.posts.get(language) || this.posts.get('es') || [];
    const categories = [...new Set(languagePosts.map(post => post.category))];
    return categories.sort();
  }

  getBlogPostsByCategory(category: string, language: string = 'es'): BlogPost[] {
    this.initializePosts();
    const languagePosts = this.posts.get(language) || this.posts.get('es') || [];
    return languagePosts.filter(post => post.category === category);
  }
}

export const blogService = new BlogService();

// Export individual functions with language support
export const getBlogPost = (slug: string, language?: string) => blogService.getBlogPost(slug, language);
export const getAllBlogPosts = (language?: string) => blogService.getAllBlogPosts(language);
export const getBlogCategories = (language?: string) => blogService.getBlogCategories(language);
export const getBlogPostsByCategory = (category: string, language?: string) => blogService.getBlogPostsByCategory(category, language);