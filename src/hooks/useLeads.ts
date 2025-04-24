import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './useAuth';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Lead {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  status: 'no_answer' | 'auto_reply' | 'has_provider' | 'talk_to_boss' | 'callback' | 'meeting_scheduled' | 'converted' | 'lost';
  consultant_id: string;
  director_id: string;
  notes: string;
  follow_up_date: string;
  converted_at: string | null;
  converted_to_client_id: string | null;
  created_at: string;
  updated_at: string;
  consultant?: { name: string };
  director?: { name: string };
}

interface LeadStore {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  fetchLeads: () => Promise<void>;
  createLead: (leadData: Partial<Lead>) => Promise<void>;
  updateLead: (leadId: string, updates: Partial<Lead>) => Promise<void>;
  convertToClient: (leadId: string, monthlyValue: number, startDate: string) => Promise<string | null>;
}

const useLeads = create<LeadStore>((set, get) => ({
  leads: [],
  isLoading: false,
  error: null,

  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          consultant:consultant_id(name),
          director:director_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ leads: data || [] });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error fetching leads' });
    } finally {
      set({ isLoading: false });
    }
  },

  createLead: async (leadData) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        leads: [data, ...state.leads]
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error creating lead' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateLead: async (leadId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', leadId);

      if (error) throw error;

      set(state => ({
        leads: state.leads.map(lead =>
          lead.id === leadId ? { ...lead, ...updates } : lead
        )
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error updating lead' });
    } finally {
      set({ isLoading: false });
    }
  },

  convertToClient: async (leadId, monthlyValue, startDate) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .rpc('convert_lead_to_client', {
          lead_id: leadId,
          monthly_value: monthlyValue,
          start_date: startDate
        });

      if (error) throw error;

      // Update local state
      await get().fetchLeads();

      return data;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error converting lead to client' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useLeads;