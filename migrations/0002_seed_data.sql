-- Seed Categories
INSERT OR IGNORE INTO categories (id, name) VALUES
  ('cat-1', 'Audio & Headphones'),
  ('cat-2', 'Smartphones & Tablets'),
  ('cat-3', 'Wearables & Smartwatches'),
  ('cat-4', 'Laptops & Computers'),
  ('cat-5', 'Accessories & Gadgets');

-- Seed Admin and Demo User
-- Passwords:
-- admin@example.com -> admin123
-- user@example.com -> user123
INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES
  ('usr-admin-1', 'Admin Superuser', 'admin@example.com', '$2a$10$9vYDg0HtipGRbR7UohBXJeWKitJbMS9m1hP7DCfBCLmN.hGv23rxe', 'ADMIN'),
  ('usr-demo-1', 'Alex Johnson', 'user@example.com', '$2a$10$IrmJ7EL85iGRkeK9q05lXe0zaDBm9C3AeNwTrY.S3obGQro9tERMO', 'USER');

-- Seed Products
INSERT OR IGNORE INTO products (id, name, description, price, stock, images, category_id) VALUES
  (
    'prod-1',
    'AuraSound Wireless ANC Headphones',
    'Experience high-fidelity sound with 40mm beryllium drivers, active noise cancellation, and up to 45 hours of immersive battery life. Designed with memory foam ear cushions.',
    14999,
    25,
    '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"]',
    'cat-1'
  ),
  (
    'prod-2',
    'PulseBeat Pro Smartwatch Titanium',
    'Track workouts, blood oxygen, sleep quality, and ECG in real time. Features an ultra-bright AMOLED always-on display and 100m water resistance with sapphire crystal glass.',
    22499,
    18,
    '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80"]',
    'cat-3'
  ),
  (
    'prod-3',
    'ZenBook Pro 15 Ultra Thin Laptop',
    'Powered by latest 14-core processor, 32GB LPDDR5X RAM, 1TB NVMe SSD, and vivid 15.6-inch 3K OLED 120Hz touchscreen display. Ultra-light aluminum unibody.',
    89999,
    10,
    '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"]',
    'cat-4'
  ),
  (
    'prod-4',
    'NovaView 4K UHD Smart Webcam',
    'Crystal-clear 4K video at 60fps with AI auto-framing, dual noise-canceling stereo microphones, and physical privacy shutter. Compatible with Mac & PC.',
    6499,
    30,
    '["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"]',
    'cat-5'
  ),
  (
    'prod-5',
    'SoundBar Max 360 Spatial Audio',
    'Immerse yourself in rich cinematic 3D Dolby Atmos sound with built-in dual subwoofers and wireless Bluetooth 5.3 streaming capability.',
    12999,
    15,
    '["https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80"]',
    'cat-1'
  ),
  (
    'prod-6',
    'MagCharge 3-in-1 Wireless Charging Dock',
    'Simultaneously fast-charge your phone, smartwatch, and wireless earbuds with MagSafe magnetic alignment and thermal heat dissipation.',
    3499,
    40,
    '["https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80"]',
    'cat-5'
  );
