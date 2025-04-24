/*
  # Sistema Financeiro

  1. Novas Tabelas
    - `financial_transactions`
      - Registra todas as transações financeiras
      - Inclui pagamentos de clientes e comissões
    
    - `payment_schedules`
      - Controla datas de vencimento e pagamentos
      - Gerencia notificações automáticas

    - `commission_payments`
      - Registra pagamentos de comissões
      - Controla datas e valores específicos

  2. Security
    - RLS habilitado em todas as tabelas
    - Políticas específicas para o papel 'financial'
*/

-- Tabela de transações financeiras
CREATE TABLE IF NOT EXISTS financial_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('client_payment', 'commission_payment', 'expense')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date DATE NOT NULL,
  payment_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  client_id uuid REFERENCES auth.users(id),
  consultant_id uuid REFERENCES auth.users(id),
  director_id uuid REFERENCES auth.users(id)
);

-- Tabela de agendamento de pagamentos
CREATE TABLE IF NOT EXISTS payment_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES auth.users(id),
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  notification_sent BOOLEAN DEFAULT false,
  whatsapp_reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de pagamentos de comissões
CREATE TABLE IF NOT EXISTS commission_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('consultant', 'director')),
  amount DECIMAL(10,2) NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_payments ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para acesso financeiro
CREATE POLICY "Acesso financeiro pode ver todas as transações"
  ON financial_transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (
        auth.users.raw_user_meta_data->>'role' = 'financial'
        OR auth.users.raw_user_meta_data->>'role' = 'admin'
      )
    )
  );

CREATE POLICY "Acesso financeiro pode gerenciar pagamentos"
  ON payment_schedules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (
        auth.users.raw_user_meta_data->>'role' = 'financial'
        OR auth.users.raw_user_meta_data->>'role' = 'admin'
      )
    )
  );

CREATE POLICY "Acesso financeiro pode gerenciar comissões"
  ON commission_payments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (
        auth.users.raw_user_meta_data->>'role' = 'financial'
        OR auth.users.raw_user_meta_data->>'role' = 'admin'
      )
    )
  );

-- Funções para atualização automática de timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_financial_transactions_timestamp
  BEFORE UPDATE ON financial_transactions
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_payment_schedules_timestamp
  BEFORE UPDATE ON payment_schedules
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_commission_payments_timestamp
  BEFORE UPDATE ON commission_payments
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();