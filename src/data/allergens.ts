
import { 
  Leaf, 
  Wheat, 
  Milk, 
  Nut, 
  Fish, 
  Egg, 
  Shield, 
  Award, 
  Heart, 
  Droplets,
  Zap,
  Sparkles
} from 'lucide-react';

export interface AllergenConfig {
  id: string;
  name: string;
  icon: any;
  colors: {
    bg: string;
    iconBg: string;
    iconColor: string;
  };
  translationKey: string;
  category: 'dietary' | 'allergen' | 'certification' | 'health';
  priority: number; // Added priority for relevance
}

export const ALLERGENS_CONFIG: AllergenConfig[] = [
  // Most common allergens (high priority)
  {
    id: 'glutenFree',
    name: 'Gluten',
    icon: Wheat,
    colors: {
      bg: 'bg-orange-50',
      iconBg: 'bg-orange-500',
      iconColor: 'text-white'
    },
    translationKey: 'gluten',
    category: 'allergen',
    priority: 1
  },
  {
    id: 'lactoseFree',
    name: 'Lactosa',
    icon: Milk,
    colors: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-500',
      iconColor: 'text-white'
    },
    translationKey: 'lactose',
    category: 'allergen',
    priority: 2
  },
  {
    id: 'nutFree',
    name: 'Frutos Secos',
    icon: Nut,
    colors: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-500',
      iconColor: 'text-white'
    },
    translationKey: 'nuts',
    category: 'allergen',
    priority: 3
  },
  {
    id: 'eggFree',
    name: 'Huevo',
    icon: Egg,
    colors: {
      bg: 'bg-yellow-50',
      iconBg: 'bg-yellow-500',
      iconColor: 'text-white'
    },
    translationKey: 'egg',
    category: 'allergen',
    priority: 4
  },
  {
    id: 'fishFree',
    name: 'Pescado',
    icon: Fish,
    colors: {
      bg: 'bg-cyan-50',
      iconBg: 'bg-cyan-500',
      iconColor: 'text-white'
    },
    translationKey: 'fish',
    category: 'allergen',
    priority: 5
  },
  {
    id: 'soyFree',
    name: 'Soja',
    icon: Leaf,
    colors: {
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-500',
      iconColor: 'text-white'
    },
    translationKey: 'soy',
    category: 'allergen',
    priority: 6
  },

  // Dietary preferences (medium priority)
  {
    id: 'vegan',
    name: 'No Vegano',
    icon: Leaf,
    colors: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-500',
      iconColor: 'text-white'
    },
    translationKey: 'nonVegan',
    category: 'dietary',
    priority: 7
  },
  {
    id: 'vegetarian',
    name: 'No Vegetariano',
    icon: Leaf,
    colors: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-500',
      iconColor: 'text-white'
    },
    translationKey: 'nonVegetarian',
    category: 'dietary',
    priority: 8
  }
];

export const getAllergenConfig = (id: string): AllergenConfig | undefined => {
  return ALLERGENS_CONFIG.find(allergen => allergen.id === id);
};

export const getAllergensByCategory = (category: AllergenConfig['category']): AllergenConfig[] => {
  return ALLERGENS_CONFIG.filter(allergen => allergen.category === category);
};

export const getPriorityAllergens = (): AllergenConfig[] => {
  return ALLERGENS_CONFIG.sort((a, b) => a.priority - b.priority);
};
