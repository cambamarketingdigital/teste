import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './useAuth';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Client {
  id: string;
  company: string;
  contact: string;
  consultant_id: string;
  director_id: string;
  monthly_value: number;
  start_date: string;
  status: 'active' | 'inactive' | 'pending';
  is_first_month: boolean;
  created_at: string;
  updated_at: string;
  consultant: { name: string } | null;
  director: { name: string } | null;
}

interface ClientStore {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  updateClientStatus: (clientId: string, newStatus: string) => Promise<void>;
}

const useClients = create<ClientStore>((set) => ({
  clients: [],
  isLoading: false,
  error: null,

  fetchClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          consultant:consultant_id(name),
          director:director_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ clients: data || [] });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error fetching clients' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateClientStatus: async (clientId: string, newStatus: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('clients')
        .update({ 
          status: newStatus,
          updated_by: useAuth.getState().user?.id
        })
        .eq('id', clientId);

      if (error) throw error;

      // Update local state
      set(state => ({
        clients: state.clients.map(client =>
          client.id === clientId ? { ...client, status: newStatus } : client
        )
      }));

    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error updating client status' });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useClients;