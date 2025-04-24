/*
  # Lead to Client Conversion System

  1. New Tables
    - `leads`
      - Basic lead information
      - Status tracking
      - Conversion tracking
    
  2. Changes
    - Add conversion tracking to existing tables
    - Add triggers for automatic client creation

  3. Security
    - RLS policies for lead management
    - Conversion permissions
*/

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  contact text NOT NULL,
  email text,
  phone text,
  status text NOT NULL CHECK (status IN (
    'no_answer',
    'auto_reply',
    'has_provider',
    'talk_to_boss',
    'callback',
    'meeting_scheduled',
    'converted',
    'lost'
  )),
  consultant_id uuid REFERENCES auth.users(id),
  director_id uuid REFERENCES auth.users(id),
  notes text,
  follow_up_date date,
  converted_at timestamptz,
  converted_to_client_id uuid REFERENCES clients(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Create lead history table
CREATE TABLE IF NOT EXISTS lead_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  status text NOT NULL,
  notes text,
  changed_at timestamptz DEFAULT now(),
  changed_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_history ENABLE ROW LEVEL SECURITY;

-- Function to handle lead conversion
CREATE OR REPLACE FUNCTION convert_lead_to_client(
  lead_id uuid,
  monthly_value decimal,
  start_date date,
  converted_by uuid
)
RETURNS uuid AS $$
DECLARE
  lead_record RECORD;
  new_client_id uuid;
BEGIN
  -- Get lead information
  SELECT * INTO lead_record
  FROM leads
  WHERE id = lead_id;

  -- Only proceed if lead exists and isn't already converted
  IF FOUND AND lead_record.status != 'converted' THEN
    -- Create new client
    INSERT INTO clients (
      company,
      contact,
      consultant_id,
      director_id,
      monthly_value,
      start_date,
      status,
      is_first_month,
      updated_by
    ) VALUES (
      lead_record.company,
      lead_record.contact,
      lead_record.consultant_id,
      lead_record.director_id,
      monthly_value,
      start_date,
      'active',
      true,
      converted_by
    )
    RETURNING id INTO new_client_id;

    -- Update lead status
    UPDATE leads
    SET 
      status = 'converted',
      converted_at = now(),
      converted_to_client_id = new_client_id,
      updated_at = now(),
      updated_by = converted_by
    WHERE id = lead_id;

    -- Record in lead history
    INSERT INTO lead_history (
      lead_id,
      status,
      notes,
      changed_by
    ) VALUES (
      lead_id,
      'converted',
      'Lead convertido em cliente',
      converted_by
    );

    -- Calculate initial commissions
    PERFORM recalculate_commissions(new_client_id);

    RETURN new_client_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
CREATE POLICY "Users can view their leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (
    consultant_id = auth.uid() OR
    director_id = auth.uid() OR
    auth.jwt() ->> 'role' IN ('admin', 'director')
  );

CREATE POLICY "Users can create leads"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (
    consultant_id = auth.uid() OR
    director_id = auth.uid() OR
    auth.jwt() ->> 'role' IN ('admin', 'director')
  );

-- Add RPC function for client-side use
CREATE OR REPLACE FUNCTION public.convert_lead_to_client(
  lead_id uuid,
  monthly_value decimal,
  start_date date
)
RETURNS uuid AS $$
BEGIN
  RETURN convert_lead_to_client(lead_id, monthly_value, start_date, auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;