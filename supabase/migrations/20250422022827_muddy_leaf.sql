/*
  # Configurações de Interface por Usuário

  1. Novas Tabelas
    - `user_interfaces`
      - `id` (uuid, primary key)
      - `user_id` (uuid, referência para auth.users)
      - `version` (integer)
      - `labels` (jsonb)
      - `buttons` (jsonb)
      - `colors` (jsonb)
      - `layout` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_interface_history`
      - `id` (uuid, primary key)
      - `interface_id` (uuid, referência para user_interfaces)
      - `version` (integer)
      - `changes` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS em ambas as tabelas
    - Políticas para leitura e escrita baseadas no papel do usuário
*/

-- Tabela principal de configurações de interface
CREATE TABLE IF NOT EXISTS user_interfaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  version integer DEFAULT 1,
  labels jsonb DEFAULT '{}'::jsonb,
  buttons jsonb DEFAULT '{}'::jsonb,
  colors jsonb DEFAULT '{
    "primary": "#FFCC00",
    "secondary": "#000000",
    "accent": "#10b981"
  }'::jsonb,
  layout jsonb DEFAULT '{
    "sidebar": "expanded",
    "theme": "light",
    "density": "comfortable"
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Tabela de histórico de alterações
CREATE TABLE IF NOT EXISTS user_interface_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interface_id uuid REFERENCES user_interfaces(id) ON DELETE CASCADE,
  version integer NOT NULL,
  changes jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE user_interfaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interface_history ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ler suas próprias configurações"
  ON user_interfaces
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ler todas as configurações"
  ON user_interfaces
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins podem modificar todas as configurações"
  ON user_interfaces
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Trigger para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_interface_updated_at
  BEFORE UPDATE ON user_interfaces
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Trigger para criar histórico de alterações
CREATE OR REPLACE FUNCTION create_interface_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_interface_history (interface_id, version, changes)
  VALUES (
    NEW.id,
    NEW.version,
    jsonb_build_object(
      'labels', NEW.labels,
      'buttons', NEW.buttons,
      'colors', NEW.colors,
      'layout', NEW.layout
    )
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER track_interface_changes
  AFTER UPDATE ON user_interfaces
  FOR EACH ROW
  EXECUTE PROCEDURE create_interface_history();