import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import useNotifications, { useNotificationSound } from '../../hooks/useNotifications';

interface NotificationPopupProps {
  notification: {
    id: string;
    title: string;
    message: string;
    type: 'default' | 'emergency';
  };
  onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ notification, onClose }) => {
  const { playNotificationSound } = useNotificationSound();

  useEffect(() => {
    playNotificationSound(notification.type);
    
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-4 right-4 z-50 w-96 bg-white rounded-lg shadow-lg border ${
          notification.type === 'emergency' ? 'border-error-500' : 'border-primary-500'
        }`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className={`p-2 rounded-full ${
              notification.type === 'emergency' ? 'bg-error-100' : 'bg-primary-100'
            }`}>
              <Bell size={20} className={
                notification.type === 'emergency' ? 'text-error-600' : 'text-primary-600'
              } />
            </div>
            <div className="ml-3 w-full">
              <h3 className="text-sm font-medium text-secondary-900">
                {notification.title}
              </h3>
              <p className="mt-1 text-sm text-secondary-500">
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationPopup;