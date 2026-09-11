-- Add offer badge prefix and value columns to categories table
ALTER TABLE categories ADD COLUMN offer_badge_prefix TEXT DEFAULT 'Starting';
ALTER TABLE categories ADD COLUMN offer_badge_value TEXT DEFAULT '';
