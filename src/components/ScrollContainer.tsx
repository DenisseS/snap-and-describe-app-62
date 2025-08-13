
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ScrollContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ScrollContainer: React.FC<ScrollContainerProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`flex-1 min-h-0 ${className}`}>
      <ScrollArea className="h-full w-full">
        <div className="h-full">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ScrollContainer;
