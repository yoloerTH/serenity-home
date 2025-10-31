-- Migration: Add product_variant column to order_items table
-- This allows storing variant information (e.g., "Lavender", "12-Piece Set") for products with variants
-- Run this in your Supabase SQL Editor

-- Add product_variant column to order_items table
ALTER TABLE order_items
ADD COLUMN IF NOT EXISTS product_variant TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN order_items.product_variant IS 'Stores the variant name for products that have variants (e.g., Essential Oils - Lavender)';

-- Create an index for faster queries on variant
CREATE INDEX IF NOT EXISTS idx_order_items_product_variant
ON order_items(product_variant)
WHERE product_variant IS NOT NULL;

-- Update existing rows to have NULL for product_variant (this is the default behavior)
-- No data migration needed as this is a new feature

-- Verification query (optional - you can run this to verify the column was added)
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'order_items'
-- AND column_name = 'product_variant';
