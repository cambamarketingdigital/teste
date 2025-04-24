/*
  # Sistema de Anúncios Importantes

  1. Novas Tabelas
    - `announcements`
      - Armazena anúncios importantes
      - Suporte a texto, imagens e vídeos
      - Controle de público-alvo
    
    - `announcement_views`
      - Registra visualizações dos anúncios
      - Controla notificações pendentes

  2. Security
    - RLS habilitado em todas as tabelas
    - Políticas específicas para admin e diretor
*/

CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  media_urls JSONB DEFAULT '[]'::jsonb,
  target_roles TEXT[] NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS announcement_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid REFERENCES announcements(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(announcement_id, user_id)
);

-- Habilitar RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_views ENABLE ROW LEVEL SECURITY;

-- Políticas para anúncios
CREATE POLICY "Admins e diretores podem criar anúncios"
  ON announcements
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('admin', 'director')
  );

CREATE POLICY "Admins e diretores podem atualizar anúncios"
  ON announcements
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('admin', 'director')
  );

CREATE POLICY "Usuários podem ver anúncios destinados a eles"
  ON announcements
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = ANY(target_roles)
  );

-- Políticas para visualizações
CREATE POLICY "Usuários podem registrar suas visualizações"
  ON announcement_views
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = user_id
  );

-- Funções auxiliares
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_announcements_timestamp
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();