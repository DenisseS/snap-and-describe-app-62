
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { predefinedRecipes, recipeCategories } from '@/data/recipes';
import RecipeCard from './RecipeCard';
import ScrollContainer from './ScrollContainer';

const SuggestedRecipes: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRecipes = selectedCategory
    ? predefinedRecipes.filter(recipe => recipe.categories.includes(selectedCategory))
    : predefinedRecipes;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Categories Filter */}
      <div className="flex-shrink-0 p-2 xs:p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-2 xs:px-3 py-1 xs:py-1.5 rounded-full text-xs xs:text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('all')}
          </button>
          {recipeCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-2 xs:px-3 py-1 xs:py-1.5 rounded-full text-xs xs:text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : `${category.color} hover:opacity-80`
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      <ScrollContainer className="px-2 xs:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-4 pb-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </ScrollContainer>
    </div>
  );
};

export default SuggestedRecipes;
