import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { UserInterface } from '../types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CACHE_KEY = 'user_interface_cache';
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutos

interface CacheData {
  data: UserInterface;
  timestamp: number;
}

const useUserInterface = (userId: string) => {
  const [interface_, setInterface] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar do cache
  const loadFromCache = (): UserInterface | null => {
    const cached = localStorage.getItem(`${CACHE_KEY}_${userId}`);
    if (!cached) return null;

    const { data, timestamp }: CacheData = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    if (isExpired) {
      localStorage.removeItem(`${CACHE_KEY}_${userId}`);
      return null;
    }

    return data;
  };

  // Salvar no cache
  const saveToCache = (data: UserInterface) => {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(`${CACHE_KEY}_${userId}`, JSON.stringify(cacheData));
  };

  // Carregar configurações
  const loadInterface = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tentar carregar do cache primeiro
      const cached = loadFromCache();
      if (cached) {
        setInterface(cached);
        setLoading(false);
        return;
      }

      // Se não houver cache, carregar do banco
      const { data, error } = await supabase
        .from('user_interfaces')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setInterface(data);
        saveToCache(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  // Atualizar configurações
  const updateInterface = async (updates: Partial<UserInterface>) => {
    try {
      setError(null);

      const { data, error } = await supabase
        .from('user_interfaces')
        .update({
          ...updates,
          version: (interface_?.version || 0) + 1
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setInterface(data);
        saveToCache(data);
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar configurações');
      return null;
    }
  };

  // Carregar histórico de alterações
  const loadHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('user_interface_history')
        .select('*')
        .eq('interface_id', interface_?.id)
        .order('version', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico');
      return [];
    }
  };

  // Restaurar versão anterior
  const restoreVersion = async (version: number) => {
    try {
      const history = await loadHistory();
      const targetVersion = history.find(h => h.version === version);

      if (!targetVersion) throw new Error('Versão não encontrada');

      return await updateInterface({
        ...targetVersion.changes,
        version: (interface_?.version || 0) + 1
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao restaurar versão');
      return null;
    }
  };

  useEffect(() => {
    if (userId) {
      loadInterface();
    }
  }, [userId]);

  return {
    interface_,
    loading,
    error,
    updateInterface,
    loadHistory,
    restoreVersion
  };
};

export default useUserInterface;