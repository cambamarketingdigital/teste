import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { z } from 'zod';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: string, accessCode?: string, companyName?: string, document?: string, whatsapp?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Super usuário que não precisa estar no banco
const SUPER_USER = {
  email: 'super@admin.com',
  password: 'Super2025!'
};

// Access codes for each user type
const ACCESS_CODES = {
  consultant: 'CONS2025',
  director: 'DIR2025',
  admin: 'ADM2025',
  financial: 'FIN2025',
  traffic_manager: 'TRAFFIC2025'
};

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
});

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  role: z.enum(['consultant', 'director', 'client', 'admin', 'financial', 'traffic_manager']),
  accessCode: z.string().optional(),
  companyName: z.string().optional(),
  document: z.string().optional(),
  whatsapp: z.string().optional()
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name,
          role: session.user.user_metadata.role,
          createdAt: new Date(session.user.created_at),
          companyName: session.user.user_metadata.companyName,
          document: session.user.user_metadata.document,
          whatsapp: session.user.user_metadata.whatsapp
        });
      }
      setIsLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name,
          role: session.user.user_metadata.role,
          createdAt: new Date(session.user.created_at),
          companyName: session.user.user_metadata.companyName,
          document: session.user.user_metadata.document,
          whatsapp: session.user.user_metadata.whatsapp
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate input
      loginSchema.parse({ email, password });

      // Check if it's the super user
      if (email === SUPER_USER.email && password === SUPER_USER.password) {
        setUser({
          id: 'super-admin',
          email: SUPER_USER.email,
          name: 'Super Admin',
          role: 'admin',
          createdAt: new Date(),
        });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data.user) throw new Error('Usuário não encontrado');

      setUser({
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata.name,
        role: data.user.user_metadata.role,
        createdAt: new Date(data.user.created_at),
        companyName: data.user.user_metadata.companyName,
        document: data.user.user_metadata.document,
        whatsapp: data.user.user_metadata.whatsapp
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao fazer login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: string,
    accessCode?: string,
    companyName?: string,
    document?: string,
    whatsapp?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate input
      registerSchema.parse({
        email,
        password,
        name,
        role,
        accessCode,
        companyName,
        document,
        whatsapp
      });

      // Verify access code for non-client roles
      if (role !== 'client') {
        if (!accessCode) {
          throw new Error('Código de acesso é obrigatório');
        }

        const requiredCode = ACCESS_CODES[role as keyof typeof ACCESS_CODES];
        if (accessCode !== requiredCode) {
          throw new Error('Código de acesso inválido');
        }
      }

      // Validate client-specific fields
      if (role === 'client') {
        if (!companyName || !document || !whatsapp) {
          throw new Error('Nome da empresa, CNPJ/CPF e WhatsApp são obrigatórios para clientes');
        }
      }

      const { data, error } = await supabase.auth.signUp({
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

      if (error) throw error;
      if (!data.user) throw new Error('Erro ao criar usuário');

      setUser({
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata.name,
        role: data.user.user_metadata.role,
        createdAt: new Date(data.user.created_at),
        companyName: data.user.user_metadata.companyName,
        document: data.user.user_metadata.document,
        whatsapp: data.user.user_metadata.whatsapp
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao criar conta');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    // Se for o super usuário, apenas limpa o estado
    if (user?.id === 'super-admin') {
      setUser(null);
      return;
    }

    // Para outros usuários, faz logout normal
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar email de recuperação');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    setError(null);
    try {
      // Se for o super usuário, não permite atualização
      if (user?.id === 'super-admin') {
        throw new Error('Não é possível atualizar o perfil do super usuário');
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          name: data.name,
          role: data.role,
          companyName: data.companyName,
          document: data.document,
          whatsapp: data.whatsapp
        }
      });

      if (error) throw error;

      if (user) {
        setUser({ ...user, ...data });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading, 
      error,
      resetPassword,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};