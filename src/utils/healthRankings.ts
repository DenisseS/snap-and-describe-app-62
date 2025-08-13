
// Health ranking calculation utilities

export const calculateHealthRanking = (type: string, value: number): number => {
  switch (type) {
    case 'protein':
      if (value >= 15) return 5; // Excellent
      if (value >= 10) return 4; // Very good
      if (value >= 5) return 3;  // Good
      if (value >= 2) return 2;  // Fair
      if (value >= 1) return 1;  // Poor
      return 0; // Very poor
    
    case 'fats':
      if (value <= 1) return 5;   // Very low (excellent)
      if (value <= 3) return 4;   // Low (very good)
      if (value <= 5) return 3;   // Moderate (good)
      if (value <= 10) return 2;  // High (fair)
      if (value <= 15) return 1;  // Very high (poor)
      return 0; // Extremely high (very poor)
    
    case 'fiber':
      if (value >= 8) return 5;   // Excellent
      if (value >= 5) return 4;   // Very good
      if (value >= 3) return 3;   // Good
      if (value >= 2) return 2;   // Fair
      if (value >= 1) return 1;   // Poor
      return 0; // Very poor
    
    case 'carbs':
      // For carbs, moderate amounts are usually good
      if (value >= 5 && value <= 15) return 5; // Excellent range
      if (value >= 3 && value <= 20) return 4; // Very good range
      if (value >= 2 && value <= 25) return 3; // Good range
      if (value >= 1 && value <= 30) return 2; // Fair range
      if (value <= 35) return 1; // Poor
      return 0; // Very poor (too high)
    
    default:
      return 3;
  }
};

export const calculateAllHealthRankings = (nutrition: { protein: number; carbs: number; fats: number; fiber: number }) => {
  return {
    protein: calculateHealthRanking('protein', nutrition.protein),
    carbs: calculateHealthRanking('carbs', nutrition.carbs),
    fats: calculateHealthRanking('fats', nutrition.fats),
    fiber: calculateHealthRanking('fiber', nutrition.fiber)
  };
};
