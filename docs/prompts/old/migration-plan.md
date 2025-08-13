
# Enhanced Food Database Migration Plan

## Overview
This document outlines the migration from a file-based product system to a fully normalized Supabase database architecture.

## Current State
- Products stored in static TypeScript files (`src/data/products.ts`)
- User preferences stored in memory
- No real-time updates or persistence
- Limited internationalization support

## Target State
- Normalized relational database in Supabase
- Real-time data synchronization
- Full internationalization support
- User authentication and preferences
- Performance optimized with proper indexes

## Migration Phases

### Phase 1: Database Schema Creation ✅ COMPLETED
Create the normalized database schema with all reference tables and relationships.

**Tables Created:**
- Reference tables: `categories`, `vitamins`, `minerals`, `processing_levels`, `processing_indicators`, `allergens`
- Main product table: `products`
- Nutrition tables: `product_nutrition`, `product_nutrition_facts`
- Junction tables: `product_allergens`, `product_processing_indicators`, `product_relationships`
- User system: `user_profiles`, `user_favorites`
- Translation system: `languages`, `translations`

**Reference Data Inserted:**
- 12 product categories (vegetables, fruits, grains, etc.)
- 12 vitamins (vitamin_c, vitamin_k, folate, etc.)
- 9 minerals (potassium, iron, calcium, etc.)
- 3 processing levels (minimal, processed, ultra-processed)
- 60+ processing indicators (natural_food, artificial_colors, etc.)
- 18 allergens mapped to boolean properties (gluten, lactose, vegan, etc.)

### Phase 2: Data Migration (Next)
Migrate existing product data from TypeScript files to Supabase tables.

**Migration Steps:**
1. Create data migration script to insert all products
2. Map product categories to database IDs
3. Insert nutrition data for each product with proper JSONB structure
4. Map allergen boolean properties to allergen relationships
5. Insert processing indicators for each product
6. Create product relationships (similar products)

### Phase 3: Code Refactoring (Pending)
Update application code to use Supabase instead of static files.

**Code Changes:**
1. Create Supabase query functions to replace current data access
2. Update React components to use async data loading
3. Implement proper error handling and loading states
4. Update TypeScript types to match database schema
5. Implement caching strategies with React Query

### Phase 4: Translation Migration (Pending)
Move i18n translations to database for dynamic content management.

**Translation Updates:**
1. Extract all hardcoded strings to translation keys
2. Populate translations table with content
3. Update translation hooks to use database
4. Implement fallback mechanisms

### Phase 5: Recipe System (Future)
Add recipe functionality as a separate migration when ready.

**Recipe Features:**
1. Recipe categories and assignments
2. User-created recipes
3. Recipe nutrition analysis
4. Recipe recommendations

### Phase 6: User Authentication (Future)
Add user authentication and preferences storage.

**User Features:**
1. User authentication with Supabase Auth
2. User preferences and favorites persistence
3. Personalized recommendations
4. User activity tracking

## Database Schema Highlights

### Normalization Benefits
- **Categories**: Centralized category management
- **Vitamins/Minerals**: Reusable vitamin and mineral references
- **Processing Levels**: Standardized NOVA classification
- **Health Rankings**: Consistent 1-10 health scoring system
- **Allergens**: Flexible allergen system supporting multiple categories

### Translation System
- **Dynamic Content**: All text stored in database
- **Multi-language**: Easy addition of new languages (English/Spanish ready)
- **Fallback Support**: Graceful degradation for missing translations

### Performance Optimizations
- **Strategic Indexes**: Optimized for common query patterns
- **JSONB Indexes**: GIN indexes for nutrition data queries
- **Foreign Keys**: Maintain data integrity
- **Unique Constraints**: Prevent duplicate data

## Current Migration Status

✅ **Phase 1 COMPLETE**: Database schema created and deployed to Supabase
- All tables created successfully
- All reference data inserted
- Indexes optimized for performance
- Ready for data migration

🔄 **Next Steps**:
1. Create product data migration script
2. Test data migration with sample products
3. Implement Supabase query functions
4. Update components to use database

## Rollback Plan

If issues arise during migration:
1. Database can be easily dropped and recreated
2. Original TypeScript files remain as backup
3. Application can revert to file-based system
4. Gradual rollout allows for safe testing

## Migration Timeline

- **Phase 1**: Database Schema (1 day) ✅ COMPLETE
- **Phase 2**: Data Migration (1-2 days) 🔄 NEXT
- **Phase 3**: Code Refactoring (2-3 days)
- **Phase 4**: Translation Migration (1 day)
- **Phase 5**: Recipe System (2-3 days) - Future
- **Phase 6**: User Authentication (2-3 days) - Future

**Total Estimated Time for Core Migration**: 4-6 days
