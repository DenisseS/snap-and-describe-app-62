/**
 * Base de datos de sinónimos con términos genéricos y variaciones regionales
 * Estructura optimizada para búsqueda O(1) manteniendo información regional
 */

export interface SynonymEntry {
  canonical: string;           // Término genérico/fallback
  productId: string;          // ID del producto real en la base de datos
  confidence: number;         // 1.0 para término principal, 0.9 para sinónimos
  regionInfo?: {
    region: string;           // Código ISO: "MX", "ES", "AR", "CO", "EC"
    country: string;          // Nombre completo del país
    language?: string;        // "es", "en-US", "en-GB"
  };
}

export interface SynonymDatabase {
  // Índice optimizado para búsqueda O(1)
  searchIndex: { [searchTerm: string]: SynonymEntry };
  
  // Metadatos para gestión (no usado en búsqueda)
  metadata: {
    [productId: string]: {
      canonical: string;
      regions: { [term: string]: string[] };
    }
  };
}

// Base de datos inicial de sinónimos con información regional
// Mapea a productos existentes usando sus IDs reales para mantener compatibilidad
const synonymsData = {
  // Aguacate (producto avocado_001)
  "avocado": {
    canonical: "avocado",
    productId: "avocado_001",
    synonyms: {
      "palta": ["AR", "CL", "PE", "UY"],  // Cono Sur
      "aguacate": ["MX", "ES", "CO", "VE", "EC"] // América Latina
    }
  },
  
  // Brócoli (producto broccoli_001)  
  "broccoli": {
    canonical: "broccoli",
    productId: "broccoli_001",
    synonyms: {
      "brócoli": ["MX", "ES", "CO", "AR"], // Español
      "brécol": ["ES"]                      // España (variante)
    }
  },

  // Manzana (producto apple_002)
  "apple": {
    canonical: "apple",
    productId: "apple_002",
    synonyms: {
      "manzana": ["MX", "ES", "CO", "AR", "VE", "EC"], // Español universal
      "poma": ["CL"]                                    // Chile (regional)
    }
  },

  // Espinaca (producto spinach_003)
  "spinach": {
    canonical: "spinach",
    productId: "spinach_003",
    synonyms: {
      "espinaca": ["MX", "ES", "CO", "AR", "VE", "EC"], // Español universal
      "espinafre": ["BR"]                                // Brasil
    }
  },

  // Zanahoria (producto carrot_004)
  "carrot": {
    canonical: "carrot",
    productId: "carrot_004",
    synonyms: {
      "zanahoria": ["ES", "MX", "CO", "AR"],   // Español
      "carlota": ["VE"],                       // Venezuela (regional)
      "daucus": ["ES"]                         // España (técnico)
    }
  },

  // Col rizada (producto kale_005)
  "kale": {
    canonical: "kale",
    productId: "kale_005", 
    synonyms: {
      "col rizada": ["ES", "MX", "CO"],    // Español general
      "col crespa": ["AR", "CL"],          // Cono Sur
      "berza": ["ES"],                     // España (regional)
      "acelga silvestre": ["EC", "PE"]     // Andes
    }
  },

  // Coliflor (producto cauliflower_006)
  "cauliflower": {
    canonical: "cauliflower",
    productId: "cauliflower_006",
    synonyms: {
      "coliflor": ["MX", "ES", "CO", "AR", "VE", "EC"], // Español universal
      "couve-flor": ["BR"]                               // Brasil
    }
  },

  // Coles de Bruselas (producto brussels_007)
  "brussels sprouts": {
    canonical: "brussels sprouts",
    productId: "brussels_007",
    synonyms: {
      "coles de bruselas": ["ES", "MX", "CO", "AR"],    // Español
      "repollitas de bruselas": ["AR", "CL"],           // Cono Sur
      "couvinha de bruxelas": ["BR"]                     // Brasil
    }
  },

  // Pera (producto pear_008)
  "pear": {
    canonical: "pear",
    productId: "pear_008",
    synonyms: {
      "pera": ["MX", "ES", "CO", "AR", "VE", "EC"],     // Español universal
      "pêra": ["BR"]                                     // Brasil
    }
  },

  // Naranja (producto orange_009)
  "orange": {
    canonical: "orange",
    productId: "orange_009",
    synonyms: {
      "naranja": ["MX", "ES", "CO", "AR", "VE", "EC"],  // Español universal
      "china": ["PR", "DO"],                             // Puerto Rico, República Dominicana
      "laranja": ["BR"]                                  // Brasil
    }
  },

  // Plátano/Banana (producto banana_010)
  "banana": {
    canonical: "banana",
    productId: "banana_010",
    synonyms: {
      "banana": ["AR", "UY", "PY"],                   // Cono Sur
      "banano": ["CO", "VE", "EC", "PE"],            // América del Norte/Andes
      "plátano": ["MX", "ES", "GT", "SV", "HN"],     // México, España, Centroamérica
      "cambur": ["VE"],                               // Venezuela (regional)
      "guineo": ["DO", "PR", "CU"]                   // Caribe hispanohablante
    }
  },

  // Quinoa (producto quinoa_002)
  "quinoa": {
    canonical: "quinoa",
    productId: "quinoa_002", 
    synonyms: {
      "quinua": ["PE", "BO", "EC"],    // Andes (forma original)
      "kinoa": ["CL"],                 // Chile
      "quínoa": ["ES"]                 // España (con tilde)
    }
  },

  // Salmón (producto salmon_003)
  "salmon": {
    canonical: "salmon",
    productId: "salmon_003",
    synonyms: {
      "salmón": ["MX", "ES", "CO", "AR", "VE", "EC"],   // Español universal
      "salmão": ["BR"]                                   // Brasil
    }
  },

  // Almendras (producto almonds_004)
  "almonds": {
    canonical: "almonds",
    productId: "almonds_004",
    synonyms: {
      "almendras": ["MX", "ES", "CO", "AR", "VE", "EC"], // Español universal
      "amêndoas": ["BR"]                                  // Brasil
    }
  },

  // Arándanos (producto blueberries_005)
  "blueberries": {
    canonical: "blueberries",
    productId: "blueberries_005",
    synonyms: {
      "arándanos": ["ES", "MX", "CO", "AR"],   // Español general
      "arándanos azules": ["ES"],              // España específico
      "mirtilo": ["AR", "UY"],                 // Rioplatense
      "blueberry": ["US", "GB"]                // Inglés singular
    }
  },

  // Papa dulce (producto sweet_potato_006)
  "sweet potato": {
    canonical: "sweet potato",
    productId: "sweet_potato_006",
    synonyms: {
      "batata": ["AR", "UY"],     // Argentina, Uruguay
      "boniato": ["ES"],          // España
      "camote": ["MX", "PE"],     // México, Perú
      "ñame": ["CO", "VE"],       // Colombia, Venezuela
      "papa dulce": ["CL", "EC"], // Chile, Ecuador
      "batatinha doce": ["BR"]    // Brasil
    }
  },

  // Yogur griego (producto greek_yogurt_007)
  "greek yogurt": {
    canonical: "greek yogurt", 
    productId: "greek_yogurt_007",
    synonyms: {
      "yogur griego": ["ES", "MX", "CO", "AR"], // Español
      "yogurt griego": ["MX", "VE"],           // Variante ortográfica
      "yoghurt griego": ["AR", "UY"],          // Rioplatense
      "iogurte grego": ["BR"]                  // Brasil
    }
  },

  // Semillas de chía (producto chia_seeds_008)
  "chia seeds": {
    canonical: "chia seeds",
    productId: "chia_seeds_008",
    synonyms: {
      "semillas de chía": ["MX", "ES", "CO", "AR"], // Español
      "chía": ["MX", "GT", "SV"],                   // Centroamérica (nombre corto)
      "sementes de chia": ["BR"]                    // Brasil
    }
  },

  // Papas fritas (producto chips_009)
  "potato chips": {
    canonical: "potato chips",
    productId: "chips_009",
    synonyms: {
      "papas fritas": ["MX", "CO", "VE", "EC"], // América Latina
      "patatas fritas": ["ES"],                  // España
      "papitas": ["AR", "CL", "UY"],            // Cono Sur
      "chips": ["US", "GB"],                    // Inglés coloquial
      "batata frita": ["BR"]                    // Brasil
    }
  },

  // PRODUCTOS AGREGADOS CON MUCHOS REGIONALISMOS:

  // Palomitas de maíz (producto popcorn_016)
  "popcorn": {
    canonical: "popcorn",
    productId: "popcorn_016",
    synonyms: {
      "palomitas": ["MX", "ES", "VE", "CO"],        // México, España, Venezuela, Colombia
      "pochoclo": ["AR", "UY"],                     // Argentina, Uruguay
      "pororó": ["BR"],                             // Brasil
      "canguil": ["EC"],                            // Ecuador
      "cotufas": ["VE"],                            // Venezuela (regional)
      "crispetas": ["CO"],                          // Colombia
      "cabritas": ["CL", "PE"],                     // Chile, Perú
      "rositas de maíz": ["MX", "GT", "SV"],       // México, Guatemala, El Salvador
      "maíz pira": ["CO"],                          // Colombia (rural)
      "pipoca": ["BR"]                              // Brasil (variante)
    }
  },

  // Lulo (producto lulo_017)
  "lulo": {
    canonical: "lulo",
    productId: "lulo_017",
    synonyms: {
      "naranjilla": ["EC", "PE"],                   // Ecuador, Perú
      "nuquí": ["CO"],                              // Colombia (regional)
      "obando": ["CO"],                             // Colombia (variante)
      "tomate de árbol pequeño": ["VE"],            // Venezuela (descriptivo)
      "golden fruit": ["US", "GB"]                  // Inglés comercial
    }
  },

  // Maíz (producto corn_018)
  "corn": {
    canonical: "corn",
    productId: "corn_018",
    synonyms: {
      "maíz": ["MX", "ES", "CO", "AR", "VE", "EC"], // Español universal
      "choclo": ["AR", "CL", "PE", "BO", "EC"],     // Cono Sur y Andes
      "elote": ["MX", "GT", "SV", "HN"],            // México y Centroamérica
      "jojoto": ["VE"],                             // Venezuela
      "mazorca": ["CO", "VE", "PA"],                // Colombia, Venezuela, Panamá
      "milho": ["BR"],                              // Brasil
      "sara": ["PE", "BO"]                          // Perú, Bolivia (quechua)
    }
  },

  // Mango (producto mango_019)
  "mango": {
    canonical: "mango",
    productId: "mango_019",
    synonyms: {
      "mango": ["MX", "ES", "CO", "AR", "VE", "EC", "PE"], // Universal
      "manga": ["BR"],                              // Brasil
      "mangue": ["BR"]                              // Brasil (variante)
    }
  },

  // Frijoles (producto beans_020)
  "black beans": {
    canonical: "black beans",
    productId: "beans_020",
    synonyms: {
      "frijoles negros": ["MX", "CO", "VE", "GT"],  // México, Colombia, Venezuela, Guatemala
      "judías negras": ["ES"],                      // España
      "porotos negros": ["AR", "CL", "UY"],         // Cono Sur
      "caraotas negras": ["VE"],                    // Venezuela
      "habichuelas negras": ["DO", "PR", "CU"],     // Caribe
      "feijão preto": ["BR"],                       // Brasil
      "fréjoles negros": ["PE", "EC"]               // Perú, Ecuador
    }
  },

  // Tomate (producto tomato_021)
  "tomato": {
    canonical: "tomato",
    productId: "tomato_021",
    synonyms: {
      "tomate": ["MX", "ES", "CO", "AR", "VE", "EC"], // Español universal
      "jitomate": ["MX"],                           // México (regional)
      "tomatinho": ["BR"],                          // Brasil (pequeño)
      "tomate cherry": ["AR", "CL", "UY"]           // Cono Sur (cherry)
    }
  },

  // Papaya (producto papaya_022)
  "papaya": {
    canonical: "papaya",
    productId: "papaya_022",
    synonyms: {
      "papaya": ["MX", "CO", "VE", "EC", "PE"],     // América Latina
      "lechoza": ["VE"],                            // Venezuela
      "fruta bomba": ["CU"],                        // Cuba
      "mamão": ["BR"],                              // Brasil
      "papaw": ["US"]                               // Estados Unidos (sur)
    }
  },

  // Plátano macho (producto plantain_023)
  "plantain": {
    canonical: "plantain",
    productId: "plantain_023",
    synonyms: {
      "plátano macho": ["MX", "CO", "VE", "EC"],    // América Latina
      "plátano verde": ["PE", "BO"],                // Perú, Bolivia
      "plátano de freír": ["ES"],                   // España
      "banana da terra": ["BR"],                    // Brasil
      "hartón": ["CO", "VE"]                        // Colombia, Venezuela (variedad)
    }
  },

  // Cacao (producto cacao_024)
  "raw cacao": {
    canonical: "raw cacao",
    productId: "cacao_024",
    synonyms: {
      "cacao crudo": ["MX", "ES", "CO", "VE"],      // Español
      "cacao en grano": ["PE", "EC", "CO"],         // Países productores
      "cacau": ["BR"],                              // Brasil
      "theobroma": ["ES"]                           // España (científico)
    }
  },

  // Piña (producto pineapple_025)
  "pineapple": {
    canonical: "pineapple",
    productId: "pineapple_025",
    synonyms: {
      "piña": ["MX", "ES", "CO", "VE", "EC", "PE"], // Español
      "ananá": ["AR", "UY", "PY"],                  // Cono Sur
      "ananás": ["BR"],                             // Brasil
      "abacaxi": ["BR"]                             // Brasil (más común)
    }
  },

  // Yuca (producto yuca_026)
  "cassava": {
    canonical: "cassava",
    productId: "yuca_026",
    synonyms: {
      "yuca": ["MX", "CO", "VE", "EC", "PE"],       // América Latina
      "mandioca": ["AR", "UY", "PY", "BR"],         // Cono Sur y Brasil
      "casabe": ["VE", "CO"],                       // Venezuela, Colombia (procesada)
      "aipim": ["BR"],                              // Brasil (regional)
      "macaxeira": ["BR"],                          // Brasil (noreste)
      "guacamota": ["VE"]                           // Venezuela (regional)
    }
  }

  // Los siguientes productos tienen muchas variaciones regionales importantes
};

