
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe, recipeCategories } from '@/data/recipes';
import { Clock, Users, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface RecipeCardProps {
  recipe: Recipe;
  showUserBadge?: boolean;
  onSelect?: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  showUserBadge = false,
  onSelect 
}) => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(recipe);
    } else {
      navigate(`/recipe/${recipe.id}`);
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-32 xs:h-40 object-cover"
        />
        {showUserBadge && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
            <User className="h-3 w-3" />
          </div>
        )}
      </div>
      
      <CardContent className="p-2 xs:p-3">
        <h3 className="font-semibold text-sm xs:text-base text-gray-800 mb-2 line-clamp-2">
          {recipe.name}
        </h3>
        
        <div className="flex items-center gap-3 xs:gap-4 text-xs xs:text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {recipe.prepTime}m
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {recipe.servings}
          </div>
          <span className={`capitalize ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {recipe.categories.slice(0, 2).map((categoryId) => {
            const category = recipeCategories.find(c => c.id === categoryId);
            return category ? (
              <span
                key={categoryId}
                className={`px-1.5 xs:px-2 py-0.5 rounded-full text-xs ${category.color}`}
              >
                {category.name}
              </span>
            ) : null;
          })}
          {recipe.categories.length > 2 && (
            <span className="px-1.5 xs:px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
              +{recipe.categories.length - 2}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
