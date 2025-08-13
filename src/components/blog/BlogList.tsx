import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BlogCard } from './BlogCard';
import { CategoryFilter } from './CategoryFilter';
import { getAllBlogPosts, getBlogCategories } from '@/services/BlogService';
import { BlogPost } from '@/types/blog';

export const BlogList: React.FC = () => {
  const { t, i18n } = useTranslation('blog');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const currentLanguage = i18n.language;
  const allPosts = getAllBlogPosts(currentLanguage);
  const categories = getBlogCategories(currentLanguage);
  
  const filteredPosts = selectedCategories.length === 0
    ? allPosts 
    : allPosts.filter(post => selectedCategories.includes(post.category));

  return (
    <div className="space-y-8">
      <CategoryFilter
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
      />
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {t('noPosts')}
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pb-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};