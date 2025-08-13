
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChefHat, ChevronRight } from 'lucide-react';

interface RecipesSectionProps {
  onRecipesClick: () => void;
}

const RecipesSection: React.FC<RecipesSectionProps> = ({ onRecipesClick }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <button
        onClick={onRecipesClick}
        className="w-full bg-green-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-800">{t('recipes')}</h3>
              <p className="text-[10px] text-gray-600">{t('recipesDescription')}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </button>
    </div>
  );
};

export default RecipesSection;
