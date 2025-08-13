import { LegalPage } from '@/types/legal';

// Import all markdown files from the legal directory with language support
const legalFiles = import.meta.glob('../data/legal/**/*.md', { 
  query: '?raw',
  import: 'default',
  eager: true 
});

interface LegalMetadata {
  title: string;
  description?: string;
  lastUpdated?: string;
  seoTitle?: string;
  seoDescription?: string;
  category?: string;
}

class LegalService {
  private pages: Map<string, LegalPage[]> = new Map();
  private initialized = false;

  private parseFrontMatter(content: string): { metadata: LegalMetadata; content: string } {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);
    
    if (!match) {
      // If no frontmatter, create default metadata
      return { 
        metadata: { title: 'Legal Page' }, 
        content 
      };
    }

    const [, frontMatter, markdownContent] = match;
    const metadata: any = {};
    
    frontMatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        const cleanValue = value.replace(/^["'](.*)["']$/, '$1');
        metadata[key.trim()] = cleanValue;
      }
    });

    return { metadata: metadata as LegalMetadata, content: markdownContent };
  }

  private getSlugFromPath(path: string): string {
    const filename = path.split('/').pop() || '';
    return filename.replace('.md', '');
  }

  private getLanguageFromPath(path: string): string {
    const parts = path.split('/');
    const langIndex = parts.findIndex(part => part === 'legal') + 1;
    return parts[langIndex] || 'es'; // Default to Spanish
  }

  private initializePages(): void {
    if (this.initialized) return;

    // Group pages by language
    Object.entries(legalFiles).forEach(([path, content]) => {
      const language = this.getLanguageFromPath(path);
      const slug = this.getSlugFromPath(path);
      const { metadata, content: markdownContent } = this.parseFrontMatter(content as string);
      
      const page: LegalPage = {
        slug,
        title: metadata.title,
        content: markdownContent,
        description: metadata.description,
        lastUpdated: metadata.lastUpdated,
        seoTitle: metadata.seoTitle,
        seoDescription: metadata.seoDescription,
        category: metadata.category,
      };

      if (!this.pages.has(language)) {
        this.pages.set(language, []);
      }
      this.pages.get(language)!.push(page);
    });

    this.initialized = true;
  }

  getLegalPage(slug: string, language: string = 'es'): LegalPage | undefined {
    this.initializePages();
    const languagePages = this.pages.get(language) || this.pages.get('es') || [];
    return languagePages.find(page => page.slug === slug);
  }

  getAllLegalPages(language: string = 'es'): LegalPage[] {
    this.initializePages();
    return this.pages.get(language) || this.pages.get('es') || [];
  }
}

export const legalService = new LegalService();

// Export individual functions with language support
export const getLegalPage = (slug: string, language?: string) => legalService.getLegalPage(slug, language);
export const getAllLegalPages = (language?: string) => legalService.getAllLegalPages(language);