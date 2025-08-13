
import React from 'react';
import { useTranslation } from 'react-i18next';

interface NutritionCardProps {
  type: 'protein' | 'fats' | 'fiber';
  isExpanded: boolean;
  onClick: () => void;
  nutritionData: {
    protein: {
      total: number;
      healthRanking: number;
      description: string;
    };
    fats: {
      total: number;
      healthRanking: number;
      description: string;
    };
    fiber: {
      total: number;
      healthRanking: number;
      description: string;
    };
  };
}

const NutritionCard: React.FC<NutritionCardProps> = ({ type, isExpanded, onClick, nutritionData }) => {
  const { t } = useTranslation();

  const getCardContent = () => {
    const data = nutritionData[type];
    const ranking = data.healthRanking;
    
    // Get color based on ranking (0-5)
    const getColorFromRanking = (ranking: number) => {
      const colors = [
        { bg: 'bg-red-50', icon: 'bg-red-500' },     // 0 - Very poor
        { bg: 'bg-red-100', icon: 'bg-red-400' },    // 1 - Poor
        { bg: 'bg-orange-50', icon: 'bg-orange-500' }, // 2 - Fair
        { bg: 'bg-yellow-50', icon: 'bg-yellow-500' }, // 3 - Good
        { bg: 'bg-lime-50', icon: 'bg-lime-500' },   // 4 - Very good
        { bg: 'bg-green-50', icon: 'bg-green-500' }  // 5 - Excellent
      ];
      return colors[Math.max(0, Math.min(5, ranking))];
    };

    const colors = getColorFromRanking(ranking);
    
    return {
      title: t(type),
      description: data.description,
      value: `${data.total}g`,
      color: colors.bg,
      iconColor: colors.icon
    };
  };

  const content = getCardContent();

  return (
    <div 
      className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${content.color}`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-2">
        <div className={`w-6 h-6 rounded-full ${content.iconColor} flex-shrink-0`}></div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">{content.title}</h3>
            <span className="text-xs font-medium text-gray-700">{content.value}</span>
          </div>
          {isExpanded && (
            <p className="text-gray-700 text-xs leading-relaxed">
              {content.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionCard;
