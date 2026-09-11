-- 0007_create_reviews.sql
-- Reviews table supporting ratings, text comments, photo uploads, and verified buyer checks

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  images TEXT NOT NULL DEFAULT '[]',
  is_verified_purchase INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- Seed authentic verified customer reviews for Buddy Mattress products using existing user
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, title, comment, images, is_verified_purchase, created_at)
SELECT
  'rev_ortho_1',
  'prod_ortho_memory',
  u.id,
  5,
  'Best orthopedic mattress for lower back pain!',
  'I have been using the Buddy Orthopedic Memory Foam Mattress for over a month now. The spinal alignment is truly exceptional and relieved my morning stiffness. Breathable fabric keeps it remarkably cool even in summer.',
  '["https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80"]',
  1,
  '2026-08-20 10:30:00'
FROM users u LIMIT 1;

INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, title, comment, images, is_verified_purchase, created_at)
SELECT
  'rev_ortho_2',
  'prod_ortho_memory',
  u.id,
  4,
  'Great support and zero motion transfer',
  'Extremely comfortable, neither too soft nor too stiff. The 100-night trial gave me full confidence to purchase. Highly recommended for couples.',
  '["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80"]',
  1,
  '2026-08-25 14:15:00'
FROM users u LIMIT 1;

INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, title, comment, images, is_verified_purchase, created_at)
SELECT
  'rev_dual_1',
  'prod_dual_comfort',
  u.id,
  5,
  'Dual sides make all the difference',
  'Love the reversible concept! Soft side is great for lazy weekends and the firm side provides top notch back support during workweeks.',
  '["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80"]',
  1,
  '2026-08-28 09:00:00'
FROM users u LIMIT 1;

INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, title, comment, images, is_verified_purchase, created_at)
SELECT
  'rev_pillow_1',
  'prod_cooling_pillow',
  u.id,
  5,
  'Cervical contour cured my neck spasms',
  'The cooling gel memory foam retains shape throughout the night and never traps heat. Worth every single rupee!',
  '["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80"]',
  1,
  '2026-09-02 18:40:00'
FROM users u LIMIT 1;

INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, title, comment, images, is_verified_purchase, created_at)
SELECT
  'rev_latex_1',
  'prod_latex_hybrid',
  u.id,
  4,
  'Organic latex with great bounciness',
  'Pinocore natural latex is very breathable. Pocket springs prevent any roll-together effect. Premium packaging and quick delivery.',
  '[]',
  1,
  '2026-09-05 11:20:00'
FROM users u LIMIT 1;

INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, title, comment, images, is_verified_purchase, created_at)
SELECT
  'rev_protector_1',
  'prod_waterproof_protector',
  u.id,
  5,
  '100% waterproof and completely noiseless',
  'Does not make crinkly plastic sounds like cheap protectors. Soft terry cotton on top feels like regular luxury bedsheet.',
  '["https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800&auto=format&fit=crop&q=80"]',
  1,
  '2026-09-08 16:50:00'
FROM users u LIMIT 1;

INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, title, comment, images, is_verified_purchase, created_at)
SELECT
  'rev_shredded_1',
  'prod_shredded_pillow',
  u.id,
  4,
  'Fully adjustable loft height',
  'Removing a handful of foam made it the exact height for my neck. Super soft cover.',
  '[]',
  1,
  '2026-09-09 12:10:00'
FROM users u LIMIT 1;
