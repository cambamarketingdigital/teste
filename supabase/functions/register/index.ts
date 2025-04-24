import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const ACCESS_CODES = {
  consultant: 'CONS2025',
  director: 'DIR2025',
  admin: 'ADM2025',
  financial: 'FIN2025'
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { 
      email, 
      password, 
      name, 
      role, 
      accessCode, 
      companyName, 
      document, 
      whatsapp 
    } = await req.json();

    // Validate access code for non-client roles
    if (role !== 'client') {
      const requiredCode = ACCESS_CODES[role];
      if (!accessCode || accessCode !== requiredCode) {
        throw new Error('Código de acesso inválido');
      }
    }

    // Validate required fields for clients
    if (role === 'client' && (!companyName || !document || !whatsapp)) {
      throw new Error('Dados da empresa são obrigatórios para clientes');
    }

    // Create user
    const { data: userData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          companyName,
          document,
          whatsapp
        }
      }
    });

    if (signUpError) throw signUpError;

    // Create user interface preferences
    if (userData.user) {
      const { error: interfaceError } = await supabase
        .from('user_interfaces')
        .insert([
          {
            user_id: userData.user.id,
            version: 1,
            labels: {},
            buttons: {},
            colors: {
              primary: '#FFCC00',
              secondary: '#000000',
              accent: '#10b981'
            },
            layout: {
              sidebar: 'expanded',
              theme: 'light',
              density: 'comfortable'
            }
          }
        ]);

      if (interfaceError) throw interfaceError;
    }

    return new Response(
      JSON.stringify({ user: userData.user, session: userData.session }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});