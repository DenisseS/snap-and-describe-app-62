import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryFilterDesktopProps {
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export const CategoryFilterDesktop: React.FC<CategoryFilterDesktopProps> = ({
  categories,
  selectedCategories,
  onCategoriesChange,
}) => {
  const { t } = useTranslation('blog');
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (category: string) => {
    if (category === 'all') {
      onCategoriesChange([]);
      return;
    }

    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const clearAllFilters = () => {
    onCategoriesChange([]);
  };

  const getDisplayText = () => {
    if (selectedCategories.length === 0) {
      return t('filterByCategory');
    }
    if (selectedCategories.length === 1) {
      return t(`categories.${selectedCategories[0]}`);
    }
    return `${selectedCategories.length} ${t('categoriesSelected')}`;
  };

  return (
    <div className="flex items-center gap-3 justify-center">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'min-w-[200px] justify-between',
              selectedCategories.length > 0 && 'border-primary'
            )}
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="truncate">{getDisplayText()}</span>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-background z-50" align="center">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{t('selectCategories')}</h4>
              {selectedCategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-auto p-1 text-xs"
                >
                  {t('clearFilters')}
                </Button>
              )}
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all"
                  checked={selectedCategories.length === 0}
                  onCheckedChange={() => handleCategoryToggle('all')}
                />
                <label
                  htmlFor="all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('categories.all')}
                </label>
              </div>
              
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <label
                    htmlFor={category}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t(`categories.${category}`)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {selectedCategories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap max-w-full">
          <div className="flex flex-wrap gap-2 items-center">
            {selectedCategories.slice(0, 4).map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground text-xs"
                onClick={() => handleCategoryToggle(category)}
              >
                {t(`categories.${category}`)}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {selectedCategories.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{selectedCategories.length - 4}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};