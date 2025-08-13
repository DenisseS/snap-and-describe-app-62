
// Nutrition calculation utilities

export const calculateCaloriesFromMacro = (grams: number, caloriesPerGram: number): number => {
  return grams * caloriesPerGram;
};

export const calculateDailyPercentage = (amount: number, dailyValue: number): number => {
  return Math.round((amount / dailyValue) * 100);
};

export const getHealthDescription = (type: string, ranking: number): string => {
  const descriptions = {
    protein: [
      "This product contains very little protein and may not contribute significantly to your daily protein needs.",
      "This product provides a small amount of protein for your daily nutritional requirements.",
      "This product offers a fair amount of protein to support your dietary needs.",
      "This product provides a good amount of protein to support your daily nutritional needs.",
      "This product is a very good source of protein, providing substantial nutritional value.",
      "This product is an excellent source of protein, providing a significant amount of this essential macronutrient."
    ],
    fats: [
      "This product is extremely high in fats and should be consumed very sparingly.",
      "This product is very high in fats and should be consumed in moderation as part of a balanced diet.",
      "This product contains a high amount of fats. Consider consuming in moderation.",
      "This product contains a moderate amount of fats, which is reasonable for most diets.",
      "This product is low in fats, making it a good choice for health-conscious eating.",
      "This product is very low in fats, making it an excellent lighter option for your diet."
    ],
    fiber: [
      "This product contains very little dietary fiber and won't contribute much to digestive health.",
      "This product contains a small amount of dietary fiber.",
      "This product provides a fair amount of dietary fiber for digestive support.",
      "This product provides a good amount of dietary fiber to support digestive health.",
      "This product is a very good source of dietary fiber, which supports digestive health.",
      "This product is an excellent source of dietary fiber, which greatly supports digestive health and overall wellness."
    ],
    carbs: [
      "This product has an excessive amount of carbohydrates that may not fit well in most balanced diets.",
      "This product is high in carbohydrates and should be consumed mindfully.",
      "This product contains a fair amount of carbohydrates for energy needs.",
      "This product provides a good amount of carbohydrates for sustained energy.",
      "This product offers a very good balance of carbohydrates for optimal energy.",
      "This product provides an excellent amount of carbohydrates, perfectly balanced for sustained energy and nutrition."
    ]
  };
  
  return descriptions[type]?.[ranking] || "Nutritional information available.";
};

export const createNutritionDetails = (
  type: 'protein' | 'carbs' | 'fats' | 'fiber',
  amount: number,
  healthRanking: number
): any => {
  const caloriesPerGram = { protein: 4, carbs: 4, fats: 9, fiber: 0 };
  const dailyValues = { protein: 50, carbs: 300, fats: 65, fiber: 25 };
  
  return {
    description: getHealthDescription(type, healthRanking),
    total: amount,
    caloriesFrom: calculateCaloriesFromMacro(amount, caloriesPerGram[type]),
    dailyPercentage: calculateDailyPercentage(amount, dailyValues[type]),
    healthRanking
  };
};

export const createCaloriesDetails = (protein: number, carbs: number, fats: number): any => {
  const caloriesFromProtein = calculateCaloriesFromMacro(protein, 4);
  const caloriesFromCarbs = calculateCaloriesFromMacro(carbs, 4);
  const caloriesFromFats = calculateCaloriesFromMacro(fats, 9);
  const totalCalories = caloriesFromProtein + caloriesFromCarbs + caloriesFromFats;
  
  return {
    description: "Energy content from all macronutrients combined",
    total: totalCalories,
    fromCarbs: caloriesFromCarbs,
    fromProtein: caloriesFromProtein,
    fromFat: caloriesFromFats
  };
};
