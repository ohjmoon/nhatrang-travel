-- Migration: Add Google Places fields to places table
-- Run this in Supabase SQL Editor

-- Add Google Places columns to places table
ALTER TABLE places ADD COLUMN IF NOT EXISTS google_place_id TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 7);
ALTER TABLE places ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 7);
ALTER TABLE places ADD COLUMN IF NOT EXISTS google_rating DECIMAL(2, 1);
ALTER TABLE places ADD COLUMN IF NOT EXISTS google_reviews_count INTEGER;
ALTER TABLE places ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE places ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS google_synced_at TIMESTAMP WITH TIME ZONE;

-- Create index on google_place_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_places_google_place_id ON places(google_place_id);

-- Create index on coordinates for location-based queries
CREATE INDEX IF NOT EXISTS idx_places_coordinates ON places(latitude, longitude);

-- Add same columns to accommodations table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'accommodations') THEN
    ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS google_place_id TEXT;
    ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 7);
    ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 7);
    ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS google_rating DECIMAL(2, 1);
    ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS google_reviews_count INTEGER;
    ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
    ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS website TEXT;
    ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS google_synced_at TIMESTAMP WITH TIME ZONE;

    CREATE INDEX IF NOT EXISTS idx_accommodations_google_place_id ON accommodations(google_place_id);
    CREATE INDEX IF NOT EXISTS idx_accommodations_coordinates ON accommodations(latitude, longitude);
  END IF;
END $$;

-- Create itineraries table for saved travel plans
CREATE TABLE IF NOT EXISTS itineraries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Basic info
  title VARCHAR(200) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- Itinerary data (JSON array of days with items)
  days JSONB NOT NULL,

  -- Meta info
  total_places INTEGER DEFAULT 0,
  thumbnail TEXT
);

-- Create index for itineraries
CREATE INDEX IF NOT EXISTS idx_itineraries_dates ON itineraries(start_date, end_date);

-- Apply updated_at trigger to itineraries
DROP TRIGGER IF EXISTS update_itineraries_updated_at ON itineraries;
CREATE TRIGGER update_itineraries_updated_at
  BEFORE UPDATE ON itineraries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS for itineraries (public read, auth for write)
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- Anyone can read itineraries
CREATE POLICY "Public can read itineraries" ON itineraries
  FOR SELECT USING (true);

-- Anyone can insert (password check is in API)
CREATE POLICY "Anyone can insert itineraries" ON itineraries
  FOR INSERT WITH CHECK (true);

-- Anyone can update (password check is in API)
CREATE POLICY "Anyone can update itineraries" ON itineraries
  FOR UPDATE USING (true);

-- Anyone can delete (password check is in API)
CREATE POLICY "Anyone can delete itineraries" ON itineraries
  FOR DELETE USING (true);
