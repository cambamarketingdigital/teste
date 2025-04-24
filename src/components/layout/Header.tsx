import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Menu, Search, X, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-white border-b border-secondary-200 h-16 sticky top-0 z-10">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center lg:hidden">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-secondary-500 hover:bg-secondary-100 hover:text-secondary-600 focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>
        
        <div className="hidden md:flex items-center flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-secondary-400" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar..."
              className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-md bg-secondary-50 text-secondary-800 placeholder-secondary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 rounded-full text-secondary-500 hover:bg-secondary-100 hover:text-secondary-600 relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
          </button>
          
          <div className="relative" ref={profileMenuRef}>
            <button
              className="flex items-center cursor-pointer hover:bg-secondary-50 rounded-md px-2 py-1"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <Avatar 
                initials={(user?.nickname || user?.name.slice(0, 2) || 'UN').toUpperCase()}
                size="sm"
                status="online"
              />
              <div className="ml-2 hidden md:block">
                <p className="text-sm font-medium text-secondary-800">
                  {user?.nickname || user?.name || 'Usuário'}
                </p>
                <p className="text-xs text-secondary-500 capitalize">{user?.role || 'consultor'}</p>
              </div>
              <ChevronDown size={16} className="ml-2 text-secondary-400" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-secondary-200"
                >
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/settings');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                  >
                    <Settings size={16} className="mr-2" />
                    Configurações
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sair
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;