export interface User {
  id: string;
  name: string;
  email: string;
  role: 'consultant' | 'director' | 'client' | 'admin' | 'financial' | 'traffic_manager';
  directorId?: string;
  createdAt: Date;
  interface?: UserInterface;
  companyName?: string;
  document?: string; // CNPJ or CPF
  whatsapp?: string;
}

export interface UserInterface {
  id: string;
  userId: string;
  version: number;
  labels: {
    [key: string]: string;
  };
  buttons: {
    [key: string]: string;
  };
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