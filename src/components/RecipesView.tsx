
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SuggestedRecipes from './SuggestedRecipes';
import MyRecipeBook from './MyRecipeBook';
import ScrollContainer from './ScrollContainer';

type RecipeTab = 'suggested' | 'mybook';

const RecipesView: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<RecipeTab>('suggested');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-2 xs:p-4 border-b bg-white">
        <div className="flex justify-between items-center mb-3 xs:mb-4">
          <h1 className="text-lg xs:text-xl md:text-2xl font-bold text-gray-800">
            Recetas
          </h1>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" className="h-8 w-8 xs:h-10 xs:w-10">
              <Filter className="h-3 w-3 xs:h-4 xs:w-4" />
            </Button>
            <Button size="icon" className="h-8 w-8 xs:h-10 xs:w-10 bg-green-500 hover:bg-green-600">
              <Plus className="h-3 w-3 xs:h-4 xs:w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('suggested')}
            className={`flex-1 py-1.5 xs:py-2 px-2 xs:px-4 rounded-md text-xs xs:text-sm font-medium transition-colors ${
              activeTab === 'suggested'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sugeridas
          </button>
          <button
            onClick={() => setActiveTab('mybook')}
            className={`flex-1 py-1.5 xs:py-2 px-2 xs:px-4 rounded-md text-xs xs:text-sm font-medium transition-colors ${
              activeTab === 'mybook'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mi Libro
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'suggested' ? (
          <SuggestedRecipes />
        ) : (
          <MyRecipeBook />
        )}
      </div>
    </div>
  );
};

export default RecipesView;
