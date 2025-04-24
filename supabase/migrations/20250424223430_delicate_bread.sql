/*
  # Adicionar Usuários de Teste

  1. Usuários
    - Admin (admin@camba.com / Admin2025!)
    - Diretor (diretor@camba.com / Dir2025!)
    - Financeiro (financeiro@camba.com / Fin2025!)
    - Tráfego (trafego@camba.com / Traffic2025!)
    - Consultor (consultor@camba.com / Cons2025!)
    - Cliente (cliente@empresa.com / Cliente2025!)

  2. Configurações
    - Interface padrão para cada usuário
    - Permissões baseadas em função
*/

-- Criar usuários de teste
DO $$
DECLARE
  admin_id uuid;
  director_id uuid;
  consultant_id uuid;
  client_id uuid;
BEGIN
  -- Admin
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    last_sign_in_at,
    confirmation_token
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@camba.com',
    crypt('Admin2025!', gen_salt('bf')),
    now(),
    jsonb_build_object(
      'name', 'Admin User',
      'role', 'admin'
    ),
    now(),
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex')
  )
  RETURNING id INTO admin_id;

  -- Director
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    last_sign_in_at,
    confirmation_token
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'diretor@camba.com',
    crypt('Dir2025!', gen_salt('bf')),
    now(),
    jsonb_build_object(
      'name', 'Director User',
      'role', 'director'
    ),
    now(),
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex')
  )
  RETURNING id INTO director_id;

  -- Financial
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    last_sign_in_at,
    confirmation_token
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'financeiro@camba.com',
    crypt('Fin2025!', gen_salt('bf')),
    now(),
    jsonb_build_object(
      'name', 'Financial User',
      'role', 'financial'
    ),
    now(),
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex')
  );

  -- Traffic Manager
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    last_sign_in_at,
    confirmation_token
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'trafego@camba.com',
    crypt('Traffic2025!', gen_salt('bf')),
    now(),
    jsonb_build_object(
      'name', 'Traffic Manager',
      'role', 'traffic_manager'
    ),
    now(),
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex')
  );

  -- Consultant
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    last_sign_in_at,
    confirmation_token
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'consultor@camba.com',
    crypt('Cons2025!', gen_salt('bf')),
    now(),
    jsonb_build_object(
      'name', 'Consultant User',
      'role', 'consultant'
    ),
    now(),
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex')
  )
  RETURNING id INTO consultant_id;

  -- Client
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    last_sign_in_at,
    confirmation_token
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'cliente@empresa.com',
    crypt('Cliente2025!', gen_salt('bf')),
    now(),
    jsonb_build_object(
      'name', 'Client User',
      'role', 'client',
      'companyName', 'Empresa Exemplo',
      'document', '12.345.678/0001-90',
      'whatsapp', '11999999999'
    ),
    now(),
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex')
  )
  RETURNING id INTO client_id;

  -- Criar interfaces para todos os usuários
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

END $$;