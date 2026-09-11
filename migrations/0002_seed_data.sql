-- Seed Admin Superuser (Clean Production Slate)
-- admin@example.com -> admin123
INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES
  ('usr-admin-1', 'Admin Superuser', 'admin@example.com', '$2a$10$9vYDg0HtipGRbR7UohBXJeWKitJbMS9m1hP7DCfBCLmN.hGv23rxe', 'ADMIN');
