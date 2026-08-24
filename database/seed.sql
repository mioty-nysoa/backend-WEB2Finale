
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

INSERT INTO users (name, email, password, role, is_active)
VALUES (
    'Administrateur',
    'admin@examhub.com',
    '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
    'ADMIN',
    TRUE
);