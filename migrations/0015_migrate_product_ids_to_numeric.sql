-- Migration 0015: Migrate product IDs to 4-digit numeric strings (1001, 1002, 1003...)
PRAGMA foreign_keys = OFF;

-- 1. Update products table primary keys
UPDATE products SET id = '1001' WHERE id = 'prod_ortho_memory';
UPDATE products SET id = '1002' WHERE id = 'prod_dual_comfort';
UPDATE products SET id = '1003' WHERE id = 'prod_cooling_pillow';
UPDATE products SET id = '1004' WHERE id = 'prod_latex_hybrid';
UPDATE products SET id = '1005' WHERE id = 'prod_waterproof_protector';
UPDATE products SET id = '1006' WHERE id = 'prod_shredded_pillow';

-- 2. Update order_items table foreign keys
UPDATE order_items SET product_id = '1001' WHERE product_id = 'prod_ortho_memory';
UPDATE order_items SET product_id = '1002' WHERE product_id = 'prod_dual_comfort';
UPDATE order_items SET product_id = '1003' WHERE product_id = 'prod_cooling_pillow';
UPDATE order_items SET product_id = '1004' WHERE product_id = 'prod_latex_hybrid';
UPDATE order_items SET product_id = '1005' WHERE product_id = 'prod_waterproof_protector';
UPDATE order_items SET product_id = '1006' WHERE product_id = 'prod_shredded_pillow';

-- 3. Update reviews table foreign keys
UPDATE reviews SET product_id = '1001' WHERE product_id = 'prod_ortho_memory';
UPDATE reviews SET product_id = '1002' WHERE product_id = 'prod_dual_comfort';
UPDATE reviews SET product_id = '1003' WHERE product_id = 'prod_cooling_pillow';
UPDATE reviews SET product_id = '1004' WHERE product_id = 'prod_latex_hybrid';
UPDATE reviews SET product_id = '1005' WHERE product_id = 'prod_waterproof_protector';
UPDATE reviews SET product_id = '1006' WHERE product_id = 'prod_shredded_pillow';

-- 4. Update product_images table foreign keys
UPDATE product_images SET product_id = '1001' WHERE product_id = 'prod_ortho_memory';
UPDATE product_images SET product_id = '1002' WHERE product_id = 'prod_dual_comfort';
UPDATE product_images SET product_id = '1003' WHERE product_id = 'prod_cooling_pillow';
UPDATE product_images SET product_id = '1004' WHERE product_id = 'prod_latex_hybrid';
UPDATE product_images SET product_id = '1005' WHERE product_id = 'prod_waterproof_protector';
UPDATE product_images SET product_id = '1006' WHERE product_id = 'prod_shredded_pillow';

PRAGMA foreign_keys = ON;
