/*
  # Create Example Users

  1. Creates example users for each role
  2. Sets up initial interface preferences
  3. Creates example client data
*/

-- Create example users with hashed passwords
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  last_sign_in_at
) VALUES
-- Admin
(
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'admin@camba.com',
  crypt('Admin2025!', gen_salt('bf')),
  now(),
  '{"name": "Admin User", "role": "admin"}',
  now(),
  now(),
  now()
),
-- Director
(
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'diretor@camba.com',
  crypt('Dir2025!', gen_salt('bf')),
  now(),
  '{"name": "Director User", "role": "director"}',
  now(),
  now(),
  now()
),
-- Financial
(
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'financeiro@camba.com',
  crypt('Fin2025!', gen_salt('bf')),
  now(),
  '{"name": "Financial User", "role": "financial"}',
  now(),
  now(),
  now()
),
-- Traffic Manager
(
  '44444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000000',
  'trafego@camba.com',
  crypt('Traffic2025!', gen_salt('bf')),
  now(),
  '{"name": "Traffic Manager", "role": "traffic_manager"}',
  now(),
  now(),
  now()
),
-- Consultant
(
  '55555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000000',
  'consultor@camba.com',
  crypt('Cons2025!', gen_salt('bf')),
  now(),
  '{"name": "Consultant User", "role": "consultant"}',
  now(),
  now(),
  now()
),
-- Client
(
  '66666666-6666-6666-6666-666666666666',
  '00000000-0000-0000-0000-000000000000',
  'cliente@empresa.com',
  crypt('Cliente2025!', gen_salt('bf')),
  now(),
  '{
    "name": "Client User",
    "role": "client",
    "companyName": "Empresa Exemplo",
    "document": "12.345.678/0001-90",
    "whatsapp": "11999999999"
  }',
  now(),
  now(),
  now()
);

-- Create interface preferences for each user
INSERT INTO user_interfaces (user_id, version, labels, buttons, colors, layout)
SELECT
  id,
  1,
  '{}'::jsonb,
  '{}'::jsonb,
  '{
    "primary": "#FFCC00",
    "secondary": "#000000",
    "accent": "#10b981"
  }'::jsonb,
  '{
    "sidebar": "expanded",
    "theme": "light",
    "density": "comfortable"
  }'::jsonb
FROM auth.users
WHERE email IN (
  'admin@camba.com',
  'diretor@camba.com',
  'financeiro@camba.com',
  'trafego@camba.com',
  'consultor@camba.com',
  'cliente@empresa.com'
);

-- Create example client data
INSERT INTO clients (
  id,
  company,
  contact,
  consultant_id,
  director_id,
  monthly_value,
  start_date,
  status,
  is_first_month,
  created_at,
  updated_at,
  updated_by
) VALUES (
  gen_random_uuid(),
  'Empresa Exemplo',
  'Client User',
  '55555555-5555-5555-5555-555555555555', -- Consultant
  '22222222-2222-2222-2222-222222222222', -- Director
  5000.00,
  '2025-04-01',
  'active',
  true,
  now(),
  now(),
  '11111111-1111-1111-1111-111111111111' -- Admin
);

-- Create example traffic campaign
INSERT INTO traffic_campaigns (
  client_id,
  manager_id,
  status,
  setup_deadline,
  platforms,
  goals,
  created_at,
  updated_at
) VALUES (
  '66666666-6666-6666-6666-666666666666', -- Client
  '44444444-4444-4444-4444-444444444444', -- Traffic Manager
  'in_progress',
  '2025-05-01',
  ARRAY['facebook', 'instagram', 'google'],
  '{
    "investment": 5000,
    "target_cpa": 50,
    "target_roas": 3
  }'::jsonb,
  now(),
  now()
);