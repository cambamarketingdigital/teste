/*
  # Client Status and Commission System

  1. Tables
    - clients: Stores client information and status
    - client_history: Tracks status changes
    - commission_payments: Stores commission payment records

  2. Functions
    - recalculate_commissions: Updates commission amounts based on client status
    - notify_client_status_change: Handles notifications and history tracking

  3. Security
    - RLS policies for all tables
    - Secure function execution
*/

-- Create clients table if it doesn't exist
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  contact text NOT NULL,
  consultant_id uuid REFERENCES auth.users(id),
  director_id uuid REFERENCES auth.users(id),
  monthly_value decimal(10,2) NOT NULL,
  start_date date NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  is_first_month boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Create client history table
CREATE TABLE IF NOT EXISTS client_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  status text NOT NULL,
  changed_at timestamptz DEFAULT now(),
  changed_by uuid REFERENCES auth.users(id)
);

-- Create commission payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS commission_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id),
  user_id uuid REFERENCES auth.users(id),
  role text NOT NULL CHECK (role IN ('consultant', 'director')),
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending',
  payment_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_payments ENABLE ROW LEVEL SECURITY;

-- Function to recalculate commissions
CREATE OR REPLACE FUNCTION recalculate_commissions(client_id uuid)
RETURNS void AS $$
DECLARE
  client_record RECORD;
BEGIN
  -- Get client information
  SELECT * INTO client_record
  FROM clients
  WHERE id = client_id;

  -- Only process if client exists
  IF FOUND THEN
    -- Update or create commission records
    -- For consultant
    IF client_record.consultant_id IS NOT NULL THEN
      INSERT INTO commission_payments (
        client_id,
        user_id,
        role,
        amount,
        status
      ) VALUES (
        client_id,
        client_record.consultant_id,
        'consultant',
        CASE 
          WHEN client_record.status = 'active' THEN
            CASE 
              WHEN client_record.is_first_month THEN client_record.monthly_value * 0.20
              ELSE client_record.monthly_value * 0.05
            END
          ELSE 0
        END,
        'pending'
      )
      ON CONFLICT (client_id, user_id)
      DO UPDATE SET
        amount = CASE 
          WHEN client_record.status = 'active' THEN
            CASE 
              WHEN client_record.is_first_month THEN client_record.monthly_value * 0.20
              ELSE client_record.monthly_value * 0.05
            END
          ELSE 0
        END,
        updated_at = now()
      WHERE commission_payments.status = 'pending';
    END IF;

    -- For director
    IF client_record.director_id IS NOT NULL THEN
      INSERT INTO commission_payments (
        client_id,
        user_id,
        role,
        amount,
        status
      ) VALUES (
        client_id,
        client_record.director_id,
        'director',
        CASE 
          WHEN client_record.status = 'active' THEN
            CASE 
              WHEN client_record.is_first_month THEN client_record.monthly_value * 0.10
              ELSE client_record.monthly_value * 0.05
            END
          ELSE 0
        END,
        'pending'
      )
      ON CONFLICT (client_id, user_id)
      DO UPDATE SET
        amount = CASE 
          WHEN client_record.status = 'active' THEN
            CASE 
              WHEN client_record.is_first_month THEN client_record.monthly_value * 0.10
              ELSE client_record.monthly_value * 0.05
            END
          ELSE 0
        END,
        updated_at = now()
      WHERE commission_payments.status = 'pending';
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to notify about status changes
CREATE OR REPLACE FUNCTION notify_client_status_change()
RETURNS trigger AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    -- Record in history
    INSERT INTO client_history (client_id, status, changed_by)
    VALUES (NEW.id, NEW.status, NEW.updated_by);

    -- Create notification
    INSERT INTO announcements (
      title,
      content,
      target_roles,
      created_by
    ) VALUES (
      'Alteração de Status de Cliente',
      format(
        'O cliente %s teve seu status alterado para %s',
        NEW.company,
        NEW.status
      ),
      ARRAY['admin', 'financial', 'director', 'consultant'],
      NEW.updated_by
    );

    -- Recalculate commissions
    PERFORM recalculate_commissions(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for client status changes
CREATE TRIGGER on_client_status_change
  AFTER UPDATE OF status ON clients
  FOR EACH ROW
  EXECUTE FUNCTION notify_client_status_change();

-- RLS Policies
CREATE POLICY "Users can view clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update client status"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "View own commission payments"
  ON commission_payments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Financial can manage commission payments"
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

-- Add unique constraint to prevent duplicate commission records
ALTER TABLE commission_payments
ADD CONSTRAINT unique_client_user_commission
UNIQUE (client_id, user_id);

-- Add RPC function for client-side use
CREATE OR REPLACE FUNCTION public.recalculate_commissions(client_id uuid)
RETURNS void AS $$
BEGIN
  PERFORM recalculate_commissions(client_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;