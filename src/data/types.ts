
// Database schemas and TypeScript interfaces

export interface NutritionDetails {
  description: string;
  total: number;
  caloriesFrom: number;
  dailyPercentage: number;
  healthRanking: number;
}

export interface CaloriesDetails {
  description: string;
  total: number;
  fromCarbs: number;
  fromProtein: number;
  fromFat: number;
}

export interface ProcessingLevel {
  nova: 1 | 2 | 3 | 4;
  category: 'minimal' | 'processed' | 'ultra-processed';
  descriptionKey: string; // Solo clave de traducción
  indicatorsKeys: string[]; // Solo claves de traducción
}

export interface Product {
  id: string;
  nameKey: string; // Solo clave de traducción
  image: string;
  rating: number;
  categoryKey: string; // Solo clave de traducción
  nutrition: {
    protein: NutritionDetails;
    carbs: NutritionDetails;
    fats: NutritionDetails;
    fiber: NutritionDetails;
    calories: CaloriesDetails;
    vitamins: string[];
    minerals: string[];
    saturatedFat?: number;
    sugar?: number;
    sodium?: number;
    cholesterol?: number;
    vitaminC?: number;
    calcium?: number;
    iron?: number;
    potassium?: number;
  };
  allergens: {
    vegan: boolean;
    vegetarian: boolean;
    glutenFree: boolean;
    lactoseFree: boolean;
    nutFree: boolean;
    eggFree: boolean;
    fishFree: boolean;
    soyFree: boolean;
    halal: boolean;
    kosher: boolean;
    organic: boolean;
    lowSodium: boolean;
    sugarFree: boolean;
    keto: boolean;
  };
  processingLevel: ProcessingLevel;
  otherOptionsIds: string[];
  descriptionKey: string; // Solo clave de traducción
}

// Interfaz para productos completamente traducidos (para compatibilidad)
export interface TranslatedProduct extends Omit<Product, 'nameKey' | 'categoryKey' | 'descriptionKey'> {
  name: string;
  category: string;
  description: string;
}

export interface UserFavorites {
  userId: string;
  favoriteIds: string[];
  preferences: {
    [productId: string]: {
      status: 'heart' | 'thumb-down' | null;
    };
  };
  allergenPreferences: {
    avoidAllergens: string[]; // Array of allergen IDs to avoid
  };
}
