import { User } from './user';

export interface FinancialTransaction {
  id: string;
  type: 'client_payment' | 'commission_payment' | 'expense';
  amount: number;
  description?: string;
  status: 'pending' | 'paid' | 'cancelled';
  dueDate: Date;
  paymentDate?: Date;
  clientId?: string;
  consultantId?: string;
  directorId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentSchedule {
  id: string;
  clientId: string;
  amount: number;
  dueDate: Date;
  notificationSent: boolean;
  whatsappReminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommissionPayment {
  id: string;
  userId: string;
  role: 'consultant' | 'director';
  amount: number;
  month: number;
  year: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}