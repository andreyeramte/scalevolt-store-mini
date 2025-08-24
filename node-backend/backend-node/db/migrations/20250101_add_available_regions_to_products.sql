-- 20250101_add_available_regions_to_products.sql
-- Add available_regions column to products table for region-based filtering

-- Add the column with default value (available in both regions)
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS available_regions text[] DEFAULT ARRAY['PL','UA']::text[];

-- Create GIN index for faster array operations
CREATE INDEX IF NOT EXISTS idx_products_available_regions 
  ON public.products USING GIN (available_regions);

-- Update existing products to have the default value if they don't have it
UPDATE public.products 
SET available_regions = ARRAY['PL','UA']::text[] 
WHERE available_regions IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.products.available_regions IS 'Array of region codes where product is available. NULL or empty array means available everywhere.';
