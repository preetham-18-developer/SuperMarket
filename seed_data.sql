-- SEED CATEGORIES
INSERT INTO categories (name, slug, bg_color) VALUES
('Fruits & Vegetables', 'fruits-vegetables', '#f0fff4'),
('Dairy & Bakery', 'dairy-bakery', '#fffaf0'),
('Snacks', 'snacks', '#fff5f5'),
('Beverages', 'beverages', '#f0faff'),
('Household', 'household', '#f5f5ff');

-- SEED PRODUCTS (Using category matching bg_colors from the ref image)
-- Note: Assuming some public image URLs for placeholders, in production these would be Supabase Storage URLs.
WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO products (category_id, name, slug, price, discount_percent, stock, image_url, made_by, is_featured)
SELECT 
  id, 
  'Organic Italian Coffee', 
  'organic-italian-coffee', 
  12.00, 
  0, 
  50, 
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop', 
  'Italian Roasters', 
  true
FROM cat WHERE slug = 'beverages'
UNION ALL
SELECT 
  id, 
  'Viennese Special Blend', 
  'viennese-special-blend', 
  9.00, 
  10, 
  30, 
  'https://images.unsplash.com/photo-1580933128244-84cee8ff462e?q=80&w=800&auto=format&fit=crop', 
  'Vienna Coffee Co', 
  true
FROM cat WHERE slug = 'beverages'
UNION ALL
SELECT 
  id, 
  'New Orleans Dark Roast', 
  'new-orleans-dark-roast', 
  13.00, 
  0, 
  40, 
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop', 
  'NOLA Coffee', 
  true
FROM cat WHERE slug = 'beverages'
UNION ALL
SELECT 
  id, 
  'Moroccan Spiced', 
  'moroccan-spiced', 
  14.00, 
  5, 
  25, 
  'https://images.unsplash.com/photo-1544787210-28271d7b60aa?q=80&w=800&auto=format&fit=crop', 
  'Atlas Spices', 
  true
FROM cat WHERE slug = 'beverages'
UNION ALL
-- Snacks
SELECT 
  id, 
  'Premium Kurkure Treats', 
  'kurkure-treats', 
  2.50, 
  0, 
  100, 
  'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?q=80&w=800&auto=format&fit=crop', 
  'Snack Foods Inc', 
  true
FROM cat WHERE slug = 'snacks';
