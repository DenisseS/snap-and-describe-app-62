import { Product } from './types';

/**
 * Base de datos completa de productos con datos invariables
 * Solo contiene información nutricional, alérgenos, y referencias
 * Las traducciones se manejan a través de i18n usando las claves
 */
export const productsCoreDB: Product[] = [
  {
    id: 'broccoli_001',
    nameKey: 'broccoli_001',
    image: '/placeholder.svg',
    rating: 9.2,
    categoryKey: 'vegetables',
    nutrition: {
      protein: {
        description: 'Excellent source of protein',
        total: 2.8,
        caloriesFrom: 11.2,
        dailyPercentage: 6,
        healthRanking: 8
      },
      carbs: {
        description: 'Low in carbohydrates',
        total: 6.6,
        caloriesFrom: 26.4,
        dailyPercentage: 2,
        healthRanking: 9
      },
      fats: {
        description: 'Very low in fats',
        total: 0.4,
        caloriesFrom: 3.6,
        dailyPercentage: 1,
        healthRanking: 10
      },
      fiber: {
        description: 'High in fiber',
        total: 2.6,
        caloriesFrom: 0,
        dailyPercentage: 10,
        healthRanking: 9
      },
      calories: {
        description: 'Very low in calories',
        total: 34,
        fromCarbs: 26.4,
        fromProtein: 11.2,
        fromFat: 3.6
      },
      vitamins: ['vitamin_c', 'vitamin_k', 'folate'],
      minerals: ['potassium', 'iron', 'calcium'],
      saturatedFat: 0.1,
      sugar: 1.5,
      sodium: 33,
      cholesterol: 0,
      vitaminC: 89.2,
      calcium: 47,
      iron: 0.7,
      potassium: 316
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: true
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'broccoli_processing_desc',
      indicatorsKeys: ['natural_food', 'no_additives', 'no_preservatives', 'fresh_vegetable']
    },
    otherOptionsIds: ['apple_002', 'spinach_003', 'carrot_004'],
    descriptionKey: 'broccoli_001'
  },
  {
    id: 'apple_002',
    nameKey: 'apple_002',
    image: '/placeholder.svg',
    rating: 8.8,
    categoryKey: 'fruits',
    nutrition: {
      protein: {
        description: 'Low in protein',
        total: 0.3,
        caloriesFrom: 1.2,
        dailyPercentage: 1,
        healthRanking: 4
      },
      carbs: {
        description: 'Good source of natural carbohydrates',
        total: 14.1,
        caloriesFrom: 56.4,
        dailyPercentage: 5,
        healthRanking: 8
      },
      fats: {
        description: 'Very low in fats',
        total: 0.2,
        caloriesFrom: 1.8,
        dailyPercentage: 0,
        healthRanking: 10
      },
      fiber: {
        description: 'High in fiber',
        total: 2.4,
        caloriesFrom: 0,
        dailyPercentage: 10,
        healthRanking: 9
      },
      calories: {
        description: 'Low in calories',
        total: 52,
        fromCarbs: 47.2,
        fromProtein: 1.2,
        fromFat: 1.8
      },
      vitamins: ['vitamin_c', 'vitamin_a'],
      minerals: ['potassium'],
      saturatedFat: 0.1,
      sugar: 10.4,
      sodium: 1,
      cholesterol: 0,
      vitaminC: 4.6,
      calcium: 6,
      iron: 0.1,
      potassium: 107
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'apple_processing_desc',
      indicatorsKeys: ['fresh_fruit', 'no_additives', 'unprocessed']
    },
    otherOptionsIds: ['broccoli_001', 'pear_008', 'orange_009'],
    descriptionKey: 'apple_002'
  },
  {
    id: 'spinach_003',
    nameKey: 'spinach_003',
    image: '/placeholder.svg',
    rating: 9.5,
    categoryKey: 'vegetables',
    nutrition: {
      protein: {
        description: 'Good source of protein',
        total: 2.9,
        caloriesFrom: 11.6,
        dailyPercentage: 6,
        healthRanking: 8
      },
      carbs: {
        description: 'Very low in carbohydrates',
        total: 3.6,
        caloriesFrom: 14.4,
        dailyPercentage: 1,
        healthRanking: 10
      },
      fats: {
        description: 'Very low in fats',
        total: 0.4,
        caloriesFrom: 3.6,
        dailyPercentage: 1,
        healthRanking: 10
      },
      fiber: {
        description: 'Good source of fiber',
        total: 2.2,
        caloriesFrom: 0,
        dailyPercentage: 9,
        healthRanking: 8
      },
      calories: {
        description: 'Very low in calories',
        total: 23,
        fromCarbs: 14.4,
        fromProtein: 11.6,
        fromFat: 3.6
      },
      vitamins: ['vitamin_k', 'vitamin_a', 'folate', 'vitamin_c'],
      minerals: ['iron', 'magnesium', 'potassium'],
      saturatedFat: 0.1,
      sugar: 0.4,
      sodium: 79,
      cholesterol: 0,
      vitaminC: 28.1,
      calcium: 99,
      iron: 2.7,
      potassium: 558
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: false,
      sugarFree: true,
      keto: true
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'spinach_processing_desc',
      indicatorsKeys: ['leafy_green', 'superfood', 'no_additives']
    },
    otherOptionsIds: ['kale_005', 'broccoli_001', 'brussels_007'],
    descriptionKey: 'spinach_003'
  },
  {
    id: 'carrot_004',
    nameKey: 'carrot_004',
    image: '/placeholder.svg',
    rating: 8.6,
    categoryKey: 'vegetables',
    nutrition: {
      protein: {
        description: 'Low in protein',
        total: 0.9,
        caloriesFrom: 3.6,
        dailyPercentage: 2,
        healthRanking: 5
      },
      carbs: {
        description: 'Moderate carbohydrates from natural sugars',
        total: 9.6,
        caloriesFrom: 38.4,
        dailyPercentage: 3,
        healthRanking: 7
      },
      fats: {
        description: 'Very low in fats',
        total: 0.2,
        caloriesFrom: 1.8,
        dailyPercentage: 0,
        healthRanking: 10
      },
      fiber: {
        description: 'Good source of fiber',
        total: 2.8,
        caloriesFrom: 0,
        dailyPercentage: 11,
        healthRanking: 8
      },
      calories: {
        description: 'Low in calories',
        total: 41,
        fromCarbs: 38.4,
        fromProtein: 3.6,
        fromFat: 1.8
      },
      vitamins: ['vitamin_a', 'vitamin_k', 'vitamin_c'],
      minerals: ['potassium'],
      saturatedFat: 0.0,
      sugar: 4.7,
      sodium: 69,
      cholesterol: 0,
      vitaminC: 5.9,
      calcium: 33,
      iron: 0.3,
      potassium: 320
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: false,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'carrot_processing_desc',
      indicatorsKeys: ['fresh', 'rich_beta_carotene', 'natural_tuber']
    },
    otherOptionsIds: ['sweet_potato_006', 'broccoli_001', 'apple_002'],
    descriptionKey: 'carrot_004'
  },
  {
    id: 'kale_005',
    nameKey: 'kale_005',
    image: '/placeholder.svg',
    rating: 9.8,
    categoryKey: 'vegetables',
    nutrition: {
      protein: {
        description: 'Excellent source of protein',
        total: 4.3,
        caloriesFrom: 17.2,
        dailyPercentage: 9,
        healthRanking: 9
      },
      carbs: {
        description: 'Low in carbohydrates',
        total: 8.8,
        caloriesFrom: 35.2,
        dailyPercentage: 3,
        healthRanking: 9
      },
      fats: {
        description: 'Very low in fats',
        total: 0.9,
        caloriesFrom: 8.1,
        dailyPercentage: 1,
        healthRanking: 9
      },
      fiber: {
        description: 'Excellent source of fiber',
        total: 3.6,
        caloriesFrom: 0,
        dailyPercentage: 14,
        healthRanking: 10
      },
      calories: {
        description: 'Very low in calories',
        total: 49,
        fromCarbs: 35.2,
        fromProtein: 17.2,
        fromFat: 8.1
      },
      vitamins: ['vitamin_k', 'vitamin_a', 'vitamin_c', 'folate'],
      minerals: ['calcium', 'potassium', 'iron', 'magnesium'],
      saturatedFat: 0.1,
      sugar: 2.3,
      sodium: 38,
      cholesterol: 0,
      vitaminC: 120,
      calcium: 150,
      iron: 1.5,
      potassium: 491
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: true
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'kale_processing_desc',
      indicatorsKeys: ['superfood', 'leafy_green', 'rich_antioxidants']
    },
    otherOptionsIds: ['spinach_003', 'broccoli_001', 'brussels_007'],
    descriptionKey: 'kale_005'
  },
  {
    id: 'cauliflower_006',
    nameKey: 'cauliflower_006',
    image: '/placeholder.svg',
    rating: 8.4,
    categoryKey: 'vegetables',
    nutrition: {
      protein: {
        description: 'Good source of protein',
        total: 1.9,
        caloriesFrom: 7.6,
        dailyPercentage: 4,
        healthRanking: 7
      },
      carbs: {
        description: 'Very low in carbohydrates',
        total: 4.9,
        caloriesFrom: 19.6,
        dailyPercentage: 2,
        healthRanking: 10
      },
      fats: {
        description: 'Very low in fats',
        total: 0.3,
        caloriesFrom: 2.7,
        dailyPercentage: 0,
        healthRanking: 10
      },
      fiber: {
        description: 'Good source of fiber',
        total: 2.0,
        caloriesFrom: 0,
        dailyPercentage: 8,
        healthRanking: 8
      },
      calories: {
        description: 'Very low in calories',
        total: 25,
        fromCarbs: 19.6,
        fromProtein: 7.6,
        fromFat: 2.7
      },
      vitamins: ['vitamin_c', 'vitamin_k', 'folate'],
      minerals: ['potassium'],
      saturatedFat: 0.1,
      sugar: 1.9,
      sodium: 30,
      cholesterol: 0,
      vitaminC: 48.2,
      calcium: 22,
      iron: 0.4,
      potassium: 299
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: true
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'cauliflower_processing_desc',
      indicatorsKeys: ['versatile', 'low_calories', 'fresh_vegetable']
    },
    otherOptionsIds: ['broccoli_001', 'brussels_007', 'kale_005'],
    descriptionKey: 'cauliflower_006'
  },
  {
    id: 'brussels_007',
    nameKey: 'brussels_007',
    image: '/placeholder.svg',
    rating: 8.9,
    categoryKey: 'vegetables',
    nutrition: {
      protein: {
        description: 'Good source of protein',
        total: 3.4,
        caloriesFrom: 13.6,
        dailyPercentage: 7,
        healthRanking: 8
      },
      carbs: {
        description: 'Low in carbohydrates',
        total: 8.9,
        caloriesFrom: 35.6,
        dailyPercentage: 3,
        healthRanking: 9
      },
      fats: {
        description: 'Very low in fats',
        total: 0.3,
        caloriesFrom: 2.7,
        dailyPercentage: 0,
        healthRanking: 10
      },
      fiber: {
        description: 'Excellent source of fiber',
        total: 3.8,
        caloriesFrom: 0,
        dailyPercentage: 15,
        healthRanking: 10
      },
      calories: {
        description: 'Very low in calories',
        total: 43,
        fromCarbs: 35.6,
        fromProtein: 13.6,
        fromFat: 2.7
      },
      vitamins: ['vitamin_k', 'vitamin_c', 'folate'],
      minerals: ['potassium', 'iron'],
      saturatedFat: 0.1,
      sugar: 2.2,
      sodium: 25,
      cholesterol: 0,
      vitaminC: 85,
      calcium: 42,
      iron: 1.4,
      potassium: 389
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: true
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'brussels_processing_desc',
      indicatorsKeys: ['fresh', 'rich_vitamin_c', 'high_fiber']
    },
    otherOptionsIds: ['broccoli_001', 'cauliflower_006', 'kale_005'],
    descriptionKey: 'brussels_007'
  },
  {
    id: 'pear_008',
    nameKey: 'pear_008',
    image: '/placeholder.svg',
    rating: 8.3,
    categoryKey: 'fruits',
    nutrition: {
      protein: {
        description: 'Low in protein',
        total: 0.4,
        caloriesFrom: 1.6,
        dailyPercentage: 1,
        healthRanking: 4
      },
      carbs: {
        description: 'Good source of natural carbohydrates',
        total: 15.2,
        caloriesFrom: 60.8,
        dailyPercentage: 5,
        healthRanking: 8
      },
      fats: {
        description: 'Very low in fats',
        total: 0.1,
        caloriesFrom: 0.9,
        dailyPercentage: 0,
        healthRanking: 10
      },
      fiber: {
        description: 'Excellent source of fiber',
        total: 3.1,
        caloriesFrom: 0,
        dailyPercentage: 12,
        healthRanking: 9
      },
      calories: {
        description: 'Low in calories',
        total: 62,
        fromCarbs: 60.0,
        fromProtein: 1.6,
        fromFat: 0.9
      },
      vitamins: ['vitamin_c', 'vitamin_k'],
      minerals: ['potassium'],
      saturatedFat: 0.0,
      sugar: 9.8,
      sodium: 1,
      cholesterol: 0,
      vitaminC: 4.3,
      calcium: 9,
      iron: 0.2,
      potassium: 116
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'pear_processing_desc',
      indicatorsKeys: ['fresh_fruit', 'high_fiber', 'natural_energy']
    },
    otherOptionsIds: ['apple_002', 'orange_009', 'banana_010'],
    descriptionKey: 'pear_008'
  },
  {
    id: 'orange_009',
    nameKey: 'orange_009',
    image: '/placeholder.svg',
    rating: 8.7,
    categoryKey: 'fruits',
    nutrition: {
      protein: {
        description: 'Low in protein',
        total: 0.9,
        caloriesFrom: 3.6,
        dailyPercentage: 2,
        healthRanking: 5
      },
      carbs: {
        description: 'Good source of natural carbohydrates',
        total: 11.8,
        caloriesFrom: 47.2,
        dailyPercentage: 4,
        healthRanking: 8
      },
      fats: {
        description: 'Very low in fats',
        total: 0.1,
        caloriesFrom: 0.9,
        dailyPercentage: 0,
        healthRanking: 10
      },
      fiber: {
        description: 'Good source of fiber',
        total: 2.4,
        caloriesFrom: 0,
        dailyPercentage: 10,
        healthRanking: 8
      },
      calories: {
        description: 'Low in calories',
        total: 47,
        fromCarbs: 47.2,
        fromProtein: 3.6,
        fromFat: 0.9
      },
      vitamins: ['vitamin_c', 'folate', 'vitamin_a'],
      minerals: ['potassium', 'calcium'],
      saturatedFat: 0.0,
      sugar: 9.4,
      sodium: 0,
      cholesterol: 0,
      vitaminC: 53.2,
      calcium: 40,
      iron: 0.1,
      potassium: 181
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'orange_processing_desc',
      indicatorsKeys: ['citrus_natural', 'rich_vitamin_c', 'fresh']
    },
    otherOptionsIds: ['apple_002', 'pear_008', 'banana_010'],
    descriptionKey: 'orange_009'
  },
  {
    id: 'banana_010',
    nameKey: 'banana_010',
    image: '/placeholder.svg',
    rating: 8.1,
    categoryKey: 'fruits',
    nutrition: {
      protein: {
        description: 'Low in protein',
        total: 1.1,
        caloriesFrom: 4.4,
        dailyPercentage: 2,
        healthRanking: 5
      },
      carbs: {
        description: 'Good source of natural carbohydrates',
        total: 22.8,
        caloriesFrom: 91.2,
        dailyPercentage: 8,
        healthRanking: 7
      },
      fats: {
        description: 'Very low in fats',
        total: 0.3,
        caloriesFrom: 2.7,
        dailyPercentage: 0,
        healthRanking: 10
      },
      fiber: {
        description: 'Good source of fiber',
        total: 2.6,
        caloriesFrom: 0,
        dailyPercentage: 10,
        healthRanking: 8
      },
      calories: {
        description: 'Moderate calories from natural sugars',
        total: 98,
        fromCarbs: 91.2,
        fromProtein: 4.4,
        fromFat: 2.7
      },
      vitamins: ['vitamin_b6', 'vitamin_c', 'folate'],
      minerals: ['potassium', 'magnesium'],
      saturatedFat: 0.1,
      sugar: 12.2,
      sodium: 1,
      cholesterol: 0,
      vitaminC: 8.7,
      calcium: 5,
      iron: 0.3,
      potassium: 358
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'banana_processing_desc',
      indicatorsKeys: ['tropical_fruit', 'rich_potassium', 'natural_energy']
    },
    otherOptionsIds: ['apple_002', 'pear_008', 'orange_009'],
    descriptionKey: 'banana_010'
  },
  {
    id: 'avocado_001',
    nameKey: 'avocado_001',
    image: '/placeholder.svg',
    rating: 9.1,
    categoryKey: 'fruits',
    nutrition: {
      protein: {
        description: 'Good source of protein',
        total: 2.0,
        caloriesFrom: 8.0,
        dailyPercentage: 4,
        healthRanking: 7
      },
      carbs: {
        description: 'Very low in carbohydrates',
        total: 8.5,
        caloriesFrom: 34.0,
        dailyPercentage: 3,
        healthRanking: 9
      },
      fats: {
        description: 'High in healthy monounsaturated fats',
        total: 14.7,
        caloriesFrom: 132.3,
        dailyPercentage: 23,
        healthRanking: 8
      },
      fiber: {
        description: 'Excellent source of fiber',
        total: 6.7,
        caloriesFrom: 0,
        dailyPercentage: 27,
        healthRanking: 10
      },
      calories: {
        description: 'High in calories but from healthy fats',
        total: 160,
        fromCarbs: 34.0,
        fromProtein: 8.0,
        fromFat: 132.3
      },
      vitamins: ['vitamin_k', 'folate', 'vitamin_c', 'vitamin_e'],
      minerals: ['potassium', 'magnesium'],
      saturatedFat: 2.1,
      sugar: 0.7,
      sodium: 7,
      cholesterol: 0,
      vitaminC: 10.0,
      calcium: 12,
      iron: 0.6,
      potassium: 485
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: true,
      keto: true
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'avocado_processing_desc',
      indicatorsKeys: ['healthy_fats', 'natural_creamy', 'rich_potassium']
    },
    otherOptionsIds: ['almonds_004', 'olive_oil', 'nuts'],
    descriptionKey: 'avocado_001'
  },
  {
    id: 'quinoa_002',
    nameKey: 'quinoa_002',
    image: '/placeholder.svg',
    rating: 9.0,
    categoryKey: 'grains',
    nutrition: {
      protein: {
        description: 'Excellent source of complete protein',
        total: 4.4,
        caloriesFrom: 17.6,
        dailyPercentage: 9,
        healthRanking: 9
      },
      carbs: {
        description: 'Good source of complex carbohydrates',
        total: 21.3,
        caloriesFrom: 85.2,
        dailyPercentage: 7,
        healthRanking: 8
      },
      fats: {
        description: 'Low in fats, healthy profile',
        total: 1.9,
        caloriesFrom: 17.1,
        dailyPercentage: 3,
        healthRanking: 8
      },
      fiber: {
        description: 'Excellent source of fiber',
        total: 2.8,
        caloriesFrom: 0,
        dailyPercentage: 11,
        healthRanking: 9
      },
      calories: {
        description: 'Moderate calories, nutrient dense',
        total: 120,
        fromCarbs: 85.2,
        fromProtein: 17.6,
        fromFat: 17.1
      },
      vitamins: ['folate', 'vitamin_e', 'vitamin_b6'],
      minerals: ['magnesium', 'phosphorus', 'potassium', 'iron'],
      saturatedFat: 0.2,
      sugar: 0.9,
      sodium: 7,
      cholesterol: 0,
      vitaminC: 0,
      calcium: 17,
      iron: 1.5,
      potassium: 172
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: true,
      keto: false
    },
    processingLevel: {
      nova: 2,
      category: 'processed',
      descriptionKey: 'quinoa_processing_desc',
      indicatorsKeys: ['cooked_grain', 'clean', 'complete_protein']
    },
    otherOptionsIds: ['brown_rice', 'oats', 'buckwheat'],
    descriptionKey: 'quinoa_002'
  },
  {
    id: 'salmon_003',
    nameKey: 'salmon_003',
    image: '/placeholder.svg',
    rating: 9.3,
    categoryKey: 'fish',
    nutrition: {
      protein: {
        description: 'Excellent source of high-quality protein',
        total: 25.4,
        caloriesFrom: 101.6,
        dailyPercentage: 51,
        healthRanking: 10
      },
      carbs: {
        description: 'No carbohydrates',
        total: 0,
        caloriesFrom: 0,
        dailyPercentage: 0,
        healthRanking: 10
      },
      fats: {
        description: 'High in healthy omega-3 fatty acids',
        total: 12.4,
        caloriesFrom: 111.6,
        dailyPercentage: 19,
        healthRanking: 9
      },
      fiber: {
        description: 'No fiber',
        total: 0,
        caloriesFrom: 0,
        dailyPercentage: 0,
        healthRanking: 1
      },
      calories: {
        description: 'Moderate calories, high quality',
        total: 208,
        fromCarbs: 0,
        fromProtein: 101.6,
        fromFat: 111.6
      },
      vitamins: ['vitamin_d', 'vitamin_b12', 'vitamin_b6'],
      minerals: ['selenium', 'phosphorus', 'potassium'],
      saturatedFat: 3.1,
      sugar: 0,
      sodium: 48,
      cholesterol: 55,
      vitaminC: 0,
      calcium: 12,
      iron: 0.8,
      potassium: 363
    },
    allergens: {
      vegan: false,
      vegetarian: false,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: false,
      soyFree: true,
      halal: false,
      kosher: false,
      organic: false,
      lowSodium: false,
      sugarFree: true,
      keto: true
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'salmon_processing_desc',
      indicatorsKeys: ['fresh_fish', 'rich_omega3', 'natural_protein']
    },
    otherOptionsIds: ['tuna', 'mackerel', 'sardines'],
    descriptionKey: 'salmon_003'
  },
  {
    id: 'almonds_004',
    nameKey: 'almonds_004',
    image: '/placeholder.svg',
    rating: 8.9,
    categoryKey: 'nuts',
    nutrition: {
      protein: {
        description: 'Excellent source of protein',
        total: 21.2,
        caloriesFrom: 84.8,
        dailyPercentage: 42,
        healthRanking: 9
      },
      carbs: {
        description: 'Low in carbohydrates',
        total: 9.5,
        caloriesFrom: 38.0,
        dailyPercentage: 3,
        healthRanking: 8
      },
      fats: {
        description: 'High in healthy monounsaturated fats',
        total: 49.9,
        caloriesFrom: 449.1,
        dailyPercentage: 77,
        healthRanking: 8
      },
      fiber: {
        description: 'Excellent source of fiber',
        total: 12.5,
        caloriesFrom: 0,
        dailyPercentage: 50,
        healthRanking: 10
      },
      calories: {
        description: 'High in calories but very nutritious',
        total: 579,
        fromCarbs: 38.0,
        fromProtein: 84.8,
        fromFat: 449.1
      },
      vitamins: ['vitamin_e', 'vitamin_b2', 'niacin'],
      minerals: ['magnesium', 'phosphorus', 'calcium'],
      saturatedFat: 3.8,
      sugar: 4.4,
      sodium: 1,
      cholesterol: 0,
      vitaminC: 0,
      calcium: 269,
      iron: 3.7,
      potassium: 733
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: false,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: true
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'almonds_processing_desc',
      indicatorsKeys: ['natural_nut', 'rich_vitamin_e', 'healthy_fats']
    },
    otherOptionsIds: ['walnuts', 'cashews', 'pistachios'],
    descriptionKey: 'almonds_004'
  },
  {
    id: 'blueberries_005',
    nameKey: 'blueberries_005',
    image: '/placeholder.svg',
    rating: 9.4,
    categoryKey: 'fruits',
    nutrition: {
      protein: {
        description: 'Low in protein',
        total: 0.7,
        caloriesFrom: 2.8,
        dailyPercentage: 1,
        healthRanking: 4
      },
      carbs: {
        description: 'Moderate natural carbohydrates',
        total: 14.5,
        caloriesFrom: 58.0,
        dailyPercentage: 5,
        healthRanking: 8
      },
      fats: {
        description: 'Very low in fats',
        total: 0.3,
        caloriesFrom: 2.7,
        dailyPercentage: 0,
        healthRanking: 10
      },
      fiber: {
        description: 'Good source of fiber',
        total: 2.4,
        caloriesFrom: 0,
        dailyPercentage: 10,
        healthRanking: 8
      },
      calories: {
        description: 'Low in calories',
        total: 57,
        fromCarbs: 58.0,
        fromProtein: 2.8,
        fromFat: 2.7
      },
      vitamins: ['vitamin_c', 'vitamin_k', 'vitamin_e'],
      minerals: ['manganese', 'potassium'],
      saturatedFat: 0.1,
      sugar: 10.0,
      sodium: 1,
      cholesterol: 0,
      vitaminC: 9.7,
      calcium: 6,
      iron: 0.3,
      potassium: 77
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'blueberries_processing_desc',
      indicatorsKeys: ['rich_antioxidants', 'fresh_fruit', 'superfood']
    },
    otherOptionsIds: ['strawberries', 'raspberries', 'blackberries'],
    descriptionKey: 'blueberries_005'
  },
  {
    id: 'sweet_potato_006',
    nameKey: 'sweet_potato_006',
    image: '/placeholder.svg',
    rating: 8.8,
    categoryKey: 'vegetables',
    nutrition: {
      protein: {
        description: 'Good source of protein',
        total: 2.0,
        caloriesFrom: 8.0,
        dailyPercentage: 4,
        healthRanking: 7
      },
      carbs: {
        description: 'Good source of complex carbohydrates',
        total: 20.1,
        caloriesFrom: 80.4,
        dailyPercentage: 7,
        healthRanking: 7
      },
      fats: {
        description: 'Very low in fats',
        total: 0.1,
        caloriesFrom: 0.9,
        dailyPercentage: 0,
        healthRanking: 10
      },
      fiber: {
        description: 'Good source of fiber',
        total: 3.0,
        caloriesFrom: 0,
        dailyPercentage: 12,
        healthRanking: 8
      },
      calories: {
        description: 'Moderate calories from complex carbs',
        total: 86,
        fromCarbs: 80.4,
        fromProtein: 8.0,
        fromFat: 0.9
      },
      vitamins: ['vitamin_a', 'vitamin_c', 'vitamin_b6'],
      minerals: ['potassium', 'manganese'],
      saturatedFat: 0.0,
      sugar: 4.2,
      sodium: 54,
      cholesterol: 0,
      vitaminC: 2.4,
      calcium: 30,
      iron: 0.6,
      potassium: 337
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: false,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'sweet_potato_processing_desc',
      indicatorsKeys: ['natural_tuber', 'rich_beta_carotene', 'high_fiber']
    },
    otherOptionsIds: ['carrot_004', 'pumpkin', 'butternut_squash'],
    descriptionKey: 'sweet_potato_006'
  },
  {
    id: 'greek_yogurt_007',
    nameKey: 'greek_yogurt_007',
    image: '/placeholder.svg',
    rating: 8.5,
    categoryKey: 'dairy',
    nutrition: {
      protein: {
        description: 'Excellent source of protein',
        total: 10.0,
        caloriesFrom: 40.0,
        dailyPercentage: 20,
        healthRanking: 9
      },
      carbs: {
        description: 'Low in carbohydrates',
        total: 3.6,
        caloriesFrom: 14.4,
        dailyPercentage: 1,
        healthRanking: 9
      },
      fats: {
        description: 'Low in fats',
        total: 0.4,
        caloriesFrom: 3.6,
        dailyPercentage: 1,
        healthRanking: 9
      },
      fiber: {
        description: 'No fiber',
        total: 0,
        caloriesFrom: 0,
        dailyPercentage: 0,
        healthRanking: 1
      },
      calories: {
        description: 'Low in calories, high protein',
        total: 59,
        fromCarbs: 14.4,
        fromProtein: 40.0,
        fromFat: 3.6
      },
      vitamins: ['vitamin_b12', 'riboflavin'],
      minerals: ['calcium', 'phosphorus', 'potassium'],
      saturatedFat: 0.1,
      sugar: 3.6,
      sodium: 36,
      cholesterol: 5,
      vitaminC: 0,
      calcium: 110,
      iron: 0.1,
      potassium: 141
    },
    allergens: {
      vegan: false,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: false,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: false,
      sugarFree: false,
      keto: true
    },
    processingLevel: {
      nova: 2,
      category: 'processed',
      descriptionKey: 'greek_yogurt_processing_desc',
      indicatorsKeys: ['fermented', 'probiotics', 'strained']
    },
    otherOptionsIds: ['cottage_cheese', 'kefir', 'plain_yogurt'],
    descriptionKey: 'greek_yogurt_007'
  },
  {
    id: 'chia_seeds_008',
    nameKey: 'chia_seeds_008',
    image: '/placeholder.svg',
    rating: 9.6,
    categoryKey: 'seeds',
    nutrition: {
      protein: {
        description: 'Excellent source of protein',
        total: 16.5,
        caloriesFrom: 66.0,
        dailyPercentage: 33,
        healthRanking: 9
      },
      carbs: {
        description: 'Good source of complex carbohydrates',
        total: 42.1,
        caloriesFrom: 168.4,
        dailyPercentage: 14,
        healthRanking: 8
      },
      fats: {
        description: 'High in healthy omega-3 fats',
        total: 30.7,
        caloriesFrom: 276.3,
        dailyPercentage: 47,
        healthRanking: 9
      },
      fiber: {
        description: 'Exceptional source of fiber',
        total: 34.4,
        caloriesFrom: 0,
        dailyPercentage: 138,
        healthRanking: 10
      },
      calories: {
        description: 'High in calories but very nutritious',
        total: 486,
        fromCarbs: 168.4,
        fromProtein: 66.0,
        fromFat: 276.3
      },
      vitamins: ['vitamin_e', 'niacin', 'thiamine'],
      minerals: ['calcium', 'phosphorus', 'magnesium'],
      saturatedFat: 3.3,
      sugar: 0,
      sodium: 16,
      cholesterol: 0,
      vitaminC: 1.6,
      calcium: 631,
      iron: 7.7,
      potassium: 407
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: true,
      keto: true
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'chia_seeds_processing_desc',
      indicatorsKeys: ['natural_seed', 'rich_omega3', 'high_fiber']
    },
    otherOptionsIds: ['flax_seeds', 'hemp_seeds', 'pumpkin_seeds'],
    descriptionKey: 'chia_seeds_008'
  },
  {
    id: 'chips_009',
    nameKey: 'chips_009',
    image: '/placeholder.svg',
    rating: 3.2,
    categoryKey: 'snacks',
    nutrition: {
      protein: {
        description: 'Low protein content',
        total: 6.6,
        caloriesFrom: 26.4,
        dailyPercentage: 13,
        healthRanking: 4
      },
      carbs: {
        description: 'High in refined carbohydrates',
        total: 49.7,
        caloriesFrom: 198.8,
        dailyPercentage: 17,
        healthRanking: 3
      },
      fats: {
        description: 'Very high in unhealthy fats',
        total: 34.6,
        caloriesFrom: 311.4,
        dailyPercentage: 53,
        healthRanking: 2
      },
      fiber: {
        description: 'Low fiber content',
        total: 4.4,
        caloriesFrom: 0,
        dailyPercentage: 18,
        healthRanking: 6
      },
      calories: {
        description: 'Very high in calories',
        total: 536,
        fromCarbs: 198.8,
        fromProtein: 26.4,
        fromFat: 311.4
      },
      vitamins: ['vitamin_c'],
      minerals: ['potassium'],
      saturatedFat: 4.6,
      sugar: 0.3,
      sodium: 525,
      cholesterol: 0,
      vitaminC: 18.8,
      calcium: 14,
      iron: 1.6,
      potassium: 1196
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: false,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: false,
      sugarFree: true,
      keto: false
    },
    processingLevel: {
      nova: 4,
      category: 'ultra-processed',
      descriptionKey: 'chips_processing_desc',
      indicatorsKeys: ['hydrogenated_oils', 'high_sodium', 'artificial_flavors', 'preservatives', 'industrial_frying']
    },
    otherOptionsIds: ['baked_chips', 'vegetable_chips', 'nuts'],
    descriptionKey: 'chips_009'
  },
  {
    id: 'soda_010',
    nameKey: 'soda_010',
    image: '/placeholder.svg',
    rating: 2.1,
    categoryKey: 'beverages',
    nutrition: {
      protein: {
        description: 'No protein',
        total: 0,
        caloriesFrom: 0,
        dailyPercentage: 0,
        healthRanking: 1
      },
      carbs: {
        description: 'Very high in refined sugars',
        total: 10.6,
        caloriesFrom: 42.4,
        dailyPercentage: 4,
        healthRanking: 1
      },
      fats: {
        description: 'No fats',
        total: 0,
        caloriesFrom: 0,
        dailyPercentage: 0,
        healthRanking: 10
      },
      fiber: {
        description: 'No fiber',
        total: 0,
        caloriesFrom: 0,
        dailyPercentage: 0,
        healthRanking: 1
      },
      calories: {
        description: 'High empty calories from sugar',
        total: 42,
        fromCarbs: 42.4,
        fromProtein: 0,
        fromFat: 0
      },
      vitamins: [],
      minerals: ['sodium'],
      saturatedFat: 0,
      sugar: 10.6,
      sodium: 2,
      cholesterol: 0,
      vitaminC: 0,
      calcium: 2,
      iron: 0.1,
      potassium: 2
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 4,
      category: 'ultra-processed',
      descriptionKey: 'soda_processing_desc',
      indicatorsKeys: ['corn_syrup', 'artificial_colors', 'phosphoric_acid', 'added_caffeine', 'synthetic_flavors']
    },
    otherOptionsIds: ['sparkling_water', 'fruit_juice', 'herbal_tea'],
    descriptionKey: 'soda_010'
  },
  {
    id: 'instant_noodles_011',
    nameKey: 'instant_noodles_011',
    image: '/placeholder.svg',
    rating: 2.8,
    categoryKey: 'processed_foods',
    nutrition: {
      protein: {
        description: 'Moderate protein, low quality',
        total: 10.4,
        caloriesFrom: 41.6,
        dailyPercentage: 21,
        healthRanking: 4
      },
      carbs: {
        description: 'High in refined carbohydrates',
        total: 55.7,
        caloriesFrom: 222.8,
        dailyPercentage: 19,
        healthRanking: 3
      },
      fats: {
        description: 'High in unhealthy fats',
        total: 21.1,
        caloriesFrom: 189.9,
        dailyPercentage: 32,
        healthRanking: 2
      },
      fiber: {
        description: 'Low fiber content',
        total: 4.0,
        caloriesFrom: 0,
        dailyPercentage: 16,
        healthRanking: 5
      },
      calories: {
        description: 'Very high in calories',
        total: 448,
        fromCarbs: 222.8,
        fromProtein: 41.6,
        fromFat: 189.9
      },
      vitamins: ['thiamine', 'riboflavin'],
      minerals: ['sodium', 'iron'],
      saturatedFat: 9.8,
      sugar: 2.5,
      sodium: 1820,
      cholesterol: 0,
      vitaminC: 0,
      calcium: 54,
      iron: 4.3,
      potassium: 120
    },
    allergens: {
      vegan: false,
      vegetarian: false,
      glutenFree: false,
      lactoseFree: true,
      nutFree: true,
      eggFree: false,
      fishFree: true,
      soyFree: false,
      halal: false,
      kosher: false,
      organic: false,
      lowSodium: false,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 4,
      category: 'ultra-processed',
      descriptionKey: 'instant_noodles_processing_desc',
      indicatorsKeys: ['palm_oil', 'monosodium_glutamate', 'bht_preservatives', 'excess_sodium', 'pre_fried_noodles']
    },
    otherOptionsIds: ['whole_grain_pasta', 'rice_noodles', 'quinoa'],
    descriptionKey: 'instant_noodles_011'
  },
  {
    id: 'ice_cream_012',
    nameKey: 'ice_cream_012',
    image: '/placeholder.svg',
    rating: 3.5,
    categoryKey: 'desserts',
    nutrition: {
      protein: {
        description: 'Low protein content',
        total: 3.5,
        caloriesFrom: 14.0,
        dailyPercentage: 7,
        healthRanking: 5
      },
      carbs: {
        description: 'High in refined sugars',
        total: 23.6,
        caloriesFrom: 94.4,
        dailyPercentage: 8,
        healthRanking: 2
      },
      fats: {
        description: 'High in saturated fats',
        total: 11.0,
        caloriesFrom: 99.0,
        dailyPercentage: 17,
        healthRanking: 3
      },
      fiber: {
        description: 'Very low fiber',
        total: 0.7,
        caloriesFrom: 0,
        dailyPercentage: 3,
        healthRanking: 3
      },
      calories: {
        description: 'High in calories from sugar and fat',
        total: 207,
        fromCarbs: 94.4,
        fromProtein: 14.0,
        fromFat: 99.0
      },
      vitamins: ['vitamin_a', 'vitamin_b12'],
      minerals: ['calcium', 'phosphorus'],
      saturatedFat: 6.8,
      sugar: 21.2,
      sodium: 80,
      cholesterol: 45,
      vitaminC: 0.6,
      calcium: 128,
      iron: 0.2,
      potassium: 199
    },
    allergens: {
      vegan: false,
      vegetarian: true,
      glutenFree: false,
      lactoseFree: false,
      nutFree: false,
      eggFree: false,
      fishFree: true,
      soyFree: false,
      halal: false,
      kosher: false,
      organic: false,
      lowSodium: false,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 4,
      category: 'ultra-processed',
      descriptionKey: 'ice_cream_processing_desc',
      indicatorsKeys: ['emulsifiers', 'stabilizing_gums', 'artificial_colors', 'added_sugars', 'synthetic_flavors']
    },
    otherOptionsIds: ['frozen_yogurt', 'fruit_sorbet', 'homemade_ice_cream'],
    descriptionKey: 'ice_cream_012'
  },
  {
    id: 'energy_drink_013',
    nameKey: 'energy_drink_013',
    image: '/placeholder.svg',
    rating: 2.3,
    categoryKey: 'beverages',
    nutrition: {
      protein: {
        description: 'Low protein content',
        total: 0.3,
        caloriesFrom: 1.2,
        dailyPercentage: 1,
        healthRanking: 3
      },
      carbs: {
        description: 'Very high in refined sugars',
        total: 28.0,
        caloriesFrom: 112.0,
        dailyPercentage: 9,
        healthRanking: 1
      },
      fats: {
        description: 'No fats',
        total: 0,
        caloriesFrom: 0,
        dailyPercentage: 0,
        healthRanking: 10
      },
      fiber: {
        description: 'No fiber',
        total: 0,
        caloriesFrom: 0,
        dailyPercentage: 0,
        healthRanking: 1
      },
      calories: {
        description: 'High empty calories from sugar',
        total: 113,
        fromCarbs: 112.0,
        fromProtein: 1.2,
        fromFat: 0
      },
      vitamins: ['niacin', 'vitamin_b6', 'vitamin_b12'],
      minerals: ['sodium'],
      saturatedFat: 0,
      sugar: 27.0,
      sodium: 200,
      cholesterol: 0,
      vitaminC: 0,
      calcium: 5,
      iron: 0.1,
      potassium: 28
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: false,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 4,
      category: 'ultra-processed',
      descriptionKey: 'energy_drink_processing_desc',
      indicatorsKeys: ['synthetic_caffeine', 'artificial_taurine', 'blue_dyes', 'synthetic_stimulants', 'high_added_sugar']
    },
    otherOptionsIds: ['green_tea', 'coffee', 'coconut_water'],
    descriptionKey: 'energy_drink_013'
  },
  {
    id: 'cereal_014',
    nameKey: 'cereal_014',
    image: '/placeholder.svg',
    rating: 3.8,
    categoryKey: 'breakfast',
    nutrition: {
      protein: {
        description: 'Moderate protein, fortified',
        total: 7.5,
        caloriesFrom: 30.0,
        dailyPercentage: 15,
        healthRanking: 5
      },
      carbs: {
        description: 'Very high in refined sugars',
        total: 84.0,
        caloriesFrom: 336.0,
        dailyPercentage: 28,
        healthRanking: 2
      },
      fats: {
        description: 'Low in fats',
        total: 2.5,
        caloriesFrom: 22.5,
        dailyPercentage: 4,
        healthRanking: 7
      },
      fiber: {
        description: 'Low fiber content',
        total: 3.0,
        caloriesFrom: 0,
        dailyPercentage: 12,
        healthRanking: 5
      },
      calories: {
        description: 'High in calories from sugar',
        total: 389,
        fromCarbs: 336.0,
        fromProtein: 30.0,
        fromFat: 22.5
      },
      vitamins: ['vitamin_d', 'vitamin_b12', 'thiamine', 'riboflavin'],
      minerals: ['iron', 'zinc'],
      saturatedFat: 0.5,
      sugar: 37.0,
      sodium: 586,
      cholesterol: 0,
      vitaminC: 0,
      calcium: 33,
      iron: 24.3,
      potassium: 130
    },
    allergens: {
      vegan: false,
      vegetarian: true,
      glutenFree: false,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: false,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: false,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 4,
      category: 'ultra-processed',
      descriptionKey: 'cereal_processing_desc',
      indicatorsKeys: ['industrial_extrusion', 'added_sugars', 'fdc_dyes', 'synthetic_vitamins', 'bht_preservative']
    },
    otherOptionsIds: ['oatmeal', 'muesli', 'granola'],
    descriptionKey: 'cereal_014'
  },
  {
    id: 'popcorn_016',
    nameKey: 'popcorn_016',
    image: '/placeholder.svg',
    rating: 7.2,
    categoryKey: 'snacks',
    nutrition: {
      protein: {
        description: 'Moderate protein content',
        total: 3.3,
        caloriesFrom: 13.2,
        dailyPercentage: 7,
        healthRanking: 6
      },
      carbs: {
        description: 'High in carbohydrates',
        total: 22.0,
        caloriesFrom: 88.0,
        dailyPercentage: 7,
        healthRanking: 6
      },
      fats: {
        description: 'Low in fats',
        total: 1.2,
        caloriesFrom: 10.8,
        dailyPercentage: 2,
        healthRanking: 8
      },
      fiber: {
        description: 'Good source of fiber',
        total: 3.5,
        caloriesFrom: 0,
        dailyPercentage: 14,
        healthRanking: 8
      },
      calories: {
        description: 'Moderate calories',
        total: 106,
        fromCarbs: 88.0,
        fromProtein: 13.2,
        fromFat: 10.8
      },
      vitamins: ['vitamin_b6', 'thiamine'],
      minerals: ['magnesium', 'phosphorus'],
      saturatedFat: 0.2,
      sugar: 0.9,
      sodium: 8,
      cholesterol: 0,
      vitaminC: 0,
      calcium: 1,
      iron: 0.9,
      potassium: 93
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'popcorn_processing_desc',
      indicatorsKeys: ['whole_grain', 'air_popped', 'no_additives']
    },
    otherOptionsIds: ['almonds_004', 'chia_seeds_008'],
    descriptionKey: 'popcorn_016'
  },
  {
    id: 'lulo_017',
    nameKey: 'lulo_017',
    image: '/placeholder.svg',
    rating: 8.7,
    categoryKey: 'fruits',
    nutrition: {
      protein: {
        description: 'Low protein content',
        total: 0.8,
        caloriesFrom: 3.2,
        dailyPercentage: 2,
        healthRanking: 4
      },
      carbs: {
        description: 'Natural fruit carbohydrates',
        total: 5.9,
        caloriesFrom: 23.6,
        dailyPercentage: 2,
        healthRanking: 8
      },
      fats: {
        description: 'Very low in fats',
        total: 0.1,
        caloriesFrom: 0.9,
        dailyPercentage: 0,
        healthRanking: 10
      },
      fiber: {
        description: 'Good source of fiber',
        total: 3.1,
        caloriesFrom: 0,
        dailyPercentage: 12,
        healthRanking: 8
      },
      calories: {
        description: 'Very low in calories',
        total: 25,
        fromCarbs: 23.6,
        fromProtein: 3.2,
        fromFat: 0.9
      },
      vitamins: ['vitamin_c', 'vitamin_a', 'vitamin_b3'],
      minerals: ['potassium', 'phosphorus', 'calcium'],
      saturatedFat: 0.0,
      sugar: 3.2,
      sodium: 4,
      cholesterol: 0,
      vitaminC: 25.7,
      calcium: 8,
      iron: 0.4,
      potassium: 249
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'lulo_processing_desc',
      indicatorsKeys: ['tropical_fruit', 'rich_vitamin_c', 'natural']
    },
    otherOptionsIds: ['orange_009', 'pear_008', 'apple_002'],
    descriptionKey: 'lulo_017'
  },
  {
    id: 'corn_018',
    nameKey: 'corn_018',
    image: '/placeholder.svg',
    rating: 7.8,
    categoryKey: 'grains',
    nutrition: {
      protein: {
        description: 'Good protein content',
        total: 3.4,
        caloriesFrom: 13.6,
        dailyPercentage: 7,
        healthRanking: 7
      },
      carbs: {
        description: 'High in natural carbohydrates',
        total: 25.0,
        caloriesFrom: 100.0,
        dailyPercentage: 8,
        healthRanking: 7
      },
      fats: {
        description: 'Low in fats',
        total: 1.4,
        caloriesFrom: 12.6,
        dailyPercentage: 2,
        healthRanking: 8
      },
      fiber: {
        description: 'Good source of fiber',
        total: 2.9,
        caloriesFrom: 0,
        dailyPercentage: 12,
        healthRanking: 8
      },
      calories: {
        description: 'Moderate calories',
        total: 125,
        fromCarbs: 100.0,
        fromProtein: 13.6,
        fromFat: 12.6
      },
      vitamins: ['vitamin_c', 'thiamine', 'folate'],
      minerals: ['magnesium', 'potassium', 'phosphorus'],
      saturatedFat: 0.2,
      sugar: 3.2,
      sodium: 16,
      cholesterol: 0,
      vitaminC: 7.0,
      calcium: 2,
      iron: 0.5,
      potassium: 270
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'corn_processing_desc',
      indicatorsKeys: ['whole_grain', 'natural', 'fresh']
    },
    otherOptionsIds: ['quinoa_002', 'sweet_potato_006'],
    descriptionKey: 'corn_018'
  },
  {
    id: 'mango_019',
    nameKey: 'mango_019',
    image: '/placeholder.svg',
    rating: 8.9,
    categoryKey: 'fruits',
    nutrition: {
      protein: {
        description: 'Low protein content',
        total: 0.8,
        caloriesFrom: 3.2,
        dailyPercentage: 2,
        healthRanking: 4
      },
      carbs: {
        description: 'Natural fruit sugars',
        total: 17.0,
        caloriesFrom: 68.0,
        dailyPercentage: 6,
        healthRanking: 7
      },
      fats: {
        description: 'Very low in fats',
        total: 0.4,
        caloriesFrom: 3.6,
        dailyPercentage: 1,
        healthRanking: 10
      },
      fiber: {
        description: 'Good source of fiber',
        total: 1.6,
        caloriesFrom: 0,
        dailyPercentage: 6,
        healthRanking: 7
      },
      calories: {
        description: 'Moderate calories from natural sugars',
        total: 70,
        fromCarbs: 68.0,
        fromProtein: 3.2,
        fromFat: 3.6
      },
      vitamins: ['vitamin_c', 'vitamin_a', 'folate'],
      minerals: ['potassium', 'magnesium'],
      saturatedFat: 0.1,
      sugar: 15.0,
      sodium: 1,
      cholesterol: 0,
      vitaminC: 36.4,
      calcium: 11,
      iron: 0.2,
      potassium: 168
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'mango_processing_desc',
      indicatorsKeys: ['tropical_fruit', 'rich_vitamin_a', 'natural_sweetness']
    },
    otherOptionsIds: ['orange_009', 'banana_010', 'pear_008'],
    descriptionKey: 'mango_019'
  },
  {
    id: 'beans_020',
    nameKey: 'beans_020',
    image: '/placeholder.svg',
    rating: 9.1,
    categoryKey: 'proteins',
    nutrition: {
      protein: {
        description: 'Excellent source of plant protein',
        total: 8.9,
        caloriesFrom: 35.6,
        dailyPercentage: 18,
        healthRanking: 9
      },
      carbs: {
        description: 'Complex carbohydrates',
        total: 23.0,
        caloriesFrom: 92.0,
        dailyPercentage: 8,
        healthRanking: 8
      },
      fats: {
        description: 'Very low in fats',
        total: 0.9,
        caloriesFrom: 8.1,
        dailyPercentage: 1,
        healthRanking: 9
      },
      fiber: {
        description: 'Excellent source of fiber',
        total: 8.7,
        caloriesFrom: 0,
        dailyPercentage: 35,
        healthRanking: 10
      },
      calories: {
        description: 'Moderate calories with high nutrition',
        total: 132,
        fromCarbs: 92.0,
        fromProtein: 35.6,
        fromFat: 8.1
      },
      vitamins: ['folate', 'thiamine', 'vitamin_b6'],
      minerals: ['iron', 'magnesium', 'potassium'],
      saturatedFat: 0.2,
      sugar: 0.3,
      sodium: 2,
      cholesterol: 0,
      vitaminC: 0,
      calcium: 27,
      iron: 2.9,
      potassium: 355
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: true,
      keto: false
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'beans_processing_desc',
      indicatorsKeys: ['plant_protein', 'high_fiber', 'complex_carbs']
    },
    otherOptionsIds: ['quinoa_002', 'salmon_003', 'almonds_004'],
    descriptionKey: 'beans_020'
  },
  {
    id: 'tomato_021',
    nameKey: 'tomato_021',
    image: '/placeholder.svg',
    rating: 8.5,
    categoryKey: 'vegetables',
    nutrition: {
      protein: {
        description: 'Low protein content',
        total: 0.9,
        caloriesFrom: 3.6,
        dailyPercentage: 2,
        healthRanking: 5
      },
      carbs: {
        description: 'Low in carbohydrates',
        total: 3.9,
        caloriesFrom: 15.6,
        dailyPercentage: 1,
        healthRanking: 9
      },
      fats: {
        description: 'Very low in fats',
        total: 0.2,
        caloriesFrom: 1.8,
        dailyPercentage: 0,
        healthRanking: 10
      },
      fiber: {
        description: 'Good source of fiber',
        total: 1.2,
        caloriesFrom: 0,
        dailyPercentage: 5,
        healthRanking: 7
      },
      calories: {
        description: 'Very low in calories',
        total: 18,
        fromCarbs: 15.6,
        fromProtein: 3.6,
        fromFat: 1.8
      },
      vitamins: ['vitamin_c', 'vitamin_k', 'folate'],
      minerals: ['potassium', 'manganese'],
      saturatedFat: 0.0,
      sugar: 2.6,
      sodium: 5,
      cholesterol: 0,
      vitaminC: 13.7,
      calcium: 10,
      iron: 0.3,
      potassium: 237
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: true
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'tomato_processing_desc',
      indicatorsKeys: ['rich_lycopene', 'fresh', 'antioxidants']
    },
    otherOptionsIds: ['carrot_004', 'spinach_003', 'broccoli_001'],
    descriptionKey: 'tomato_021'
  },
  {
    id: 'papaya_022',
    nameKey: 'papaya_022',
    image: '/placeholder.svg',
    rating: 8.6,
    categoryKey: 'fruits',
    nutrition: {
      protein: {
        description: 'Low protein content',
        total: 0.5,
        caloriesFrom: 2.0,
        dailyPercentage: 1,
        healthRanking: 4
      },
      carbs: {
        description: 'Natural fruit carbohydrates',
        total: 11.0,
        caloriesFrom: 44.0,
        dailyPercentage: 4,
        healthRanking: 8
      },
      fats: {
        description: 'Very low in fats',
        total: 0.3,
        caloriesFrom: 2.7,
        dailyPercentage: 0,
        healthRanking: 10
      },
      fiber: {
        description: 'Good source of fiber',
        total: 1.7,
        caloriesFrom: 0,
        dailyPercentage: 7,
        healthRanking: 7
      },
      calories: {
        description: 'Low in calories',
        total: 43,
        fromCarbs: 44.0,
        fromProtein: 2.0,
        fromFat: 2.7
      },
      vitamins: ['vitamin_c', 'vitamin_a', 'folate'],
      minerals: ['potassium', 'magnesium'],
      saturatedFat: 0.1,
      sugar: 7.8,
      sodium: 8,
      cholesterol: 0,
      vitaminC: 60.9,
      calcium: 20,
      iron: 0.2,
      potassium: 182
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'papaya_processing_desc',
      indicatorsKeys: ['digestive_enzymes', 'tropical_fruit', 'rich_vitamin_c']
    },
    otherOptionsIds: ['mango_019', 'orange_009', 'pear_008'],
    descriptionKey: 'papaya_022'
  },
  {
    id: 'plantain_023',
    nameKey: 'plantain_023',
    image: '/placeholder.svg',
    rating: 7.9,
    categoryKey: 'fruits',
    nutrition: {
      protein: {
        description: 'Low protein content',
        total: 1.3,
        caloriesFrom: 5.2,
        dailyPercentage: 3,
        healthRanking: 5
      },
      carbs: {
        description: 'High in complex carbohydrates',
        total: 31.9,
        caloriesFrom: 127.6,
        dailyPercentage: 11,
        healthRanking: 7
      },
      fats: {
        description: 'Very low in fats',
        total: 0.4,
        caloriesFrom: 3.6,
        dailyPercentage: 1,
        healthRanking: 9
      },
      fiber: {
        description: 'Good source of fiber',
        total: 2.3,
        caloriesFrom: 0,
        dailyPercentage: 9,
        healthRanking: 8
      },
      calories: {
        description: 'Moderate calories from complex carbs',
        total: 122,
        fromCarbs: 127.6,
        fromProtein: 5.2,
        fromFat: 3.6
      },
      vitamins: ['vitamin_c', 'vitamin_a', 'vitamin_b6'],
      minerals: ['potassium', 'magnesium'],
      saturatedFat: 0.1,
      sugar: 15.0,
      sodium: 4,
      cholesterol: 0,
      vitaminC: 18.4,
      calcium: 3,
      iron: 0.6,
      potassium: 499
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'plantain_processing_desc',
      indicatorsKeys: ['rich_potassium', 'complex_carbs', 'natural']
    },
    otherOptionsIds: ['banana_010', 'sweet_potato_006', 'corn_018'],
    descriptionKey: 'plantain_023'
  },
  {
    id: 'cacao_024',
    nameKey: 'cacao_024',
    image: '/placeholder.svg',
    rating: 8.8,
    categoryKey: 'snacks',
    nutrition: {
      protein: {
        description: 'Good source of protein',
        total: 4.0,
        caloriesFrom: 16.0,
        dailyPercentage: 8,
        healthRanking: 7
      },
      carbs: {
        description: 'Moderate carbohydrates',
        total: 16.0,
        caloriesFrom: 64.0,
        dailyPercentage: 5,
        healthRanking: 7
      },
      fats: {
        description: 'High in healthy fats',
        total: 12.0,
        caloriesFrom: 108.0,
        dailyPercentage: 18,
        healthRanking: 7
      },
      fiber: {
        description: 'Excellent source of fiber',
        total: 9.0,
        caloriesFrom: 0,
        dailyPercentage: 36,
        healthRanking: 10
      },
      calories: {
        description: 'High in calories but nutrient dense',
        total: 228,
        fromCarbs: 64.0,
        fromProtein: 16.0,
        fromFat: 108.0
      },
      vitamins: ['vitamin_e', 'vitamin_k'],
      minerals: ['magnesium', 'iron', 'zinc'],
      saturatedFat: 7.3,
      sugar: 1.8,
      sodium: 21,
      cholesterol: 0,
      vitaminC: 0,
      calcium: 128,
      iron: 3.9,
      potassium: 1524
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: false,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: true,
      keto: true
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'cacao_processing_desc',
      indicatorsKeys: ['superfood', 'rich_antioxidants', 'raw']
    },
    otherOptionsIds: ['almonds_004', 'chia_seeds_008', 'blueberries_005'],
    descriptionKey: 'cacao_024'
  },
  {
    id: 'pineapple_025',
    nameKey: 'pineapple_025',
    image: '/placeholder.svg',
    rating: 8.4,
    categoryKey: 'fruits',
    nutrition: {
      protein: {
        description: 'Low protein content',
        total: 0.5,
        caloriesFrom: 2.0,
        dailyPercentage: 1,
        healthRanking: 4
      },
      carbs: {
        description: 'Natural fruit sugars',
        total: 13.1,
        caloriesFrom: 52.4,
        dailyPercentage: 4,
        healthRanking: 7
      },
      fats: {
        description: 'Very low in fats',
        total: 0.1,
        caloriesFrom: 0.9,
        dailyPercentage: 0,
        healthRanking: 10
      },
      fiber: {
        description: 'Good source of fiber',
        total: 1.4,
        caloriesFrom: 0,
        dailyPercentage: 6,
        healthRanking: 7
      },
      calories: {
        description: 'Low in calories',
        total: 50,
        fromCarbs: 52.4,
        fromProtein: 2.0,
        fromFat: 0.9
      },
      vitamins: ['vitamin_c', 'vitamin_b6', 'thiamine'],
      minerals: ['manganese', 'potassium'],
      saturatedFat: 0.0,
      sugar: 9.9,
      sodium: 1,
      cholesterol: 0,
      vitaminC: 47.8,
      calcium: 13,
      iron: 0.3,
      potassium: 109
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'pineapple_processing_desc',
      indicatorsKeys: ['bromelain_enzyme', 'tropical_fruit', 'rich_vitamin_c']
    },
    otherOptionsIds: ['mango_019', 'papaya_022', 'orange_009'],
    descriptionKey: 'pineapple_025'
  },
  {
    id: 'yuca_026',
    nameKey: 'yuca_026',
    image: '/placeholder.svg',
    rating: 7.1,
    categoryKey: 'vegetables',
    nutrition: {
      protein: {
        description: 'Low protein content',
        total: 1.4,
        caloriesFrom: 5.6,
        dailyPercentage: 3,
        healthRanking: 5
      },
      carbs: {
        description: 'High in starchy carbohydrates',
        total: 38.1,
        caloriesFrom: 152.4,
        dailyPercentage: 13,
        healthRanking: 6
      },
      fats: {
        description: 'Very low in fats',
        total: 0.3,
        caloriesFrom: 2.7,
        dailyPercentage: 0,
        healthRanking: 9
      },
      fiber: {
        description: 'Good source of fiber',
        total: 1.8,
        caloriesFrom: 0,
        dailyPercentage: 7,
        healthRanking: 7
      },
      calories: {
        description: 'High in calories from starch',
        total: 160,
        fromCarbs: 152.4,
        fromProtein: 5.6,
        fromFat: 2.7
      },
      vitamins: ['vitamin_c', 'folate'],
      minerals: ['potassium', 'magnesium'],
      saturatedFat: 0.1,
      sugar: 1.7,
      sodium: 14,
      cholesterol: 0,
      vitaminC: 20.6,
      calcium: 16,
      iron: 0.3,
      potassium: 271
    },
    allergens: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      lactoseFree: true,
      nutFree: true,
      eggFree: true,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: true,
      sugarFree: true,
      keto: false
    },
    processingLevel: {
      nova: 1,
      category: 'minimal',
      descriptionKey: 'yuca_processing_desc',
      indicatorsKeys: ['starchy_root', 'energy_source', 'gluten_free']
    },
    otherOptionsIds: ['sweet_potato_006', 'plantain_023', 'corn_018'],
    descriptionKey: 'yuca_026'
  },
  {
    id: 'cookies_015',
    nameKey: 'cookies_015',
    image: '/placeholder.svg',
    rating: 2.9,
    categoryKey: 'snacks',
    nutrition: {
      protein: {
        description: 'Low protein content',
        total: 4.7,
        caloriesFrom: 18.8,
        dailyPercentage: 9,
        healthRanking: 4
      },
      carbs: {
        description: 'Very high in refined sugars',
        total: 71.0,
        caloriesFrom: 284.0,
        dailyPercentage: 24,
        healthRanking: 1
      },
      fats: {
        description: 'High in saturated fat',
        total: 18.0,
        caloriesFrom: 162.0,
        dailyPercentage: 28,
        healthRanking: 2
      },
      fiber: {
        description: 'Low fiber content',
        total: 2.1,
        caloriesFrom: 0,
        dailyPercentage: 8,
        healthRanking: 3
      },
      calories: {
        description: 'High calorie density',
        total: 465,
        fromCarbs: 284,
        fromProtein: 19,
        fromFat: 162
      },
      vitamins: ['vitamin_e', 'vitamin_b1', 'vitamin_b2'],
      minerals: ['iron', 'magnesium', 'zinc'],
      saturatedFat: 7.0,
      sugar: 36.0,
      sodium: 375,
      cholesterol: 0,
      vitaminC: 0,
      calcium: 25,
      iron: 2.1,
      potassium: 90
    },
    allergens: {
      vegan: false,
      vegetarian: true,
      glutenFree: false,
      lactoseFree: false,
      nutFree: false,
      eggFree: false,
      fishFree: true,
      soyFree: true,
      halal: true,
      kosher: true,
      organic: false,
      lowSodium: false,
      sugarFree: false,
      keto: false
    },
    processingLevel: {
      nova: 4,
      category: 'ultra-processed',
      descriptionKey: 'cookies_processing_desc',
      indicatorsKeys: ['refined_sugars', 'artificial_additives', 'preservatives']
    },
    otherOptionsIds: ['crackers_016', 'biscuits_017', 'wafers_018'],
    descriptionKey: 'cookies_015'
  }
];
