export interface User {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  role: 'admin' | 'director' | 'consultant' | 'client' | 'financial' | 'traffic_manager';
  createdAt: Date;
  companyName?: string;
  document?: string;
  whatsapp?: string;
  avatarUrl?: string;
}

export interface Client {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  consultant_id?: string;
  director_id?: string;
  monthly_value: number;
  start_date: string;
  status: 'active' | 'inactive' | 'pending';
  is_first_month: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface LeadStatus {
  id: string;
  status: 'no_answer' | 'auto_reply' | 'has_provider' | 'talk_to_boss' | 'callback' | 'meeting_scheduled' | 'converted' | 'lost';
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id: string;
  company: string;
  contact: string;
  email?: string;
  phone?: string;
  status: LeadStatus['status'];
  consultant_id?: string;
  director_id?: string;
  notes?: string;
  follow_up_date?: string;
  converted_at?: string;
  converted_to_client_id?: string;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface Commission {
  id: string;
  client_id: string;
  user_id: string;
  role: 'consultant' | 'director';
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  payment_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'doing' | 'done';
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  estimatedDays: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'default' | 'emergency';
  isRead: boolean;
  createdAt: Date;
  clientId?: string;
  clientName?: string;
  consultantId?: string;
  directorId?: string;
}

export interface UserInterface {
  id: string;
  userId: string;
  version: number;
  labels: Record<string, string>;
  buttons: Record<string, string>;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  layout: {
    sidebar: 'expanded' | 'collapsed';
    theme: 'light' | 'dark';
    density: 'comfortable' | 'compact';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'pix' | 'bank';
  pixKey?: string;
  pixKeyType?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  bankName?: string;
  bankCode?: string;
  accountType?: 'checking' | 'savings';
  accountNumber?: string;
  accountBranch?: string;
  accountHolder?: string;
  accountHolderDocument?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}