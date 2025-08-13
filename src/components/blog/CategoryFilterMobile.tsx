import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryFilterMobileProps {
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export const CategoryFilterMobile: React.FC<CategoryFilterMobileProps> = ({
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
    <div className="w-full space-y-4">
      {/* Dropdown Button */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-between h-12',
              selectedCategories.length > 0 && 'border-primary'
            )}
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="truncate">{getDisplayText()}</span>
            </div>
            <div className="flex items-center gap-2">
              {selectedCategories.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedCategories.length}
                </Badge>
              )}
            </div>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex items-center justify-between">
              {t('selectCategories')}
              {selectedCategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-auto p-2 text-xs"
                >
                  {t('clearFilters')}
                </Button>
              )}
            </DrawerTitle>
          </DrawerHeader>
          
          <div className="px-4 pb-8">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <div className="flex items-center space-x-3 p-2">
                <Checkbox
                  id="all"
                  checked={selectedCategories.length === 0}
                  onCheckedChange={() => handleCategoryToggle('all')}
                />
                <label
                  htmlFor="all"
                  className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('categories.all')}
                </label>
              </div>
              
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-3 p-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <label
                    htmlFor={category}
                    className="text-base leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                  >
                    {t(`categories.${category}`)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Selected Categories */}
      {selectedCategories.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {selectedCategories.slice(0, 4).map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground text-sm py-1 px-3"
                onClick={() => handleCategoryToggle(category)}
              >
                {t(`categories.${category}`)}
                <X className="h-3 w-3 ml-2" />
              </Badge>
            ))}
            {selectedCategories.length > 4 && (
              <Badge variant="outline" className="text-sm py-1 px-3">
                +{selectedCategories.length - 4}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};