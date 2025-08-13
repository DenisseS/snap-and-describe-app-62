
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getUserRecipes } from '@/data/recipes';
import RecipeCard from './RecipeCard';
import ScrollContainer from './ScrollContainer';
import { ChefHat } from 'lucide-react';

const MyRecipeBook: React.FC = () => {
  const { t } = useTranslation();
  const userRecipes = getUserRecipes();

  if (userRecipes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <ChefHat className="h-12 w-12 xs:h-16 xs:w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg xs:text-xl font-semibold text-gray-600 mb-2">
            {t('emptyRecipeBook')}
          </h3>
          <p className="text-sm xs:text-base text-gray-500 max-w-sm">
            {t('addRecipesToCollection')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollContainer className="px-2 xs:px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-4 pb-4 pt-2">
        {userRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} showUserBadge />
        ))}
      </div>
    </ScrollContainer>
  );
};

export default MyRecipeBook;
