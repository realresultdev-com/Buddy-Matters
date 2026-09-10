-- 0003_buddy_mattress_data.sql
-- Replace outdated electronics demo data with authentic, production-ready Buddy Mattress products and categories

-- Clean existing demo products and categories
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM categories;

-- 1. Real Buddy Mattress Categories
INSERT INTO categories (id, name) VALUES
  ('cat-ortho', 'Orthopedic Mattresses'),
  ('cat-memory', 'Memory Foam Mattresses'),
  ('cat-hybrid', 'Pocket Spring & Hybrid'),
  ('cat-pillows', 'Ergonomic Pillows'),
  ('cat-protectors', 'Mattress Protectors'),
  ('cat-bedding', 'Bedding & Toppers');

-- 2. Authentic Buddy Mattress Products
INSERT INTO products (id, name, description, price, stock, images, category_id) VALUES
  (
    'prod-bm-1',
    'Buddy Orthopedic Dual-Comfort Memory Foam Mattress (King / Queen)',
    'Engineered with dual-firmness zones: gentle soft memory foam on one side and high-density orthopedic spine support on the reverse. High-breathability knitted jacquard fabric with anti-microbial treatment. Backed by a 100-Night Risk-Free Trial and 10-Year Warranty.',
    14499,
    45,
    '["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80"]',
    'cat-ortho'
  ),
  (
    'prod-bm-2',
    'Buddy SpinePro 3-Zone Pocket Spring Hybrid Mattress (6 & 8 Inch)',
    'Individual zero-partner-disturbance pocketed coils paired with adaptive pressure-relieving transition foam. Targeted 3-zone lumbar contouring relieves lower back tension. Enhanced edge-support encased perimeter.',
    18999,
    30,
    '["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&auto=format&fit=crop&q=80"]',
    'cat-hybrid'
  ),
  (
    'prod-bm-3',
    'Buddy AirBreeze 100% Eco-Certified Natural Latex Mattress',
    'Crafted from sustainably sourced organic pin-core natural latex. Offers buoyant, responsive push-back comfort with natural temperature regulation and hypoallergenic dust-mite resistance. 100% chemical-free sleep surface.',
    25999,
    20,
    '["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=800&auto=format&fit=crop&q=80"]',
    'cat-memory'
  ),
  (
    'prod-bm-4',
    'Buddy CloudSoft Ergonomic Cervical Memory Foam Pillow (Pack of 2)',
    'Contoured anatomical curve cradles the head and neck, promoting optimal spinal alignment for side, back, and stomach sleepers. Comes with removable washable ice-silk cooling pillowcases.',
    1899,
    80,
    '["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80"]',
    'cat-pillows'
  ),
  (
    'prod-bm-5',
    'Buddy CoolGel Infused Orthopedic Sleeping Pillow',
    'Slow-rebound high-density memory foam infused with active cooling gel beads. Dissipates trapped head heat for deep, sweat-free sleep all night long. OEKO-TEX certified skin-friendly fabric.',
    1199,
    65,
    '["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80"]',
    'cat-pillows'
  ),
  (
    'prod-bm-6',
    'Buddy 100% Waterproof Breathable Bamboo Mattress Protector',
    'Ultra-soft bamboo terry surface with noiseless TPU waterproof barrier. Protects against spills, dust mites, perspiration, and stains while preserving mattress breathability. Fitted 360-degree elastic skirt.',
    1499,
    100,
    '["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80"]',
    'cat-protectors'
  ),
  (
    'prod-bm-7',
    'Buddy UltraPlush 2-Inch Microfiber Mattress Topper (Hotel Comfort)',
    'Transform any firm mattress into a luxury 5-star hotel cloud bed. Box-stitched baffle design filled with 500 GSM virgin hollow microfiber for even loft distribution.',
    3299,
    35,
    '["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80"]',
    'cat-bedding'
  ),
  (
    'prod-bm-8',
    'Buddy Reversible Active-Cooling Gel Mattress (7-Zone Pressure Relief)',
    '7 ergonomically engineered transition cut-outs provide differential support to head, shoulders, lumbar, hips, and knees. Zero-motion transfer ensures uninterrupted restful sleep.',
    16499,
    28,
    '["https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80"]',
    'cat-ortho'
  );
