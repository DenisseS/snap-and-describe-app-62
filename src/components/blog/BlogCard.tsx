import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/types/blog';
import { useTranslation } from 'react-i18next';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const { t } = useTranslation('blog');

  return (
    <Link to={`/blog/${post.slug}`} className="group">
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        {post.featuredImage && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span>{post.readTime} {t('minRead')}</span>
          </div>
          
          <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          
          <p className="text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {t(`categories.${post.category}`)}
            </Badge>
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {post.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};