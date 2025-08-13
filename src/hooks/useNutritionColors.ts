
import { useMemo } from 'react';

export const useNutritionColors = () => {
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

  return { getColorFromRanking };
};
