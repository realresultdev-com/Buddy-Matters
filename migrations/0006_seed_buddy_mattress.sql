-- 0006_seed_buddy_mattress.sql
-- Seed categories and authentic Buddy Mattress products with trending flags

INSERT OR IGNORE INTO categories (id, name) VALUES
  ('cat_mattresses', 'Mattresses'),
  ('cat_pillows', 'Pillows & Cushions'),
  ('cat_bedding', 'Bedding & Protectors');

INSERT OR REPLACE INTO products (id, name, description, price, stock, images, category_id, is_trending) VALUES
  (
    'prod_ortho_memory',
    'Buddy Orthopedic Memory Foam Mattress',
    'Doctor-recommended ergonomic spinal alignment mattress with 3-zone high-density pressure-relieving memory foam and breathable bamboo fabric cover.',
    12999,
    25,
    '["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=1200&auto=format&fit=crop&q=80"]',
    'cat_mattresses',
    1
  ),
  (
    'prod_dual_comfort',
    'Buddy Dual Comfort Reversible Mattress',
    'Experience the luxury of dual sides — soft plush foam on one side and firm orthopedic support on the other. 10-year warranty with 100-night risk-free trial.',
    10499,
    30,
    '["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=1200&auto=format&fit=crop&q=80"]',
    'cat_mattresses',
    1
  ),
  (
    'prod_cooling_pillow',
    'Buddy Cooling Gel Contour Cervical Pillow',
    'Engineered with premium memory foam embedded with thermoregulating cooling gel beads. Provides therapeutic neck and cervical spine support.',
    1899,
    40,
    '["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1584949597989-5369680387ca?w=1200&auto=format&fit=crop&q=80"]',
    'cat_pillows',
    1
  ),
  (
    'prod_latex_hybrid',
    'Buddy Natural Latex Hybrid Spring Mattress',
    'Eco-friendly 100% natural organic Pinocore latex paired with individually encased pocket springs for zero-motion transfer and buoyant bounce.',
    18499,
    18,
    '["https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=1200&auto=format&fit=crop&q=80"]',
    'cat_mattresses',
    0
  ),
  (
    'prod_waterproof_protector',
    'Buddy Breathable 100% Waterproof Mattress Protector',
    'Fitted terry cotton waterproof mattress protector with TPU membrane barrier against spills, dust mites, bacteria, and allergens.',
    1299,
    50,
    '["https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=1200&auto=format&fit=crop&q=80"]',
    'cat_bedding',
    0
  ),
  (
    'prod_shredded_pillow',
    'Buddy Adjustable Shredded Memory Foam Pillow',
    'Customizable loft height with removable cooling memory foam fill and ultra-soft washable jacquard zipper case.',
    1499,
    35,
    '["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200&auto=format&fit=crop&q=80"]',
    'cat_pillows',
    0
  );
