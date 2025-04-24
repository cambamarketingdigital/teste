/*
  # Create Example Users

  1. Creates test users for all roles:
    - Admin
    - Director
    - Financial
    - Traffic Manager
    - Consultant
    - Client

  2. Sets up:
    - User interface preferences
    - Example client data
    - Example traffic campaign
*/

-- Create example users with hashed passwords
DO $$
BEGIN
  -- Admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@camba.com') THEN
    INSERT INTO auth.users (
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at,
      last_sign_in_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      'admin@camba.com',
      crypt('Admin2025!', gen_salt('bf')),
      now(),
      '{"name": "Admin User", "role": "admin"}',
      now(),
      now(),
      now()
    );
  END IF;

  -- Director
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'diretor@camba.com') THEN
    INSERT INTO auth.users (
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at,
      last_sign_in_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      'diretor@camba.com',
      crypt('Dir2025!', gen_salt('bf')),
      now(),
      '{"name": "Director User", "role": "director"}',
      now(),
      now(),
      now()
    );
  END IF;

  -- Financial
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'financeiro@camba.com') THEN
    INSERT INTO auth.users (
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at,
      last_sign_in_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      'financeiro@camba.com',
      crypt('Fin2025!', gen_salt('bf')),
      now(),
      '{"name": "Financial User", "role": "financial"}',
      now(),
      now(),
      now()
    );
  END IF;

  -- Traffic Manager
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'trafego@camba.com') THEN
    INSERT INTO auth.users (
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at,
      last_sign_in_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      'trafego@camba.com',
      crypt('Traffic2025!', gen_salt('bf')),
      now(),
      '{"name": "Traffic Manager", "role": "traffic_manager"}',
      now(),
      now(),
      now()
    );
  END IF;

  -- Consultant
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'consultor@camba.com') THEN
    INSERT INTO auth.users (
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at,
      last_sign_in_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      'consultor@camba.com',
      crypt('Cons2025!', gen_salt('bf')),
      now(),
      '{"name": "Consultant User", "role": "consultant"}',
      now(),
      now(),
      now()
    );
  END IF;

  -- Client
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'cliente@empresa.com') THEN
    INSERT INTO auth.users (
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at,
      last_sign_in_at
    ) VALUES (
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
  END IF;
END $$;

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
)
ON CONFLICT (user_id) DO NOTHING;

-- Create example client data
INSERT INTO clients (
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
)
SELECT
  'Empresa Exemplo',
  'Client User',
  consultant.id,
  director.id,
  5000.00,
  '2025-04-01',
  'active',
  true,
  now(),
  now(),
  admin.id
FROM 
  auth.users consultant,
  auth.users director,
  auth.users admin
WHERE 
  consultant.email = 'consultor@camba.com'
  AND director.email = 'diretor@camba.com'
  AND admin.email = 'admin@camba.com'
ON CONFLICT DO NOTHING;

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
)
SELECT
  client.id,
  manager.id,
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
FROM 
  auth.users client,
  auth.users manager
WHERE 
  client.email = 'cliente@empresa.com'
  AND manager.email = 'trafego@camba.com'
ON CONFLICT DO NOTHING;