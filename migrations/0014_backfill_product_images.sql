-- Backfill existing products into product_images table

INSERT OR REPLACE INTO product_images (id, product_id, image_url, color_name, color_hex, is_primary, sort_order) VALUES
-- prod_ortho_memory general images
('img_ortho_1', 'prod_ortho_memory', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&auto=format&fit=crop&q=80', NULL, NULL, 1, 0),
('img_ortho_2', 'prod_ortho_memory', 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=1200&auto=format&fit=crop&q=80', NULL, NULL, 0, 1),
-- prod_ortho_memory color images
('img_ortho_c1', 'prod_ortho_memory', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&auto=format&fit=crop&q=80', 'Midnight Navy', '#1e2238', 0, 2),
('img_ortho_c2', 'prod_ortho_memory', 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=1200&auto=format&fit=crop&q=80', 'Slate Grey', '#64748b', 0, 3),
('img_ortho_c3', 'prod_ortho_memory', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=80', 'Cloud White', '#f8fafc', 0, 4),
('img_ortho_c4', 'prod_ortho_memory', 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=1200&auto=format&fit=crop&q=80', 'Blush Pink', '#f1d8d9', 0, 5),

-- prod_dual_comfort general images
('img_dual_1', 'prod_dual_comfort', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=80', NULL, NULL, 1, 0),
('img_dual_2', 'prod_dual_comfort', 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=1200&auto=format&fit=crop&q=80', NULL, NULL, 0, 1),

-- prod_cooling_pillow general images
('img_pillow_1', 'prod_cooling_pillow', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200&auto=format&fit=crop&q=80', NULL, NULL, 1, 0),
('img_pillow_2', 'prod_cooling_pillow', 'https://images.unsplash.com/photo-1584949597989-5369680387ca?w=1200&auto=format&fit=crop&q=80', NULL, NULL, 0, 1),
-- prod_cooling_pillow color images
('img_pillow_c1', 'prod_cooling_pillow', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200&auto=format&fit=crop&q=80', 'Midnight Navy', '#1e2238', 0, 2),
('img_pillow_c2', 'prod_cooling_pillow', 'https://images.unsplash.com/photo-1584949597989-5369680387ca?w=1200&auto=format&fit=crop&q=80', 'Olive Green', '#858636', 0, 3),
('img_pillow_c3', 'prod_cooling_pillow', 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=1200&auto=format&fit=crop&q=80', 'Blush Pink', '#f1d8d9', 0, 4),
('img_pillow_c4', 'prod_cooling_pillow', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200&auto=format&fit=crop&q=80', 'Warm Amber', '#e49e4d', 0, 5),
('img_pillow_c5', 'prod_cooling_pillow', 'https://images.unsplash.com/photo-1584949597989-5369680387ca?w=1200&auto=format&fit=crop&q=80', 'Crimson Red', '#b73644', 0, 6),

-- prod_latex_hybrid general images
('img_latex_1', 'prod_latex_hybrid', 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=1200&auto=format&fit=crop&q=80', NULL, NULL, 1, 0),

-- prod_waterproof_protector general images
('img_prot_1', 'prod_waterproof_protector', 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=1200&auto=format&fit=crop&q=80', NULL, NULL, 1, 0),

-- prod_shredded_pillow general images
('img_shred_1', 'prod_shredded_pillow', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200&auto=format&fit=crop&q=80', NULL, NULL, 1, 0);
