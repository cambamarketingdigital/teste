import { useEffect } from 'react';
import { useAuth } from './useAuth';
import useUserInterface from './useUserInterface';

const useDarkMode = () => {
  const { user } = useAuth();
  const { interface_, updateInterface } = useUserInterface(user?.id || '');

  const isDarkMode = interface_?.layout?.theme === 'dark';

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = async () => {
    if (interface_ && updateInterface) {
      await updateInterface({
        ...interface_,
        layout: {
          ...interface_.layout,
          theme: isDarkMode ? 'light' : 'dark'
        }
      });
    }
  };

  return { isDarkMode, toggleDarkMode };
};

export default useDarkMode;