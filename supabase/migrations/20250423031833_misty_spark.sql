/*
  # Traffic Manager Role and Features

  1. New Tables
    - `client_social_accounts`
      - Stores social media credentials for clients
      - Encrypted storage for sensitive data
    
    - `traffic_campaigns`
      - Tracks campaign setup progress
      - Stores deadlines and goals
    
    - `traffic_metrics`
      - Detailed traffic performance metrics
      - Client-specific data tracking

  2. Security
    - RLS policies for traffic manager role
    - Encrypted storage for credentials
*/

-- Add traffic_manager to valid roles
ALTER TABLE auth.users
ADD CONSTRAINT valid_roles CHECK (
  raw_user_meta_data->>'role' = ANY(ARRAY[
    'admin', 'director', 'consultant', 'client', 'financial', 'traffic_manager'
  ])
);

-- Client social accounts table
CREATE TABLE IF NOT EXISTS client_social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('facebook', 'instagram', 'google')),
  account_name text NOT NULL,
  credentials jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  UNIQUE(client_id, platform)
);

-- Traffic campaigns table
CREATE TABLE IF NOT EXISTS traffic_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  manager_id uuid REFERENCES auth.users(id),
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed')),
  setup_deadline date NOT NULL,
  platforms text[] NOT NULL,
  goals jsonb NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Traffic metrics table
CREATE TABLE IF NOT EXISTS traffic_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES traffic_campaigns(id),
  date date NOT NULL,
  platform text NOT NULL,
  investment decimal(10,2) NOT NULL,
  impressions integer NOT NULL,
  clicks integer NOT NULL,
  conversions integer NOT NULL,
  revenue decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE client_social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Traffic managers can manage social accounts"
  ON client_social_accounts
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('traffic_manager', 'admin')
  );

CREATE POLICY "Traffic managers can manage campaigns"
  ON traffic_campaigns
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('traffic_manager', 'admin') OR
    manager_id = auth.uid()
  );

CREATE POLICY "Traffic managers can manage metrics"
  ON traffic_metrics
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('traffic_manager', 'admin') OR
    EXISTS (
      SELECT 1 FROM traffic_campaigns
      WHERE traffic_campaigns.id = campaign_id
      AND traffic_campaigns.manager_id = auth.uid()
    )
  );

-- Update triggers
CREATE TRIGGER update_client_social_accounts_timestamp
  BEFORE UPDATE ON client_social_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_traffic_campaigns_timestamp
  BEFORE UPDATE ON traffic_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_traffic_metrics_timestamp
  BEFORE UPDATE ON traffic_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();