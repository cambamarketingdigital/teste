import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Phone, Briefcase, Calendar, Award, ClipboardList, 
  Settings, LogOut, Layers, BarChart4, Menu, X, TrendingUp, DollarSign,
  Newspaper, Bell
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };
  
  // Common links that appear for all users
  const commonLinks = [
    { icon: <Home size={20} />, name: 'Dashboard', path: '/' },
    { icon: <Newspaper size={20} />, name: 'Blog', path: '/blog' },
    { icon: <Bell size={20} />, name: 'Anúncios', path: '/announcements' },
  ];
  
  const consultantLinks = [
    ...commonLinks,
    { icon: <Phone size={20} />, name: 'Leads', path: '/leads' },
    { icon: <Calendar size={20} />, name: 'Reuniões', path: '/meetings' },
    { icon: <Award size={20} />, name: 'Comissões', path: '/commissions' },
    { icon: <ClipboardList size={20} />, name: 'Tarefas', path: '/tasks' },
  ];
  
  const directorLinks = [
    ...commonLinks,
    { icon: <Users size={20} />, name: 'Consultores', path: '/consultants' },
    { icon: <Briefcase size={20} />, name: 'Clientes', path: '/clients' },
    { icon: <Award size={20} />, name: 'Comissões', path: '/commissions' },
    { icon: <BarChart4 size={20} />, name: 'Relatórios', path: '/reports' },
    { icon: <ClipboardList size={20} />, name: 'Tarefas', path: '/tasks' },
  ];
  
  const clientLinks = [
    ...commonLinks,
    { icon: <Layers size={20} />, name: 'Meus Clientes', path: '/my-customers' },
    { icon: <ClipboardList size={20} />, name: 'Scripts', path: '/scripts' },
    { icon: <TrendingUp size={20} />, name: 'Tráfego Pago', path: '/traffic' },
  ];
  
  const adminLinks = [
    ...commonLinks,
    { icon: <Users size={20} />, name: 'Usuários', path: '/users' },
    { icon: <Briefcase size={20} />, name: 'Clientes', path: '/clients' },
    { icon: <BarChart4 size={20} />, name: 'Relatórios', path: '/reports' },
    { icon: <Settings size={20} />, name: 'Configurações', path: '/settings' },
  ];

  const financialLinks = [
    ...commonLinks,
    { icon: <DollarSign size={20} />, name: 'Financeiro', path: '/financial' },
    { icon: <Users size={20} />, name: 'Clientes', path: '/clients' },
    { icon: <BarChart4 size={20} />, name: 'Relatórios', path: '/reports' },
  ];
  
  const getLinks = () => {
    switch (user?.role) {
      case 'consultant':
        return consultantLinks;
      case 'director':
        return directorLinks;
      case 'client':
        return clientLinks;
      case 'admin':
        return adminLinks;
      case 'financial':
        return financialLinks;
      default:
        return consultantLinks;
    }
  };
  
  const links = getLinks();
  
  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
            <span className="text-secondary-900 font-bold">C</span>
          </div>
          <span className="text-xl font-bold text-white">Camba</span>
        </Link>
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="text-secondary-400 hover:text-white"
          >
            <X size={24} />
          </button>
        )}
      </div>
      
      <div className="px-4 py-2">
        <div className="text-xs uppercase tracking-wider text-secondary-400 mb-2 px-2">
          Menu Principal
        </div>
        <nav className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-2 py-2 rounded-md transition-colors ${
                isActiveRoute(link.path)
                  ? 'bg-secondary-700 text-white'
                  : 'text-secondary-300 hover:bg-secondary-700 hover:text-white'
              }`}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <span className="mr-3">{link.icon}</span>
              <span>{link.name}</span>
              {isActiveRoute(link.path) && (
                <span className="w-1 h-6 bg-primary-500 rounded absolute right-0" />
              )}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto px-4 py-4">
        <button
          onClick={logout}
          className="flex items-center w-full px-2 py-2 text-secondary-300 hover:bg-secondary-700 hover:text-white rounded-md transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          <span>Sair</span>
        </button>
      </div>
    </>
  );
  
  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={toggleSidebar}
          />
        )}
        
        <motion.aside
          initial={isOpen ? "open" : "closed"}
          animate={isOpen ? "open" : "closed"}
          variants={sidebarVariants}
          className="fixed inset-y-0 left-0 w-64 bg-secondary-800 z-30 overflow-y-auto"
        >
          {sidebarContent}
        </motion.aside>
        
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 right-4 p-3 rounded-full bg-primary-500 text-secondary-900 shadow-lg z-20 lg:hidden"
        >
          <Menu size={24} />
        </button>
      </>
    );
  }
  
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-secondary-800 border-r border-secondary-700 h-screen sticky top-0">
      {sidebarContent}
    </aside>
  );
};

export default Sidebar;