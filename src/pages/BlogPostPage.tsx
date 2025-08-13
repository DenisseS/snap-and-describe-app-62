import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlogPost } from '@/components/blog/BlogPost';
import { NotFound } from '@/components/blog/NotFound';
import { getBlogPost } from '@/services/BlogService';
import SEOHead from '@/components/SEOHead';
import { generateBlogPostSchema } from '@/utils/seoUtils';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  
  if (!slug) {
    return <NotFound />;
  }

  const post = getBlogPost(slug, i18n.language);
  
  if (!post) {
    return <NotFound />;
  }

  const headerProps = {
    title: post.title,
    showBackButton: true,
    showAvatar: true
  };

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yourapp.com';
  const blogSEO = {
    title: post.title,
    description: post.excerpt || post.title,
    slug: post.slug,
    author: 'Nutrition Scanner Team',
    publishedDate: post.publishedAt,
    categories: post.category ? [post.category] : [],
    keywords: post.tags || [],
    image: post.featuredImage
  };

  return (
    <>
      <SEOHead
        title={post.seoTitle || `${post.title} - Nutrition Scanner Blog`}
        description={post.seoDescription || post.excerpt || post.title}
        canonical={`/blog/${slug}`}
        type="article"
        author="Nutrition Scanner Team"
        publishedTime={post.publishedAt}
        keywords={post.seoKeywords || post.tags || []}
        image={post.featuredImage}
        schema={generateBlogPostSchema(blogSEO, siteUrl)}
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
              <div className="pb-24">
                <BlogPost post={post} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default BlogPostPage;