// Construir índice de búsqueda optimizado
function buildSearchIndex(): SynonymDatabase {
  const searchIndex: { [key: string]: SynonymEntry } = {};
  const metadata: SynonymDatabase['metadata'] = {};
  
  Object.entries(synonymsData).forEach(([canonical, data]) => {
    // Usar productId del producto real si existe, sino generar uno temporal
    const productId = data.productId || `temp_${canonical.replace(/\s+/g, '_')}`;
    
    // Agregar término canónico al índice
    searchIndex[canonical.toLowerCase()] = {
      canonical,
      productId,
      confidence: 1.0 // Término principal
    };
    
    // Agregar sinónimos al índice
    Object.entries(data.synonyms).forEach(([synonym, regions]) => {
      searchIndex[synonym.toLowerCase()] = {
        canonical,
        productId,
        confidence: 0.9, // Sinónimo directo
        regionInfo: {
          region: regions[0], // Primera región como principal
          country: getCountryName(regions[0]),
          language: regions[0].length === 2 ? 'es' : 'en'
        }
      };
    });
    
    // Agregar metadata para gestión
    metadata[productId] = {
      canonical,
      regions: data.synonyms
    };
  });

  return { searchIndex, metadata };
}

// Helper para obtener nombre del país
function getCountryName(regionCode: string): string {
  const countries: { [key: string]: string } = {
    'AR': 'Argentina', 'MX': 'México', 'ES': 'España', 'CO': 'Colombia',
    'EC': 'Ecuador', 'PE': 'Perú', 'CL': 'Chile', 'VE': 'Venezuela',
    'UY': 'Uruguay', 'PY': 'Paraguay', 'DO': 'República Dominicana',
    'GT': 'Guatemala', 'SV': 'El Salvador', 'BR': 'Brasil',
    'US': 'Estados Unidos', 'GB': 'Reino Unido'
  };
  return countries[regionCode] || regionCode;
}

// Exportar la base de datos construida
export const SYNONYM_DATABASE = buildSearchIndex();

// Exportar función para testing
export { buildSearchIndex };