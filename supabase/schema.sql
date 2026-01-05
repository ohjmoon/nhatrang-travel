-- Nha Trang Travel Planner Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create place_type enum
CREATE TYPE place_type AS ENUM ('restaurant', 'attraction', 'activity', 'shopping');

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type place_type NOT NULL,
  slug VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  name_ko VARCHAR(100) NOT NULL,
  icon VARCHAR(10),
  sort_order INTEGER DEFAULT 0,
  UNIQUE(type, slug)
);

-- Places table (unified for all types)
CREATE TABLE places (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type place_type NOT NULL,
  category VARCHAR(50) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  name_ko VARCHAR(200) NOT NULL,
  description TEXT,
  address TEXT,
  location VARCHAR(200),
  hours VARCHAR(200),
  price VARCHAR(100),
  price_min INTEGER,
  price_max INTEGER,
  duration VARCHAR(100),
  tips TEXT,
  features TEXT[],
  recommended_items TEXT[],
  coordinates JSONB,
  thumbnail TEXT,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  -- Google Places integration
  google_place_id TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  google_rating DECIMAL(2, 1),
  google_reviews_count INTEGER,
  phone VARCHAR(50),
  website TEXT,
  google_synced_at TIMESTAMP WITH TIME ZONE
);

-- Place images table (multiple images per place)
CREATE TABLE place_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  is_thumbnail BOOLEAN DEFAULT false
);

-- Indexes for better query performance
CREATE INDEX idx_places_type ON places(type);
CREATE INDEX idx_places_category ON places(category);
CREATE INDEX idx_places_type_category ON places(type, category);
CREATE INDEX idx_places_is_published ON places(is_published);
CREATE INDEX idx_places_google_place_id ON places(google_place_id);
CREATE INDEX idx_places_coordinates ON places(latitude, longitude);
CREATE INDEX idx_place_images_place_id ON place_images(place_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to places table
CREATE TRIGGER update_places_updated_at
  BEFORE UPDATE ON places
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public can read published places" ON places
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read place images" ON place_images
  FOR SELECT USING (true);

CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);

-- Admin policies (authenticated users with admin role)
-- Note: You'll need to create an admin role or use service key for admin operations

CREATE POLICY "Admin full access to places" ON places
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to place_images" ON place_images
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default categories
INSERT INTO categories (type, slug, name, name_ko, icon, sort_order) VALUES
  -- Restaurant categories
  ('restaurant', 'korean', 'Korean', '한식', '🍚', 1),
  ('restaurant', 'vietnamese', 'Vietnamese', '베트남음식', '🍜', 2),
  ('restaurant', 'seafood', 'Seafood', '해산물', '🦐', 3),
  ('restaurant', 'cafe', 'Cafe', '카페', '☕', 4),
  ('restaurant', 'bar', 'Bar/Pub', '바/펍', '🍺', 5),
  ('restaurant', 'western', 'Western', '양식', '🍝', 6),
  ('restaurant', 'japanese', 'Japanese', '일식', '🍣', 7),
  ('restaurant', 'etc', 'Others', '기타', '🍴', 8),
  -- Attraction categories
  ('attraction', 'island', 'Island/Beach', '섬/해변', '🏖️', 1),
  ('attraction', 'nature', 'Nature/Waterfall', '자연/폭포', '🌿', 2),
  ('attraction', 'culture', 'Culture/History', '문화/역사', '🏛️', 3),
  ('attraction', 'theme-park', 'Theme Park', '테마파크', '🎢', 4),
  -- Activity categories
  ('activity', 'water', 'Water Activity', '수상 액티비티', '🌊', 1),
  ('activity', 'spa', 'Spa/Healing', '스파/힐링', '🧖', 2),
  ('activity', 'tour', 'Day Tour', '근교 투어', '🚗', 3),
  ('activity', 'party', 'Party/Nightlife', '파티/나이트', '🎉', 4),
  -- Shopping categories
  ('shopping', 'mart', 'Supermarket', '대형마트', '🏪', 1),
  ('shopping', 'mall', 'Shopping Mall', '쇼핑몰', '🏬', 2),
  ('shopping', 'market', 'Traditional Market', '전통시장', '🏮', 3),
  ('shopping', 'night-market', 'Night Market', '야시장', '🌙', 4);

-- Itineraries table for saved travel plans
CREATE TABLE itineraries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days JSONB NOT NULL,
  total_places INTEGER DEFAULT 0,
  thumbnail TEXT
);

-- Index for itineraries
CREATE INDEX idx_itineraries_dates ON itineraries(start_date, end_date);

-- Updated_at trigger for itineraries
CREATE TRIGGER update_itineraries_updated_at
  BEFORE UPDATE ON itineraries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS for itineraries
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read itineraries" ON itineraries
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert itineraries" ON itineraries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update itineraries" ON itineraries
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete itineraries" ON itineraries
  FOR DELETE USING (true);

-- ============================================
-- Accommodations Table
-- ============================================

-- Create area enum for accommodations
CREATE TYPE accommodation_area AS ENUM ('camranh', 'city', 'vinpearl', 'honchong', 'ninhvan');

-- Create purpose enum for accommodations
CREATE TYPE accommodation_purpose AS ENUM ('family', 'couple', 'allinclusive', 'budget', 'residence');

-- Create price_range enum for accommodations
CREATE TYPE accommodation_price_range AS ENUM ('$', '$$', '$$$', '$$$$');

-- Accommodations table
CREATE TABLE accommodations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  name_ko VARCHAR(200) NOT NULL,
  area accommodation_area NOT NULL,
  area_name VARCHAR(50) NOT NULL,
  purposes accommodation_purpose[] NOT NULL,
  price_range accommodation_price_range NOT NULL,
  price_min INTEGER,
  price_max INTEGER,
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  description TEXT,
  features TEXT[],
  amenities TEXT[],
  thumbnail TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  is_new BOOLEAN DEFAULT false,
  open_year INTEGER,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  -- Google Places integration
  google_place_id TEXT,
  google_rating DECIMAL(2, 1),
  google_reviews_count INTEGER,
  phone VARCHAR(50),
  website TEXT,
  google_synced_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for accommodations
CREATE INDEX idx_accommodations_area ON accommodations(area);
CREATE INDEX idx_accommodations_price_range ON accommodations(price_range);
CREATE INDEX idx_accommodations_is_published ON accommodations(is_published);
CREATE INDEX idx_accommodations_is_new ON accommodations(is_new);
CREATE INDEX idx_accommodations_google_place_id ON accommodations(google_place_id);

-- Updated_at trigger for accommodations
CREATE TRIGGER update_accommodations_updated_at
  BEFORE UPDATE ON accommodations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS for accommodations
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published accommodations" ON accommodations
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admin full access to accommodations" ON accommodations
  FOR ALL USING (auth.role() = 'authenticated');

-- Storage bucket for images (run in Supabase Dashboard > Storage)
-- CREATE BUCKET 'place-images' with public access
