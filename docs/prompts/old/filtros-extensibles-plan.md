
# Plan de Sistema de Filtros Extensible

## Objetivo
Crear un sistema de filtros flexible y escalable que permita agregar nuevos tipos de filtros con el mínimo cambio posible en la lógica existente, utilizando el patrón de Inversión de Control.

## Arquitectura Implementada

### 1. Abstracciones Base (`src/types/search.ts`)
- **Searchable**: Interface base para todos los elementos filtrables
- **FilterCriteria**: Define criterios de filtrado con operadores
- **QueryOptions**: Opciones de búsqueda y filtrado
- **QueryResult**: Resultado de consultas con metadatos
- **FilterDefinition**: Definición de filtros reutilizables

### 2. Motor de Consultas (`src/services/QueryEngine.ts`)
- **QueryEngine**: Clase genérica para ejecutar consultas
- Registro dinámico de filtros
- Aplicación de búsqueda de texto
- Sistema de ordenamiento
- Completamente desacoplado de tipos específicos

### 3. Servicio de Filtros (`src/services/FilterService.ts`)
- Instancia global del QueryEngine
- Registro de filtros predefinidos:
  - CategoryFilter
  - AllergenFilter  
  - RatingFilter
  - NutritionFilter

### 4. Componente de Vista de Datos (`src/components/DataView.tsx`)
- Componente genérico y reutilizable
- Paginación integrada
- Búsqueda de texto
- Panel de filtros expandible
- Renderizado pluggable de elementos

### 5. Sistema de Filtros Modulares
- **FilterPanel**: Contenedor de filtros con toggle
- **AllergenFilter**: Filtro de alérgenos con iconos
- **CategoryFilter**: Filtro por categorías
- **RatingFilter**: Filtro por calificación mínima
- **NutritionFilter**: Filtros nutricionales con rangos

## Beneficios Logrados

### ✅ Extensibilidad
- Agregar nuevos filtros solo requiere crear el componente y registrarlo
- No se modifica código existente

### ✅ Reutilización
- DataView funciona con cualquier tipo de datos que implemente Searchable
- Filtros pueden reutilizarse en diferentes contextos

### ✅ Inversión de Control
- Los componentes no conocen la lógica de filtrado
- El QueryEngine maneja toda la complejidad

### ✅ Mantenibilidad
- Separación clara de responsabilidades
- Código modular y testeable

## Próximos Pasos

### Fase Actual: Correcciones
1. ✅ Crear documentación del plan
2. 🔧 Arreglar aplicación automática de filtros
3. 🔧 Solucionar problema de scroll en pantallas pequeñas
4. 🔧 Mejorar UX del panel de filtros

### Futuras Mejoras
1. **BarcodeScanner Filter**: Para filtrar por código de barras
2. **DateFilter**: Para productos con fechas de vencimiento
3. **PriceFilter**: Si se agregan precios a los productos
4. **CompoundFilters**: Filtros que combinan múltiples criterios
5. **SavedFilters**: Guardar combinaciones de filtros favoritas
6. **FilterPresets**: Filtros predefinidos (ej: "Vegano y Sin Gluten")

## Arquitectura Final Objetivo

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   SearchBar     │    │   FilterPanel    │    │   DataView      │
│                 │    │                  │    │                 │
│ - Text Search   │    │ - AllergenFilter │    │ - Generic List  │
│ - Quick Filters │    │ - CategoryFilter │    │ - Pagination    │
│                 │    │ - NutritionFilter│    │ - Sorting       │
└─────────┬───────┘    └─────────┬────────┘    └─────────┬───────┘
          │                      │                       │
          │                      │                       │
          └──────────────────────┼───────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     QueryEngine         │
                    │                         │
                    │ - executeQuery()        │
                    │ - registerFilter()      │
                    │ - Text + Filter Logic   │
                    └─────────────────────────┘
```

Este diseño permite:
- **Crecimiento sin fricción**: Nuevos filtros se agregan sin tocar código existente
- **Reutilización máxima**: Componentes trabajan con cualquier tipo de datos
- **Mantenimiento simplificado**: Lógica centralizada y modular
- **Testing facilitado**: Cada pieza es independiente y testeable
