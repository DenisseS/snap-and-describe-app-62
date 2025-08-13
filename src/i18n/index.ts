import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import dropboxTranslations from './translations-dropbox';
import { legalTranslations } from './legal';
import { blogTranslations } from './blog';

const resources = {
  en: {
    translation: {
      scan: 'Scan',
      scanFood: 'Scan Food',
      takePhoto: 'Take Photo',
      analyzing: 'Analyzing...',
      excellentOption: 'Excellent option',
      goodOption: 'Good option',
      acceptableOption: 'Acceptable option',
      consumeModerately: 'Consume moderately',
      processingLevel: 'Processing Level',
      indicators: 'Indicators',
      nutriInfo: 'Nutri info',
      allergens: 'Allergens',
      otherOptions: 'Other options',
      protein: 'Protein',
      excellentProteinSource: 'Excellent source of protein',
      fats: 'Fats',
      highSaturatedFats: 'High in saturated fats but from natural origin. Consume in small quantities.',
      fiber: 'Fiber',
      goodFiberSource: 'Good source of Fiber',
      seeMore: 'See more',
      retake: 'Retake',
      back: 'Back',
      noAllergens: 'No common allergens detected',
      containsAllergens: 'May contain allergens',
      home: 'Home',
      recipes: 'Recipes',
      favorites: 'Favorites',
      more: 'More',
      navigation: {
        home: 'Home',
        explore: 'Explore',
        favorites: 'Favorites',
        recipes: 'Recipes',
        blog: 'Blog',
        camera: 'Camera',
      },
      loading: 'Loading...',
      noFavoritesYet: 'No favorites yet',
      startScanningToAddFavorites: 'Start scanning foods to add them to your favorites',
      exploreProducts: 'Explore Products',
      browseHealthyOptions: 'Browse and discover healthy food options and alternatives',
      explore: 'Explore',
      takePhotoInstant: 'Take a photo of your food and get instant nutritional analysis',
      scanAnalyzeExplore: 'Scan, analyze and explore healthy foods',
      pageNotFound: 'Page Not Found',
      pageNotFoundMessage: 'Oops! Page not found',
      returnToHome: 'Return to Home',
      processingImage: 'Processing image and getting nutritional information...',
      scanInstructions: 'Center the food in the frame and take a photo to get nutritional information',
      emptyRecipeBook: 'Your book is empty',
      addRecipesToCollection: 'Add your own recipes and create your personalized collection',
      all: 'All',
      vitaminsAndMinerals: 'Vitamins & Minerals',
      vitaminsLabel: 'Vitamins:',
      mineralsLabel: 'Minerals:',
      sodium: 'Sodium',
      cholesterol: 'Cholesterol',
      calories: 'Calories',
      totalCalories: 'Total Calories',
      fromCarbs: 'From Carbs',
      fromProtein: 'From Protein',
      fromFat: 'From Fat',
      carbohydrates: 'Carbohydrates',
      saturatedFat: 'Saturated Fat',
      sugars: 'Sugars',
      searchYourFavorites: 'Search your favorites...',
      searchFoodProducts: 'Search food products...',
      noSimilarProductsAvailable: 'No similar products available',
      thisProductNotContainAllergens: 'This product does not contain common allergens',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      dailyValue: '% Daily Value*',
      dailyValueNote: '*Percent Daily Values are based on a 2,000 calorie diet.',
      total: 'Total',
      caloriesFrom: 'Calories from',
      showingItems: 'Showing {{from}}–{{to}} of {{total}} products',
      noResults: 'No products found',
      allergensToAvoid: "I prefer to avoid:",
      noAllergensSelected: "No allergens selected",
      quickActions: 'Quick Actions',
      weeklyList: "Weekly List",
      weeklyListDescription: "Organize your purchases with ingredients that make you feel good and adapt to your lifestyle.",
      recipesDescription: "Cook with what nourishes you and makes you feel good. Recipes made for your rhythm and your taste.",
      category: 'Category',
      rating: 'Rating',
      // Greetings - regresados de dropbox
      goodMorning: "Good morning",
      goodAfternoon: "Good afternoon", 
      goodEvening: "Good evening",
      welcomeBack: "Welcome back",
      // Auth callback translations
      connectingWithDropbox: "Connecting with Dropbox...",
      pleaseWaitProcessing: "Please wait while we process your authentication.",
      connectionSuccessful: "Connection successful!",
      finalizingLogin: "Finalizing login...",
      updatePersonalInfo: "Update your personal information",
      redirect: "Redirect",
      redirectToHome: "We'll redirect you to the home page.",
      // Product detail translations
      productDetails: "Product Details",
      productNotFound: "Product not found",
      productNotFoundMessage: "The product you're looking for doesn't exist or has been removed.",
      goHome: "Go Home",
      // Shopping List Detail translations
      tapToStart: "Type here to start",
      searchProducts: "Type here to search products or create items...",
      noItemsYet: "Your list is empty",
      save: "Save",
      cancel: "Cancel",
      saving: "Saving...",
      forceRefresh: "Force refresh",
      refreshing: "Refreshing...",
      // Shopping Lists page translations
      createList: "Create List",
      createNewList: "Create New List",
      create: "Create",
      creating: "Creating...",
      listName: "List Name",
      enterListName: "Enter list name",
      description: "Description",
      optional: "optional",
      enterListDescription: "List description",
      noListsYet: "You don't have any lists yet",
      createFirstList: "Create your first shopping list",
      items: "items",
      completed: "completed",
      deleteList: "Delete List",
      deleteListConfirmation: "Are you sure you want to delete this shopping list? This action cannot be undone.",
      delete: "Delete",
      // Auth page translations
      authenticationError: "Authentication Error",
      authenticationErrorOccurred: "An error occurred during authentication",
      ...dropboxTranslations.en,
      ...legalTranslations.en,
      installInstructions: 'How to Install NutriScan',
      iosInstallText: '📤 Tap the Share button\n\n⬇️ Scroll down and tap "Add to Home Screen"\n\n✅ Tap "Add" to install NutriScan on your home screen',
      // Missing translations found in components
      connectForPersonalized: 'Connect for personalized experience',
      savingYourData: 'Saving your data...',
      allergensAutoSave: 'Changes saved automatically',
      decentralizedApp: 'Decentralized App',
      decentralizedAppDescription: 'Your data stays with you, not on our servers',
      yourDataYourControl: 'Your Data, Your Control',
      yourDataYourControlDescription: 'Complete ownership of your nutrition data',
      securePrivate: 'Secure & Private',
      noDataSharing: 'We never share your personal data',
      moreOptions: 'More Options',
      loggedInAs: 'Logged in as',
      editProfile: 'Edit Profile',
      tools: 'Tools',
      installApp: 'Install App',
      information: 'Information',
      helpSupport: 'Help & Support',
      aboutUs: 'About Us',
      contactUs: 'Contact Us',
      howItWorks: 'How It Works',
      appFeatures: 'App Features',
      userGuide: 'User Guide',
      nutritionDisclaimer: 'Nutrition Disclaimer',
      loggingOut: 'Logging out...',
      connecting: 'Connecting...',
      messageSent: 'Message Sent',
      messageSentDescription: 'Thank you for your message. We will get back to you soon.',
      errorSendingMessage: 'Error sending message',
      getInTouchText: 'We would love to hear from you. Send us a message and we will respond as soon as possible.',
      sendMessage: 'Send Message',
      sending: 'Sending...',
      cookieConsent: 'Cookie Consent',
      cookieConsentDescription: 'We use cookies to improve your experience.',
      acceptCookies: 'Accept Cookies',
      cookiePreferences: 'Cookie Preferences',
      cookieSettings: 'Cookie Settings',
      cookieUsage: 'Cookie Usage',
      cookieUsageDescription: 'Here are cookies used on our website. You can select individual category to enable or disable our use of cookies. Please do keep in mind that, blocking some types of cookies may negatively impact your experience of the web site.',
      acceptAll: 'Accept all',
      rejectAll: 'Reject all',
      saveSettings: 'Save settings',
      moreInformation: 'More Information',
      moreInformationDescription: 'For more information about our privacy policy and use of cookies, please do contact us.',
      cookieTable: {
        name: 'Name',
        domain: 'Domain',
        expiration: 'Expiration',
        path: 'Path',
        description: 'Description'
      },
      cookies: {
        necessary: {
          name: 'Necessary cookies',
          description: 'These cookies are essential for the website to function properly and cannot be disabled.'
        },
        functional: {
          name: 'Functional cookies',
          description: 'These cookies enable enhanced functionality and personalization, such as language preferences and user settings.'
        },
        analytics: {
          name: 'Analytics cookies',
          description: 'These cookies help us understand how visitors interact with our website by collecting and reporting anonymous information.'
        },
        marketing: {
          name: 'Marketing cookies',
          description: 'These cookies are used to track visitors across websites to display relevant and personalized ads.'
        }
      },
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      // Legal pages translations
      ourMission: 'Our Mission',
      ourMissionText: 'To democratize access to nutritional information and help people make informed food choices.',
      ourTeam: 'Our Team',
      ourTeamText: 'We are a passionate team of developers, nutritionists, and health enthusiasts.',
      ourValues: 'Our Values',
      ourValuesText: 'Transparency, privacy, and empowerment through knowledge.',
      contactUsText: 'Get in touch with us for any questions or feedback.',
      getInTouch: 'Get in Touch',
      directContact: 'Direct Contact',
      directContactText: 'You can reach us directly through the contact form or email.',
      foodSafetyTitle: 'Food Safety',
      foodSafetyContent: 'Learn about food safety practices and guidelines.',
      featuresTitle: 'Features',
      featuresContent: 'Discover all the amazing features of our app.',
      userGuideTitle: 'User Guide',
      userGuideContent: 'Complete guide on how to use the application.',
      recipeGuideTitle: 'Recipe Guide',
      recipeGuideContent: 'Learn how to create and manage your recipes.',
      nutritionDisclaimerTitle: 'Nutrition Disclaimer',
      nutritionDisclaimerContent: 'Important information about nutritional data and recommendations.',
    },
    blog: blogTranslations.en.blog,
    legal: legalTranslations.en,
    database: {
      categories: {
        vegetables: 'Vegetables',
        fruits: 'Fruits',
        grains: 'Grains',
        proteins: 'Proteins',
        nuts: 'Nuts',
        seeds: 'Seeds',
        dairy: 'Dairy',
        snacks: 'Snacks',
        beverages: 'Beverages',
        processed_foods: 'Processed Foods',
        desserts: 'Desserts',
        breakfast: 'Breakfast'
      },
      vitamins: {
        'Vitamin A': 'Vitamin A',
        'Vitamin B6': 'Vitamin B6',
        'Vitamin B12': 'Vitamin B12',
        'Vitamin C': 'Vitamin C',
        'Vitamin D': 'Vitamin D',
        'Vitamin E': 'Vitamin E',
        'Vitamin K': 'Vitamin K',
        'Folate': 'Folate',
        'Thiamine': 'Thiamine',
        'Riboflavin': 'Riboflavin',
        'Niacin': 'Niacin',
        'Folic Acid': 'Folic Acid'
      },
      minerals: {
        'Calcium': 'Calcium',
        'Iron': 'Iron',
        'Magnesium': 'Magnesium',
        'Phosphorus': 'Phosphorus',
        'Potassium': 'Potassium',
        'Sodium': 'Sodium',
        'Zinc': 'Zinc',
        'Selenium': 'Selenium',
        'Manganese': 'Manganese',
        'Copper': 'Copper'
      },
      processing: {
        minimal: 'Unprocessed or minimally processed foods',
        processed: 'Processed culinary ingredients',
        'ultra-processed': 'Ultra-processed food products',
        broccoli_processing_desc: 'Fresh unprocessed food. Raw or cooked vegetable without additives.',
        apple_processing_desc: 'Fresh fruit without processing. Natural food in its original state.',
        spinach_processing_desc: 'Fresh leafy green vegetable, without processing or additives.',
        carrot_processing_desc: 'Fresh root vegetable in its natural state, rich in beta-carotenes.',
        kale_processing_desc: 'Natural green superfood without industrial processing.',
        cauliflower_processing_desc: 'Fresh cruciferous vegetable, versatile and low in calories.',
        brussels_processing_desc: 'Fresh mini cabbages in their natural state, rich in nutrients.',
        pear_processing_desc: 'Sweet and juicy fresh fruit, high in fiber.',
        orange_processing_desc: 'Fresh citrus fruit, excellent source of vitamin C.',
        banana_processing_desc: 'Tropical fruit rich in potassium and natural sugars.',
        avocado_processing_desc: 'Creamy fruit rich in healthy monounsaturated fats.',
        quinoa_processing_desc: 'Grain processed through cooking and cleaning, maintains its nutritional properties.',
        salmon_processing_desc: 'Fresh or frozen fish, rich in omega-3 fatty acids.',
        almonds_processing_desc: 'Natural tree nuts, rich in healthy fats and vitamin E.',
        blueberries_processing_desc: 'Fresh forest berries, rich in antioxidants and brain superfood.',
        sweet_potato_processing_desc: 'Fresh orange tuber, rich in beta-carotenes and fiber.',
        greek_yogurt_processing_desc: 'Fermented and strained dairy with beneficial probiotic cultures.',
        chia_seeds_processing_desc: 'Natural tiny seeds, rich in omega-3 and fiber.',
        chips_processing_desc: 'Highly processed product with refined oils, added salt and industrial additives to enhance flavor and texture.',
        // Nuevas descripciones de procesamiento
        popcorn_processing_desc: 'Air-popped corn kernels without added oils or excessive salt.',
        lulo_processing_desc: 'Fresh tropical fruit, rich in vitamin C and antioxidants.',
        corn_processing_desc: 'Fresh or cooked corn kernels, natural grain source.',
        mango_processing_desc: 'Fresh tropical fruit, excellent source of vitamins A and C.',
        beans_processing_desc: 'Cooked legumes, excellent source of plant protein and fiber.',
        tomato_processing_desc: 'Fresh vegetable fruit, rich in lycopene and vitamin C.',
        papaya_processing_desc: 'Fresh tropical fruit, excellent source of vitamin C and digestive enzymes.',
        plantain_processing_desc: 'Cooked or raw plantain, rich in potassium and complex carbohydrates.',
        cacao_processing_desc: 'Raw cacao beans, superfood rich in antioxidants and magnesium.',
        pineapple_processing_desc: 'Fresh tropical fruit, rich in bromelain enzyme and vitamin C.',
        yuca_processing_desc: 'Fresh root vegetable, cooked cassava rich in starch and energy.',
        soda_processing_desc: 'Ultra-processed beverage with high fructose corn syrup, artificial colors, preservatives and chemical additives.',
        instant_noodles_processing_desc: 'Pre-cooked and fried noodles with seasoning packet full of monosodium glutamate, preservatives and artificial flavorings.',
        ice_cream_processing_desc: 'Ultra-processed frozen dessert with emulsifiers, stabilizers, artificial colors and flavorings.',
        energy_drink_processing_desc: 'Beverage formulated with synthetic caffeine, taurine, added sugars and stimulating additives.',
        cereal_processing_desc: 'Extruded cereal with added sugars, artificial colors, synthetic vitamins and preservatives.',
        cookies_processing_desc: 'Industrial cookies with artificial filling, hydrogenated oils, refined sugars and multiple additives.',
        natural_food: 'Natural food',
        no_additives: 'No additives',
        no_preservatives: 'No preservatives',
        fresh_vegetable: 'Fresh vegetable',
        fresh_fruit: 'Fresh fruit',
        leafy_green: 'Leafy green',
        superfood: 'Superfood',
        organic: 'Organic',
        low_calories: 'Low calories',
        versatile: 'Versatile',
        high_fiber: 'High fiber',
        unprocessed: 'Unprocessed',
        citrus_natural: 'Natural citrus',
        rich_vitamin_c: 'Rich in vitamin C',
        fresh: 'Fresh',
        tropical_fruit: 'Tropical fruit',
        rich_potassium: 'Rich in potassium',
        natural_energy: 'Natural energy',
        healthy_fats: 'Healthy fats',
        natural_creamy: 'Natural creamy',
        cooked_grain: 'Cooked grain',
        clean: 'Clean',
        complete_protein: 'Complete protein',
        fresh_fish: 'Fresh fish',
        rich_omega3: 'Rich in omega-3',
        natural_nut: 'Natural nut',
        rich_vitamin_e: 'Rich in vitamin E',
        rich_antioxidants: 'Rich in antioxidants',
        natural_tuber: 'Natural tuber',
        rich_beta_carotene: 'Rich in beta-carotenes',
        fermented: 'Fermented',
        probiotics: 'Probiotics',
        strained: 'Strained',
        natural_seed: 'Natural seed',
        hydrogenated_oils: 'Hydrogenated oils',
        high_sodium: 'High sodium',
        artificial_flavors: 'Artificial flavors',
        preservatives: 'Preservatives',
        industrial_frying: 'Industrial frying',
        corn_syrup: 'Corn syrup',
        artificial_colors: 'Artificial colors',
        phosphoric_acid: 'Phosphoric acid',
        added_caffeine: 'Added caffeine',
        synthetic_flavors: 'Synthetic flavors',
        palm_oil: 'Palm oil',
        monosodium_glutamate: 'Monosodium glutamate',
        bht_preservatives: 'BHT preservatives',
        excess_sodium: 'Excess sodium',
        pre_fried_noodles: 'Pre-fried noodles',
        emulsifiers: 'Emulsifiers',
        stabilizing_gums: 'Stabilizing gums',
        synthetic_caffeine: 'Synthetic caffeine',
        artificial_taurine: 'Artificial taurine',
        blue_dyes: 'Blue dyes',
        synthetic_stimulants: 'Synthetic stimulants',
        industrial_extrusion: 'Industrial extrusion',
        added_sugars: 'Added sugars',
        fdc_dyes: 'FD&C dyes',
        synthetic_vitamins: 'Synthetic vitamins',
        bht_preservative: 'BHT preservative',
        trans_oils: 'Trans oils',
        artificial_filling: 'Artificial filling',
        soy_lecithin: 'Soy lecithin',
        artificial_aromas: 'Artificial aromas',
        high_added_sugar: 'High added sugar',
        // Nuevos indicadores de procesamiento
        whole_grain: 'Whole grain',
        air_popped: 'Air popped',
        rich_vitamin_a: 'Rich in vitamin A',
        natural_sweetness: 'Natural sweetness',
        plant_protein: 'Plant protein',
        complex_carbs: 'Complex carbs',
        rich_lycopene: 'Rich in lycopene',
        antioxidants: 'Antioxidants',
        digestive_enzymes: 'Digestive enzymes',
        bromelain_enzyme: 'Bromelain enzyme',
        starchy_root: 'Starchy root',
        energy_source: 'Energy source',
        raw: 'Raw'
      },
      products: {
        broccoli_001: {
          name: 'Broccoli',
          description: 'Cruciferous vegetable rich in vitamins and minerals'
        },
        apple_002: {
          name: 'Apple',
          description: 'Sweet and crunchy fruit packed with fiber and natural sugars'
        },
        spinach_003: {
          name: 'Spinach',
          description: 'Leafy green vegetable high in iron and vitamins'
        },
        carrot_004: {
          name: 'Carrot',
          description: 'Orange root vegetable rich in beta-carotene'
        },
        kale_005: {
          name: 'Kale',
          description: 'Superfood leafy green with exceptional nutrient density'
        },
        cauliflower_006: {
          name: 'Cauliflower',
          description: 'Versatile cruciferous vegetable, low in calories'
        },
        brussels_007: {
          name: 'Brussels Sprouts',
          description: 'Mini cabbage-like vegetables with a slightly bitter taste'
        },
        pear_008: {
          name: 'Pear',
          description: 'Sweet and juicy fruit with high fiber content'
        },
        orange_009: {
          name: 'Orange',
          description: 'Citrus fruit packed with vitamin C'
        },
        banana_010: {
          name: 'Banana',
          description: 'Tropical fruit rich in potassium and natural sugars'
        },
        avocado_001: {
          name: 'Avocado',
          description: 'Creamy fruit high in healthy monounsaturated fats'
        },
        quinoa_002: {
          name: 'Quinoa',
          description: 'Complete protein grain, gluten-free superfood'
        },
        salmon_003: {
          name: 'Salmon',
          description: 'Fatty fish rich in omega-3 fatty acids'
        },
        almonds_004: {
          name: 'Almonds',
          description: 'Tree nuts high in healthy fats and vitamin E'
        },
        blueberries_005: {
          name: 'Blueberries',
          description: 'Antioxidant-rich berries, brain superfood'
        },
        sweet_potato_006: {
          name: 'Sweet Potato',
          description: 'Orange tuber vegetable rich in beta-carotene'
        },
        greek_yogurt_007: {
          name: 'Greek Yogurt',
          description: 'Natural Greek yogurt: creamy, strained, high in protein, calcium, and probiotics.'
        },
        chia_seeds_008: {
          name: 'Chia Seeds',
          description: 'Tiny seeds packed with omega-3s and fiber'
        },
        chips_009: {
          name: 'Potato Chips',
          description: 'Deep-fried potato chips with added salt and preservatives'
        },
        soda_010: {
          name: 'Cola Soda',
          description: 'Carbonated soft drink with high sugar content and artificial additives'
        },
        instant_noodles_011: {
          name: 'Instant Noodles',
          description: 'Pre-cooked fried noodles with artificial seasoning packet'
        },
        ice_cream_012: {
          name: 'Industrial Ice Cream',
          description: 'Industrial ice cream with artificial flavors and stabilizers'
        },
        energy_drink_013: {
          name: 'Energy Drink',
          description: 'Caffeinated beverage with synthetic stimulants and high sugar content'
        },
        cereal_014: {
          name: 'Sugary Cereal',
          description: 'Processed breakfast cereal with added sugars and artificial colors'
        },
        cookies_015: {
          name: 'Sandwich Cookies',
          description: 'Sandwich cookies with artificial cream filling and hydrogenated oils'
        },
        // NUEVOS PRODUCTOS CON REGIONALISMOS
        popcorn_016: {
          name: 'Popcorn',
          description: 'Air-popped corn kernels, whole grain snack'
        },
        lulo_017: {
          name: 'Lulo',
          description: 'Tropical fruit with citrus flavor, rich in vitamin C'
        },
        corn_018: {
          name: 'Corn',
          description: 'Fresh corn kernels, natural source of energy and fiber'
        },
        mango_019: {
          name: 'Mango',
          description: 'Sweet tropical fruit rich in vitamins A and C'
        },
        beans_020: {
          name: 'Black Beans',
          description: 'Legume rich in plant protein and fiber'
        },
        tomato_021: {
          name: 'Tomato',
          description: 'Fresh vegetable fruit rich in lycopene and vitamin C'
        },
        papaya_022: {
          name: 'Papaya',
          description: 'Tropical fruit with digestive enzymes and high vitamin C'
        },
        plantain_023: {
          name: 'Plantain',
          description: 'Starchy fruit rich in potassium and complex carbohydrates'
        },
        cacao_024: {
          name: 'Raw Cacao',
          description: 'Raw cacao beans, superfood rich in antioxidants and minerals'
        },
        pineapple_025: {
          name: 'Pineapple',
          description: 'Tropical fruit with bromelain enzyme and vitamin C'
        },
        yuca_026: {
          name: 'Cassava',
          description: 'Starchy root vegetable, important source of carbohydrates'
        }
      }
    }
  },
  es: {
    translation: {
      scan: 'Escanear',
      scanFood: 'Escanear Comida',
      takePhoto: 'Tomar Foto',
      analyzing: 'Analizando...',
      excellentOption: 'Excelente opción',
      goodOption: 'Buena opción',
      acceptableOption: 'Opción aceptable',
      consumeModerately: 'Consumir con moderación',
      processingLevel: 'Nivel de Procesamiento',
      indicators: 'Indicadores',
      nutriInfo: 'Info nutricional',
      allergens: 'Alérgenos',
      otherOptions: 'Otras opciones',
      protein: 'Proteína',
      excellentProteinSource: 'Excelente fuente de proteína',
      fats: 'Grasas',
      highSaturatedFats: 'Alto en grasas saturadas pero de origen natural. Consúmelo en pequeñas cantidades.',
      fiber: 'Fibra',
      goodFiberSource: 'Buena fuente de fibra',
      seeMore: 'Ver más',
      retake: 'Repetir',
      back: 'Volver',
      noAllergens: 'No se detectaron alérgenos comunes',
      containsAllergens: 'Puede contener alérgenos',
      home: 'Inicio',
      recipes: 'Recetas',
      favorites: 'Favoritos',
      more: 'Más',
      navigation: {
        home: 'Inicio',
        explore: 'Explorar',
        favorites: 'Favoritos',
        recipes: 'Recetas',
        blog: 'Blog',
        camera: 'Cámara',
      },
      loading: 'Cargando...',
      noFavoritesYet: 'Aún no tienes favoritos',
      startScanningToAddFavorites: 'Comienza a escanear alimentos para añadirlos a tus favoritos',
      exploreProducts: 'Explorar Productos',
      browseHealthyOptions: 'Navega y descubre opciones de alimentos saludables y alternativas',
      explore: 'Explorar',
      takePhotoInstant: 'Toma una foto de tu comida y obtén análisis nutricional instantáneo',
      scanAnalyzeExplore: 'Escanea, analiza y explora alimentos saludables',
      pageNotFound: 'Página No Encontrada',
      pageNotFoundMessage: '¡Ups! Página no encontrada',
      returnToHome: 'Volver al Inicio',
      processingImage: 'Procesando imagen y obteniendo información nutricional...',
      scanInstructions: 'Centra la comida en el marco y toma una foto para obtener información nutricional',
      emptyRecipeBook: 'Tu libro está vacío',
      addRecipesToCollection: 'Añade tus propias recetas y crea tu colección personalizada',
      all: 'Todas',
      vitaminsAndMinerals: 'Vitaminas y Minerales',
      vitaminsLabel: 'Vitaminas:',
      mineralsLabel: 'Minerales:',
      sodium: 'Sodio',
      cholesterol: 'Colesterol',
      calories: 'Calorías',
      totalCalories: 'Calorías Totales',
      fromCarbs: 'De Carbohidratos',
      fromProtein: 'De Proteína',
      fromFat: 'De Grasa',
      carbohydrates: 'Carbohidratos',
      saturatedFat: 'Grasa Saturada',
      sugars: 'Azúcares',
      searchYourFavorites: 'Busca en tus favoritos...',
      searchFoodProducts: 'Buscar productos alimenticios...',
      noSimilarProductsAvailable: 'No hay productos similares disponibles',
      thisProductNotContainAllergens: 'Este producto no contiene alérgenos comunes',
      easy: 'Fácil',
      medium: 'Medio',
      hard: 'Difícil',
      dailyValue: '% Valor Diario*',
      dailyValueNote: '*Los Valores Diarios Porcentuales están basados en una dieta de 2,000 calorías.',
      total: 'Total',
      caloriesFrom: 'Calorías de',
      showingItems: 'Mostrando {{from}}–{{to}} de {{total}} productos',
      noResults: 'No se encontraron productos',
      allergensToAvoid: "Prefiero evitar:",
      noAllergensSelected: "No hay alérgenos seleccionados",
      quickActions: 'Acciones Rápidas',
      weeklyList: "Lista de la semana",
      weeklyListDescription: "Organiza tus compras con ingredientes que te hacen sentir bien y se adaptan a tu estilo de vida.",
      recipesDescription: "Cocina con lo que te nutre y se siente bien para ti. Recetas hechas para tu ritmo y tus gustos.",
      category: 'Categoría',
      rating: 'Calificación',
      // Greetings - regresados de dropbox
      goodMorning: "Buenos días",
      goodAfternoon: "Buenas tardes",
      goodEvening: "Buenas noches", 
      welcomeBack: "Bienvenido de nuevo",
      // Auth callback translations
      connectingWithDropbox: "Conectando con Dropbox...",
      pleaseWaitProcessing: "Por favor espera mientras procesamos tu autenticación.",
      connectionSuccessful: "¡Conexión exitosa!",
      finalizingLogin: "Finalizando el inicio de sesión...",
      updatePersonalInfo: "Actualiza tu información personal",
      redirect: "Redirigir",
      redirectToHome: "Te redirigiremos al inicio.",
      // Product detail translations
      productDetails: "Detalles del Producto",
      productNotFound: "Producto no encontrado",
      productNotFoundMessage: "El producto que buscas no existe o ha sido eliminado.",
      goHome: "Ir al Inicio",
      // Shopping List Detail translations
      tapToStart: "Escribe aquí para empezar",
      searchProducts: "Escribe aquí para buscar productos o crear artículos...",
      noItemsYet: "Tu lista está vacía",
      save: "Guardar",
      cancel: "Cancelar",
      saving: "Guardando...",
      forceRefresh: "Forzar actualización",
      refreshing: "Actualizando...",
      // Shopping Lists page translations
      createList: "Crear Lista",
      createNewList: "Crear Nueva Lista",
      create: "Crear",
      creating: "Creando...",
      listName: "Nombre de la lista",
      enterListName: "Ingresa el nombre de la lista",
      description: "Descripción",
      optional: "opcional",
      enterListDescription: "Descripción de la lista",
      noListsYet: "No tienes listas aún",
      createFirstList: "Crea tu primera lista de compras",
      items: "artículos",
      completed: "completados",
      deleteList: "Eliminar Lista",
      deleteListConfirmation: "¿Estás seguro de que deseas eliminar esta lista de compras? Esta acción no se puede deshacer.",
      delete: "Eliminar",
      // Auth page translations
      authenticationError: "Error de Autenticación",
      authenticationErrorOccurred: "Ha ocurrido un error durante la autenticación",
      ...dropboxTranslations.es,
      installInstructions: 'Cómo Instalar NutriScan',
      iosInstallText: '📤 Toca el botón Compartir\n\n⬇️ Desplázate hacia abajo y toca "Añadir a Inicio"\n\n✅ Toca "Añadir" para instalar NutriScan en tu pantalla de inicio',
      // Missing translations found in components
      connectForPersonalized: 'Conecta para una experiencia personalizada',
      savingYourData: 'Guardando tus datos...',
      allergensAutoSave: 'Cambios guardados automáticamente',
      decentralizedApp: 'App Descentralizada',
      decentralizedAppDescription: 'Tus datos se quedan contigo, no en nuestros servidores',
      yourDataYourControl: 'Tus Datos, Tu Control',
      yourDataYourControlDescription: 'Propiedad completa de tus datos nutricionales',
      securePrivate: 'Seguro y Privado',
      noDataSharing: 'Nunca compartimos tus datos personales',
      moreOptions: 'Más Opciones',
      loggedInAs: 'Conectado como',
      editProfile: 'Editar Perfil',
      tools: 'Herramientas',
      installApp: 'Instalar App',
      information: 'Información',
      helpSupport: 'Ayuda y Soporte',
      aboutUs: 'Acerca de Nosotros',
      contactUs: 'Contáctanos',
      howItWorks: 'Cómo Funciona',
      appFeatures: 'Características',
      userGuide: 'Guía de Usuario',
      nutritionDisclaimer: 'Aviso Nutricional',
      loggingOut: 'Cerrando sesión...',
      connecting: 'Conectando...',
      messageSent: 'Mensaje Enviado',
      messageSentDescription: 'Gracias por tu mensaje. Te responderemos pronto.',
      errorSendingMessage: 'Error enviando mensaje',
      getInTouchText: 'Nos encantaría saber de ti. Envíanos un mensaje y responderemos lo antes posible.',
      sendMessage: 'Enviar Mensaje',
      sending: 'Enviando...',
      cookieConsent: 'Consentimiento de Cookies',
      cookieConsentDescription: 'Usamos cookies para mejorar tu experiencia.',
      acceptCookies: 'Aceptar Cookies',
      cookiePreferences: 'Preferencias de Cookies',
      cookieSettings: 'Configuración de Cookies',
      cookieUsage: 'Uso de Cookies',
      cookieUsageDescription: 'Aquí están las cookies utilizadas en nuestro sitio web. Puedes seleccionar categorías individuales para habilitar o deshabilitar nuestro uso de cookies. Ten en cuenta que bloquear algunos tipos de cookies puede afectar negativamente tu experiencia en el sitio web.',
      acceptAll: 'Aceptar todo',
      rejectAll: 'Rechazar todo',
      saveSettings: 'Guardar configuración',
      moreInformation: 'Más Información',
      moreInformationDescription: 'Para más información sobre nuestra política de privacidad y uso de cookies, por favor contáctanos.',
      cookieTable: {
        name: 'Nombre',
        domain: 'Dominio',
        expiration: 'Expiración',
        path: 'Ruta',
        description: 'Descripción'
      },
      cookies: {
        necessary: {
          name: 'Cookies necesarias',
          description: 'Estas cookies son esenciales para que el sitio web funcione correctamente y no se pueden desactivar.'
        },
        functional: {
          name: 'Cookies funcionales',
          description: 'Estas cookies habilitan funcionalidad mejorada y personalización, como preferencias de idioma y configuraciones de usuario.'
        },
        analytics: {
          name: 'Cookies de análisis',
          description: 'Estas cookies nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web recopilando y reportando información anónima.'
        },
        marketing: {
          name: 'Cookies de marketing',
          description: 'Estas cookies se utilizan para rastrear visitantes en sitios web para mostrar anuncios relevantes y personalizados.'
        }
      },
      privacyPolicy: 'Política de Privacidad',
      termsOfService: 'Términos de Servicio',
      // Legal pages translations
      ourMission: 'Nuestra Misión',
      ourMissionText: 'Democratizar el acceso a información nutricional y ayudar a las personas a tomar decisiones alimentarias informadas.',
      ourTeam: 'Nuestro Equipo',
      ourTeamText: 'Somos un equipo apasionado de desarrolladores, nutricionistas y entusiastas de la salud.',
      ourValues: 'Nuestros Valores',
      ourValuesText: 'Transparencia, privacidad y empoderamiento a través del conocimiento.',
      contactUsText: 'Ponte en contacto con nosotros para cualquier pregunta o comentario.',
      getInTouch: 'Ponte en Contacto',
      directContact: 'Contacto Directo',
      directContactText: 'Puedes contactarnos directamente a través del formulario de contacto o email.',
      foodSafetyTitle: 'Seguridad Alimentaria',
      foodSafetyContent: 'Aprende sobre prácticas y pautas de seguridad alimentaria.',
      featuresTitle: 'Características',
      featuresContent: 'Descubre todas las increíbles características de nuestra app.',
      userGuideTitle: 'Guía de Usuario',
      userGuideContent: 'Guía completa sobre cómo usar la aplicación.',
      recipeGuideTitle: 'Guía de Recetas',
      recipeGuideContent: 'Aprende cómo crear y gestionar tus recetas.',
      nutritionDisclaimerTitle: 'Aviso Nutricional',
      nutritionDisclaimerContent: 'Información importante sobre datos nutricionales y recomendaciones.',
    },
    blog: blogTranslations.es.blog,
    legal: legalTranslations.es,
    database: {
      categories: {
        vegetables: 'Vegetales',
        fruits: 'Frutas',
        grains: 'Granos',
        proteins: 'Proteínas',
        nuts: 'Frutos Secos',
        seeds: 'Semillas',
        dairy: 'Lácteos',
        snacks: 'Snacks',
        beverages: 'Bebidas',
        processed_foods: 'Alimentos Procesados',
        desserts: 'Postres',
        breakfast: 'Desayuno'
      },
      vitamins: {
        'Vitamin A': 'Vitamina A',
        'Vitamin B6': 'Vitamina B6',
        'Vitamin B12': 'Vitamina B12',
        'Vitamin C': 'Vitamina C',
        'Vitamin D': 'Vitamina D',
        'Vitamin E': 'Vitamina E',
        'Vitamin K': 'Vitamina K',
        'Folate': 'Folato',
        'Thiamine': 'Tiamina',
        'Riboflavin': 'Riboflavina',
        'Niacin': 'Niacina',
        'Folic Acid': 'Ácido Fólico'
      },
      minerals: {
        'Calcium': 'Calcio',
        'Iron': 'Hierro',
        'Magnesium': 'Magnesio',
        'Phosphorus': 'Fósforo',
        'Potassium': 'Potasio',
        'Sodium': 'Sodio',
        'Zinc': 'Zinc',
        'Selenium': 'Selenio',
        'Manganese': 'Manganeso',
        'Copper': 'Cobre'
      },
      processing: {
        minimal: 'Alimentos sin procesar o mínimamente procesados',
        processed: 'Ingredientes culinarios procesados',
        'ultra-processed': 'Productos alimenticios ultraprocesados',
        broccoli_processing_desc: 'Alimento fresco sin procesar. Vegetable crudo o cocido sin aditivos.',
        apple_processing_desc: 'Fruta fresca sin procesar. Alimento natural en su estado original.',
        spinach_processing_desc: 'Vegetal de hoja verde fresco, sin procesar ni aditivos.',
        carrot_processing_desc: 'Raíz vegetal fresca en su estado natural, rica en betacarotenos.',
        kale_processing_desc: 'Superalimento verde en estado natural, sin procesamiento industrial.',
        cauliflower_processing_desc: 'Vegetal crucífero fresco, versátil y bajo en calorías.',
        brussels_processing_desc: 'Mini repollos frescos en su estado natural, ricos en nutrientes.',
        pear_processing_desc: 'Fruta dulce y jugosa en su estado natural, alta en fibra.',
        orange_processing_desc: 'Fruta cítrica fresca, excelente fuente de vitamina C.',
        banana_processing_desc: 'Fruta tropical rica en potasio y azúcares naturales.',
        avocado_processing_desc: 'Fruta cremosa rica en grasas monoinsaturadas saludables.',
        quinoa_processing_desc: 'Grano procesado mediante cocción y limpieza, mantiene sus propiedades nutricionales.',
        salmon_processing_desc: 'Pescado fresco o congelado, rico en ácidos grasos omega-3.',
        almonds_processing_desc: 'Frutos secos naturales, ricos en grasas saludables y vitamina E.',
        blueberries_processing_desc: 'Frutos del bosque frescos, ricos en antioxidantes y superalimento para el cerebro.',
        sweet_potato_processing_desc: 'Tubérculo naranja fresco, rico en betacarotenos y fibra.',
        greek_yogurt_processing_desc: 'Lácteo fermentado y colado, con cultivos probióticos beneficiosos.',
        chia_seeds_processing_desc: 'Semillas diminutas naturales, ricas en omega-3 y fibra.',
        chips_processing_desc: 'Producto altamente procesado con aceites refinados, sal añadida y aditivos industriales para realzar sabor y textura.',
        // Nuevas descripciones de procesamiento
        popcorn_processing_desc: 'Granos de maíz reventados al aire sin aceites añadidos ni sal excesiva.',
        lulo_processing_desc: 'Fruta tropical fresca, rica en vitamina C y antioxidantes.',
        corn_processing_desc: 'Granos de maíz frescos o cocidos, fuente natural de granos.',
        mango_processing_desc: 'Fruta tropical fresca, excelente fuente de vitaminas A y C.',
        beans_processing_desc: 'Legumbres cocidas, excelente fuente de proteína vegetal y fibra.',
        tomato_processing_desc: 'Fruto vegetal fresco, rico en licopeno y vitamina C.',
        papaya_processing_desc: 'Fruta tropical fresca, excelente fuente de vitamina C y enzimas digestivas.',
        plantain_processing_desc: 'Plátano macho cocido o crudo, rico en potasio y carbohidratos complejos.',
        cacao_processing_desc: 'Granos de cacao crudos, superalimento rico en antioxidantes y magnesio.',
        pineapple_processing_desc: 'Fruta tropical fresca, rica en enzima bromelina y vitamina C.',
        yuca_processing_desc: 'Vegetal de raíz fresco, yuca cocida rica en almidón y energía.',
        soda_processing_desc: 'Bebida ultra procesada con jarabe de maíz alto en fructosa, colorantes artificiales, conservantes y aditivos químicos.',
        instant_noodles_processing_desc: 'Fideos precocidos y fritos con paquete de condimentos lleno de glutamato monosódico, conservantes y saborizantes artificiales.',
        ice_cream_processing_desc: 'Postre congelado ultra procesado con emulsificantes, estabilizantes, colorantes y saborizantes artificiales.',
        energy_drink_processing_desc: 'Bebida formulada con cafeína sintética, taurina, azúcares añadidos y aditivos estimulantes.',
        cereal_processing_desc: 'Cereal extruido con azúcares añadidos, colorantes artificiales, vitaminas sintéticas y conservantes.',
        cookies_processing_desc: 'Galletas industriales con relleno artificial, aceites hidrogenados, azúcares refinados y múltiples aditivos.',
        natural_food: 'Alimento natural',
        no_additives: 'Sin aditivos',
        no_preservatives: 'Sin conservantes',
        fresh_vegetable: 'Vegetal fresco',
        fresh_fruit: 'Fruta fresca',
        leafy_green: 'Hoja verde',
        superfood: 'Superalimento',
        organic: 'Orgánico',
        low_calories: 'Bajo en calorías',
        versatile: 'Versátil',
        high_fiber: 'Rico en fibra',
        unprocessed: 'Sin procesar',
        citrus_natural: 'Cítrico natural',
        rich_vitamin_c: 'Rico en vitamina C',
        fresh: 'Fresco',
        tropical_fruit: 'Fruta tropical',
        rich_potassium: 'Rico en potasio',
        natural_energy: 'Energético natural',
        healthy_fats: 'Grasas saludables',
        natural_creamy: 'Cremoso natural',
        cooked_grain: 'Grano cocido',
        clean: 'Limpio',
        complete_protein: 'Proteína completa',
        fresh_fish: 'Pescado fresco',
        rich_omega3: 'Rico en omega-3',
        natural_nut: 'Fruto seco natural',
        rich_vitamin_e: 'Rico en vitamina E',
        rich_antioxidants: 'Rico en antioxidantes',
        natural_tuber: 'Tubérculo natural',
        rich_beta_carotene: 'Rico en betacarotenos',
        fermented: 'Fermentado',
        probiotics: 'Probióticos',
        strained: 'Colado',
        natural_seed: 'Semilla natural',
        hydrogenated_oils: 'Aceites hidrogenados',
        high_sodium: 'Alto sodio',
        artificial_flavors: 'Saborizantes artificiales',
        preservatives: 'Conservantes',
        industrial_frying: 'Freído industrial',
        corn_syrup: 'Jarabe de maíz',
        artificial_colors: 'Colorantes artificiales',
        phosphoric_acid: 'Ácido fosfórico',
        added_caffeine: 'Cafeína añadida',
        synthetic_flavors: 'Saborizantes sintéticos',
        palm_oil: 'Aceite de palma',
        monosodium_glutamate: 'Glutamato monosódico',
        bht_preservatives: 'Conservantes BHT',
        excess_sodium: 'Exceso de sodio',
        pre_fried_noodles: 'Fideos prefritos',
        emulsifiers: 'Emulsificantes',
        stabilizing_gums: 'Gomas estabilizantes',
        synthetic_caffeine: 'Cafeína sintética',
        artificial_taurine: 'Taurina artificial',
        blue_dyes: 'Colorantes azules',
        synthetic_stimulants: 'Estimulantes sintéticos',
        industrial_extrusion: 'Extrusión industrial',
        added_sugars: 'Azúcares añadidos',
        fdc_dyes: 'Colorantes FD&C',
        synthetic_vitamins: 'Vitaminas sintéticas',
        bht_preservative: 'Conservante BHT',
        trans_oils: 'Aceites trans',
        artificial_filling: 'Relleno artificial',
        soy_lecithin: 'Lecitina de soja',
        artificial_aromas: 'Aromas artificiales',
        high_added_sugar: 'Alto azúcar añadido',
        // Nuevos indicadores de procesamiento
        whole_grain: 'Grano integral',
        air_popped: 'Reventado al aire',
        rich_vitamin_a: 'Rico en vitamina A',
        natural_sweetness: 'Dulzura natural',
        plant_protein: 'Proteína vegetal',
        complex_carbs: 'Carbohidratos complejos',
        rich_lycopene: 'Rico en licopeno',
        antioxidants: 'Antioxidantes',
        digestive_enzymes: 'Enzimas digestivas',
        bromelain_enzyme: 'Enzima bromelina',
        starchy_root: 'Raíz feculenta',
        energy_source: 'Fuente de energía',
        raw: 'Crudo'
      },
      products: {
        broccoli_001: {
          name: 'Brócoli',
          description: 'Vegetal crucífero rico en vitaminas y minerales'
        },
        apple_002: {
          name: 'Manzana',
          description: 'Fruta dulce y crujiente llena de fibra y azúcares naturales'
        },
        spinach_003: {
          name: 'Espinaca',
          description: 'Vegetal de hoja verde alto en hierro y vitaminas'
        },
        carrot_004: {
          name: 'Zanahoria',
          description: 'Vegetal de raíz naranja rico en betacarotenos'
        },
        kale_005: {
          name: 'Col Rizada',
          description: 'Superalimento de hoja verde con densidad nutricional excepcional'
        },
        cauliflower_006: {
          name: 'Coliflor',
          description: 'Vegetal crucífero versátil y bajo en calorías'
        },
        brussels_007: {
          name: 'Coles de Bruselas',
          description: 'Mini repollos con sabor ligeramente amargo'
        },
        pear_008: {
          name: 'Pera',
          description: 'Fruta dulce y jugosa con alto contenido de fibra'
        },
        orange_009: {
          name: 'Naranja',
          description: 'Fruta cítrica llena de vitamina C'
        },
        banana_010: {
          name: 'Plátano',
          description: 'Fruta tropical rica en potasio y azúcares naturales'
        },
        avocado_001: {
          name: 'Aguacate',
          description: 'Fruta cremosa alta en grasas monoinsaturadas saludables'
        },
        quinoa_002: {
          name: 'Quinoa',
          description: 'Grano con proteína completa, superalimento sin gluten'
        },
        salmon_003: {
          name: 'Salmón',
          description: 'Pescado graso rico en ácidos grasos omega-3'
        },
        almonds_004: {
          name: 'Almendras',
          description: 'Frutos secos altos en grasas saludables y vitamina E'
        },
        blueberries_005: {
          name: 'Arándanos',
          description: 'Bayas ricas en antioxidantes, superalimento para el cerebro'
        },
        sweet_potato_006: {
          name: 'Batata',
          description: 'Tubérculo naranja rico en betacarotenos'
        },
        greek_yogurt_007: {
          name: 'Yogur Griego',
          description: 'Yogur griego natural: cremoso, colado, alto en proteínas, calcio y probióticos.'
        },
        chia_seeds_008: {
          name: 'Semillas de Chía',
          description: 'Semillas diminutas llenas de omega-3 y fibra'
        },
        chips_009: {
          name: 'Papas Fritas',
          description: 'Papas fritas en aceite con sal añadida y conservantes'
        },
        soda_010: {
          name: 'Refresco de Cola',
          description: 'Bebida gaseosa con alto contenido de azúcar y aditivos artificiales'
        },
        instant_noodles_011: {
          name: 'Fideos Instantáneos',
          description: 'Fideos precocidos fritos con paquete de condimentos artificiales'
        },
        ice_cream_012: {
          name: 'Helado Industrial',
          description: 'Helado industrial con sabores artificiales y estabilizantes'
        },
        energy_drink_013: {
          name: 'Bebida Energética',
          description: 'Bebida con cafeína con estimulantes sintéticos y alto contenido de azúcar'
        },
        cereal_014: {
          name: 'Cereal Azucarado',
          description: 'Cereal procesado para desayuno con azúcares añadidos y colorantes artificiales'
        },
        cookies_015: {
          name: 'Galletas Rellenas',
          description: 'Galletas sándwich con relleno artificial y aceites hidrogenados'
        },
        // NUEVOS PRODUCTOS CON REGIONALISMOS
        popcorn_016: {
          name: 'Palomitas de Maíz',
          description: 'Granos de maíz reventados al aire, snack integral'
        },
        lulo_017: {
          name: 'Lulo',
          description: 'Fruta tropical con sabor cítrico, rica en vitamina C'
        },
        corn_018: {
          name: 'Maíz',
          description: 'Granos de maíz fresco, fuente natural de energía y fibra'
        },
        mango_019: {
          name: 'Mango',
          description: 'Fruta tropical dulce rica en vitaminas A y C'
        },
        beans_020: {
          name: 'Frijoles Negros',
          description: 'Legumbre rica en proteína vegetal y fibra'
        },
        tomato_021: {
          name: 'Tomate',
          description: 'Fruto vegetal fresco rico en licopeno y vitamina C'
        },
        papaya_022: {
          name: 'Papaya',
          description: 'Fruta tropical con enzimas digestivas y alta vitamina C'
        },
        plantain_023: {
          name: 'Plátano Macho',
          description: 'Fruta feculenta rica en potasio y carbohidratos complejos'
        },
        cacao_024: {
          name: 'Cacao Crudo',
          description: 'Granos de cacao crudo, superalimento rico en antioxidantes y minerales'
        },
        pineapple_025: {
          name: 'Piña',
          description: 'Fruta tropical con enzima bromelina y vitamina C'
        },
        yuca_026: {
          name: 'Yuca',
          description: 'Vegetal de raíz feculenta, fuente importante de carbohidratos'
        }
      }
    }
  }
};

// Get saved language from localStorage or default to 'es'
const getSavedLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'es';
  }
  return 'es';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Save language to localStorage when it changes
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lng);
  }
});

export default i18n;
