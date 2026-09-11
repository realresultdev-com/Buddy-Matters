-- Add is_trending column to products table
ALTER TABLE products ADD COLUMN is_trending INTEGER DEFAULT 0;
