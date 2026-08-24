INSERT INTO users (name, email, password_hash, role, is_active)
VALUES ('Super Admin', 'admin@gmail.com', '$2b$10$sq6MHxTOwKxuqZZgCvINPuFcw0fp7rI0i8tgvmYa71TpbdZ03C5.S', 'ADMIN', true)
ON CONFLICT (email) DO NOTHING;