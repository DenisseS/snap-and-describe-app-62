import React from 'react';
import { Author } from '@/data/authors';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface AuthorBylineProps {
  author: Author;
  publishedDate: string;
  lastReviewed?: string;
}

export const AuthorByline: React.FC<AuthorBylineProps> = ({ 
  author, 
  publishedDate, 
  lastReviewed 
}) => {
  return (
    <div className="border-l-4 border-primary pl-6 my-8 bg-secondary/10 py-6 rounded-r-lg">
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground">{author.name}</h3>
          <p className="text-muted-foreground mb-2">{author.title}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {author.credentials.slice(0, 2).map((credential, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {credential.split(',')[0]}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-muted-foreground">
        <p className="leading-relaxed">{author.bio}</p>
        
        <div className="pt-3 border-t border-border/50">
          <div className="flex flex-wrap gap-4 text-xs">
            <span>
              <strong>Published:</strong> {new Date(publishedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            {lastReviewed && (
              <span>
                <strong>Last medically reviewed:</strong> {new Date(lastReviewed).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};