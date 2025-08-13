
-- Phase 1: Database Schema Creation
-- Enhanced Food Database Migration
-- This migration creates the complete database schema from scratch

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Reference Tables (must be created first due to foreign key dependencies)
CREATE TABLE categories (
                            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                            key TEXT UNIQUE NOT NULL,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE vitamins (
                          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          key TEXT UNIQUE NOT NULL,
                          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE minerals (
                          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          key TEXT UNIQUE NOT NULL,
                          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE processing_levels (
                                   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                   nova_level INTEGER NOT NULL CHECK (nova_level >= 1 AND nova_level <= 4),
                                   category TEXT NOT NULL,
                                   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE processing_indicators (
                                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                       key TEXT UNIQUE NOT NULL,
                                       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE nutrition_types (
                                 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                 key TEXT UNIQUE NOT NULL,
                                 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE health_rankings (
                                 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                 ranking INTEGER NOT NULL CHECK (ranking >= 1 AND ranking <= 10),
                                 description_key TEXT,
                                 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allergens Reference Table
CREATE TABLE allergens (
                           id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                           key TEXT UNIQUE NOT NULL,
                           name_key TEXT NOT NULL,
                           category TEXT NOT NULL CHECK (category IN ('allergen', 'dietary', 'certification', 'health')),
                           priority INTEGER NOT NULL DEFAULT 10,
                           created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Translation System
CREATE TABLE languages (
                           id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                           code TEXT UNIQUE NOT NULL,
                           name TEXT NOT NULL,
                           created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE translations (
                              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                              language_id UUID REFERENCES languages(id),
                              translation_key TEXT NOT NULL,
                              translation_value TEXT,
                              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                              UNIQUE(language_id, translation_key)
);

-- Main Product Table (depends on categories and processing_levels)
CREATE TABLE products (
                          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          legacy_id TEXT UNIQUE NOT NULL,
                          name_key TEXT,
                          image TEXT,
                          rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
                          category_id UUID REFERENCES categories(id),
                          processing_level_id UUID REFERENCES processing_levels(id),
                          description_key TEXT,
                          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consolidated Product Nutrition Table with JSON structure
CREATE TABLE product_nutrition (
                                   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                   product_id UUID REFERENCES products(id) ON DELETE CASCADE,
                                   nutrition_data JSONB NOT NULL DEFAULT '{}',
                                   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Updated product_nutrition_facts table with JSON structure
CREATE TABLE product_nutrition_facts (
                                         id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                         product_id UUID REFERENCES products(id) ON DELETE CASCADE,
                                         facts JSONB NOT NULL DEFAULT '{}',
                                         created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Allergens Junction Table (depends on products and allergens)
CREATE TABLE product_allergens (
                                   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                   product_id UUID REFERENCES products(id) ON DELETE CASCADE,
                                   allergen_id UUID REFERENCES allergens(id) ON DELETE CASCADE,
                                   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                                   UNIQUE(product_id, allergen_id)
);

-- Junction Tables (depend on products and reference tables)
CREATE TABLE product_processing_indicators (
                                               id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                               product_id UUID REFERENCES products(id) ON DELETE CASCADE,
                                               processing_indicator_id UUID REFERENCES processing_indicators(id),
                                               created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                                               UNIQUE(product_id, processing_indicator_id)
);

CREATE TABLE product_relationships (
                                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                       product_id UUID REFERENCES products(id) ON DELETE CASCADE,
                                       related_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
                                       relationship_type TEXT DEFAULT 'similar',
                                       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                                       UNIQUE(product_id, related_product_id)
);

-- Indexes for Performance (created after all tables exist)
CREATE INDEX idx_products_legacy_id ON products(legacy_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_processing_level ON products(processing_level_id);
CREATE INDEX idx_products_rating ON products(rating);

-- Consolidated nutrition table indexes
CREATE INDEX idx_product_nutrition_product ON product_nutrition(product_id);
CREATE INDEX idx_product_nutrition_data ON product_nutrition USING GIN (nutrition_data);

CREATE INDEX idx_product_nutrition_facts_product ON product_nutrition_facts(product_id);
CREATE INDEX idx_product_nutrition_facts_facts ON product_nutrition_facts USING GIN (facts);

-- Allergens indexes
CREATE INDEX idx_product_allergens_product ON product_allergens(product_id);
CREATE INDEX idx_product_allergens_allergen ON product_allergens(allergen_id);
CREATE INDEX idx_allergens_category ON allergens(category);
CREATE INDEX idx_allergens_priority ON allergens(priority);

CREATE INDEX idx_product_processing_indicators_product ON product_processing_indicators(product_id);
CREATE INDEX idx_product_processing_indicators_indicator ON product_processing_indicators(processing_indicator_id);

CREATE INDEX idx_product_relationships_product ON product_relationships(product_id);
CREATE INDEX idx_product_relationships_related ON product_relationships(related_product_id);

CREATE INDEX idx_translations_language ON translations(language_id);
CREATE INDEX idx_translations_key ON translations(translation_key);

-- Insert default data (order matters due to foreign key dependencies)
-- Insert languages first
INSERT INTO languages (code, name) VALUES
                                       ('en', 'English'),
                                       ('es', 'Español');

-- Insert health rankings
INSERT INTO health_rankings (ranking, description_key) VALUES
                                                           (1, 'health_ranking_1'),
                                                           (2, 'health_ranking_2'),
                                                           (3, 'health_ranking_3'),
                                                           (4, 'health_ranking_4'),
                                                           (5, 'health_ranking_5'),
                                                           (6, 'health_ranking_6'),
                                                           (7, 'health_ranking_7'),
                                                           (8, 'health_ranking_8'),
                                                           (9, 'health_ranking_9'),
                                                           (10, 'health_ranking_10');

-- Insert nutrition types
INSERT INTO nutrition_types (key) VALUES
                                      ('protein'),
                                      ('carbs'),
                                      ('fats'),
                                      ('fiber');

-- Insert common allergens
INSERT INTO allergens (key, name_key, category, priority) VALUES
                                                              ('gluten', 'allergen_gluten', 'allergen', 1),
                                                              ('lactose', 'allergen_lactose', 'allergen', 2),
                                                              ('nuts', 'allergen_nuts', 'allergen', 3),
                                                              ('eggs', 'allergen_eggs', 'allergen', 4),
                                                              ('fish', 'allergen_fish', 'allergen', 5),
                                                              ('soy', 'allergen_soy', 'allergen', 6),
                                                              ('shellfish', 'allergen_shellfish', 'allergen', 7),
                                                              ('sesame', 'allergen_sesame', 'allergen', 8),
                                                              ('meat', 'dietary_meat', 'dietary', 9),
                                                              ('dairy', 'dietary_dairy', 'dietary', 10),
                                                              ('animal_products', 'dietary_animal_products', 'dietary', 11),
                                                              ('sugar', 'health_sugar', 'health', 12),
                                                              ('sodium', 'health_sodium', 'health', 13),
                                                              ('artificial_additives', 'health_artificial_additives', 'health', 14);
