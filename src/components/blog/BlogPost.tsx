import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Calendar, Clock, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BlogPost as BlogPostType } from '@/types/blog';
import { useTranslation } from 'react-i18next';
import { AuthorByline } from './AuthorByline';
import { MedicalDisclaimer } from './MedicalDisclaimer';

import { getAuthor } from '@/data/authors';
import 'highlight.js/styles/github-dark.css';

// Extract prose classes to a constant for clarity and reuse
const proseClasses = `
  [&_h1]:text-3xl [&_h1]:font-black [&_h1]:mb-10 [&_h1]:mt-20 [&_h1]:leading-tight [&_h1]:border-b [&_h1]:border-border [&_h1]:pb-8 [&_h1]:text-foreground [&_h1]:tracking-tight
  [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-8 [&_h2]:mt-12 [&_h2]:leading-tight [&_h2]:text-foreground [&_h2]:tracking-tight [&_h2]:border-l-4 [&_h2]:border-primary [&_h2]:pl-6
  [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-6 [&_h3]:mt-10 [&_h3]:leading-tight [&_h3]:text-foreground [&_h3]:tracking-tight
  [&_h4]:text-base [&_h4]:font-bold [&_h4]:mb-5 [&_h4]:mt-8 [&_h4]:leading-tight [&_h4]:text-foreground [&_h4]:tracking-tight
  [&_h5]:text-sm [&_h5]:font-bold [&_h5]:mb-4 [&_h5]:mt-6 [&_h5]:leading-tight [&_h5]:text-foreground [&_h5]:tracking-tight
  [&_h6]:text-xs [&_h6]:font-bold [&_h6]:mb-3 [&_h6]:mt-4 [&_h6]:leading-tight [&_h6]:text-foreground [&_h6]:tracking-tight
`;

interface BlogPostProps {
  post: BlogPostType;
}

export const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const { t } = useTranslation('blog');
  
  // Get author information from frontmatter or default
  const authorId = post.content.match(/author:\s*([^\n]+)/)?.[1]?.trim() || 'sarah-mitchell';
  const author = getAuthor(authorId);
  
  // Check for medical disclaimer requirement from frontmatter
  const showMedicalDisclaimer = post.content.includes('showMedicalDisclaimer: true') || 
    post.category === 'health' || 
    post.tags.some(tag => ['nutrition', 'health', 'vitamins', 'medical'].includes(tag.toLowerCase()));
  
  // Extract last reviewed date if available
  const lastReviewedMatch = post.content.match(/lastReviewed:\s*"([^"]+)"/);
  const lastReviewed = lastReviewedMatch ? lastReviewedMatch[1] : undefined;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
          <article className="space-y-8 pb-8">
            {post.featuredImage && (
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <header className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} {t('minRead')}</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-4xl font-bold text-foreground leading-tight">
                {post.title}
              </h1>

              <p className="text-sm md:text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">
                  {t(`categories.${post.category}`)}
                </Badge>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </header>

            {/* Author Byline */}
            {author && (
              <AuthorByline 
                author={author} 
                publishedDate={post.publishedAt}
                lastReviewed={lastReviewed}
              />
            )}

            <div className={proseClasses}>
              <div className="overflow-x-auto">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    table: ({ children, ...props }) => (
                      <div className="overflow-x-auto my-8 rounded-lg border border-border shadow-sm">
                        <table className="w-full border-collapse text-sm" {...props}>
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children, ...props }) => (
                      <th className="border border-border bg-muted/50 px-4 py-3 text-left font-semibold text-foreground" {...props}>
                        {children}
                      </th>
                    ),
                    td: ({ children, ...props }) => (
                      <td className="border border-border px-4 py-3 text-foreground" {...props}>
                        {children}
                      </td>
                    ),
                    tr: ({ children, ...props }) => (
                      <tr className="transition-colors hover:bg-muted/20 even:bg-muted/10" {...props}>
                        {children}
                      </tr>
                    ),
                    ul: ({ children, ...props }) => (
                      <ul className="list-disc pl-6 my-8 space-y-4" {...props}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol className="list-decimal pl-6 my-8 space-y-4" {...props}>
                        {children}
                      </ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li className="text-foreground leading-relaxed text-base my-4 marker:text-primary marker:font-bold marker:text-lg" {...props}>
                        {children}
                      </li>
                    ),
                    img: ({ node, ...props }) => (
                      <img {...props} alt={props.alt ?? ''} loading="lazy" className="rounded-lg shadow-lg my-12 mx-auto border border-border/20" />
                    ),
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline decoration-2 underline-offset-4 hover:text-primary/80 transition-colors no-underline hover:underline">
                        {props.children}
                      </a>
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote className="border-l-4 border-primary pl-6 text-muted-foreground my-8" {...props}>
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, ...props }) => (
                      <code className="bg-muted px-1 rounded" {...props}>
                        {children}
                      </code>
                    ),
                    pre: ({ children, ...props }) => (
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-6" {...props}>
                        {children}
                      </pre>
                    ),
                    strong: ({ children, ...props }) => (
                      <strong className="text-foreground font-bold" {...props}>
                        {children}
                      </strong>
                    ),
                    p: ({ children, ...props }) => (
                      <p className="text-foreground leading-relaxed mb-6 text-base" {...props}>
                        {children}
                      </p>
                    )
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Medical Disclaimer */}
            {showMedicalDisclaimer && author && (
              <MedicalDisclaimer
                authorName={author.name}
                className="my-8"
              />
            )}

          </article>
        </div>
      </div>
  );
};
