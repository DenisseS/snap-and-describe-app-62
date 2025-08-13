
import React from 'react';
import { AllergenConfig } from '@/data/allergens';

interface AllergenCardProps {
  allergen: AllergenConfig;
  className?: string;
}

const AllergenCard: React.FC<AllergenCardProps> = ({ 
  allergen, 
  className = '' 
}) => {
  const IconComponent = allergen.icon;

  return (
    <div className={`flex flex-col items-center space-y-2 p-2 rounded-lg ${allergen.colors.bg} ${className}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${allergen.colors.iconBg}`}>
        <IconComponent className={`h-4 w-4 ${allergen.colors.iconColor}`} />
      </div>
      <div className="text-center">
        <h4 className="text-xs font-medium text-gray-800">{allergen.name}</h4>
      </div>
    </div>
  );
};

export default AllergenCard;
