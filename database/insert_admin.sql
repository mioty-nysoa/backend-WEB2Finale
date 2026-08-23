INSERT INTO users (name, email, password_hash, role, is_active)
VALUES (
  'Super Admin',
  'admin@examhub.local',
  '$2b$10$BdO1MRy.hx91lFRsluglM.AGMm0hcRHcQ4qNsnBEPPGjadDn3vB0e',
  'ADMIN',
  true
)
ON CONFLICT (email) DO NOTHING;