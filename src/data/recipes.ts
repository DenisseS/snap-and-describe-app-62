
export interface Recipe {
  id: string;
  name: string;
  image: string;
  prepTime: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  categories: string[];
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    iron: number; // mg
    sodium: number; // mg
  };
  isUserRecipe?: boolean;
  createdBy?: string;
}

export const predefinedRecipes: Recipe[] = [
  {
    id: 'recipe_001',
    name: 'Ensalada de Quinoa con Pollo',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    prepTime: 25,
    difficulty: 'easy',
    servings: 4,
    categories: ['alta-proteina', 'alta-fibra', 'bajo-sodio'],
    ingredients: [
      '1 taza de quinoa',
      '2 pechugas de pollo',
      '2 tomates',
      '1 pepino',
      '1/2 cebolla roja',
      'Hojas de espinaca',
      'Aceite de oliva',
      'Limón',
      'Sal y pimienta'
    ],
    instructions: [
      'Cocinar la quinoa según las instrucciones del paquete',
      'Cocinar las pechugas de pollo a la plancha y cortar en tiras',
      'Picar los tomates, pepino y cebolla',
      'Mezclar todos los ingredientes en un bowl',
      'Aderezar con aceite de oliva, limón, sal y pimienta'
    ],
    nutrition: {
      calories: 320,
      protein: 28,
      carbs: 35,
      fat: 8,
      fiber: 6,
      iron: 3.2,
      sodium: 180
    }
  },
  {
    id: 'recipe_002',
    name: 'Salmón con Brócoli al Vapor',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    prepTime: 20,
    difficulty: 'medium',
    servings: 2,
    categories: ['alta-proteina', 'alto-hierro', 'omega-3'],
    ingredients: [
      '2 filetes de salmón',
      '1 cabeza de brócoli',
      '1 limón',
      'Aceite de oliva',
      'Ajo',
      'Sal y pimienta',
      'Eneldo fresco'
    ],
    instructions: [
      'Precalentar el horno a 200°C',
      'Marinar el salmón con limón, aceite y especias',
      'Cortar el brócoli en floretes',
      'Cocinar el salmón al horno por 12-15 minutos',
      'Cocinar el brócoli al vapor por 5-7 minutos',
      'Servir con eneldo fresco'
    ],
    nutrition: {
      calories: 380,
      protein: 35,
      carbs: 12,
      fat: 22,
      fiber: 4,
      iron: 2.8,
      sodium: 220
    }
  },
  {
    id: 'recipe_003',
    name: 'Smoothie Verde Energético',
    image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400',
    prepTime: 5,
    difficulty: 'easy',
    servings: 1,
    categories: ['alta-fibra', 'alto-hierro', 'antioxidantes'],
    ingredients: [
      '1 plátano',
      '1 taza de espinacas',
      '1/2 aguacate',
      '1 taza de leche de almendras',
      '1 cucharada de semillas de chía',
      'Miel al gusto'
    ],
    instructions: [
      'Lavar las espinacas',
      'Pelar el plátano y el aguacate',
      'Agregar todos los ingredientes a la licuadora',
      'Licuar hasta obtener consistencia suave',
      'Servir inmediatamente'
    ],
    nutrition: {
      calories: 280,
      protein: 8,
      carbs: 32,
      fat: 15,
      fiber: 12,
      iron: 4.5,
      sodium: 85
    }
  }
];

export const recipeCategories = [
  { id: 'alta-proteina', name: 'Alta Proteína', color: 'bg-blue-100 text-blue-800' },
  { id: 'alta-fibra', name: 'Alta Fibra', color: 'bg-green-100 text-green-800' },
  { id: 'alto-hierro', name: 'Alto Hierro', color: 'bg-red-100 text-red-800' },
  { id: 'bajo-sodio', name: 'Bajo Sodio', color: 'bg-purple-100 text-purple-800' },
  { id: 'omega-3', name: 'Rico en Omega-3', color: 'bg-orange-100 text-orange-800' },
  { id: 'antioxidantes', name: 'Antioxidantes', color: 'bg-pink-100 text-pink-800' }
];

export const getUserRecipes = (): Recipe[] => {
  const stored = localStorage.getItem('userRecipes');
  return stored ? JSON.parse(stored) : [];
};

export const saveUserRecipe = (recipe: Recipe) => {
  const userRecipes = getUserRecipes();
  userRecipes.push({ ...recipe, isUserRecipe: true });
  localStorage.setItem('userRecipes', JSON.stringify(userRecipes));
};

export const getAllRecipes = (): Recipe[] => {
  return [...predefinedRecipes, ...getUserRecipes()];
};
