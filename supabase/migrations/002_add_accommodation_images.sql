-- Accommodation Images Table
-- Run this in Supabase SQL Editor

-- Create accommodation_images table (multiple images per accommodation)
CREATE TABLE IF NOT EXISTS accommodation_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accommodation_id UUID NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  is_thumbnail BOOLEAN DEFAULT false
);

-- Index for accommodation_images
CREATE INDEX IF NOT EXISTS idx_accommodation_images_accommodation_id ON accommodation_images(accommodation_id);

-- RLS for accommodation_images
ALTER TABLE accommodation_images ENABLE ROW LEVEL SECURITY;

-- Public read access policy
CREATE POLICY "Public can read accommodation images" ON accommodation_images
  FOR SELECT USING (true);

-- Admin policy
CREATE POLICY "Admin full access to accommodation_images" ON accommodation_images
  FOR ALL USING (auth.role() = 'authenticated');
