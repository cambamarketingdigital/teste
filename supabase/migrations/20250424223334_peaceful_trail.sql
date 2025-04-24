/*
  # Adicionar Superusuário para Testes

  1. Novo Usuário
    - Email: super@camba.com
    - Senha: Super2025!
    - Função: admin
    - Nome: Super Admin

  2. Configurações
    - Interface padrão
    - Permissões de administrador
*/

-- Criar superusuário
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
  'super@camba.com',
  crypt('Super2025!', gen_salt('bf')),
  now(),
  jsonb_build_object(
    'name', 'Super Admin',
    'role', 'admin'
  ),
  now(),
  now(),
  now(),
  encode(gen_random_bytes(32), 'hex')
)
ON CONFLICT (email) DO NOTHING;

-- Criar interface para o superusuário
INSERT INTO user_interfaces (
  user_id,
  version,
  labels,
  buttons,
  colors,
  layout
)
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
WHERE email = 'super@camba.com'
ON CONFLICT (user_id) DO NOTHING;