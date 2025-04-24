import { create } from 'zustand';
import useSound from 'use-sound';

interface Notification {
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

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  readMenuItems: Record<string, boolean>;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  markMenuItemAsRead: (path: string) => void;
  isMenuItemUnread: (path: string) => boolean;
  getUnreadSupportRequests: () => Notification[];
}

const useNotifications = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  readMenuItems: {},
  
  addNotification: (notification) => {
    const newNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      isRead: false,
      createdAt: new Date(),
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
      // Reset read status for related menu items
      readMenuItems: {
        ...state.readMenuItems,
        '/blog': false,
        '/announcements': false,
        '/tasks': false,
      }
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  markMenuItemAsRead: (path) => {
    set((state) => ({
      readMenuItems: {
        ...state.readMenuItems,
        [path]: true
      }
    }));
  },

  isMenuItemUnread: (path) => {
    const state = get();
    return !state.readMenuItems[path];
  },

  getUnreadSupportRequests: () => {
    return get().notifications.filter(
      n => !n.isRead && n.type === 'emergency' && n.clientId
    );
  },
}));

export const useNotificationSound = () => {
  const [playDefault] = useSound('/sounds/notification.mp3', { volume: 0.5 });
  const [playEmergency] = useSound('/sounds/emergency.mp3', { volume: 0.7 });

  return {
    playNotificationSound: (type: 'default' | 'emergency') => {
      if (type === 'emergency') {
        playEmergency();
        setTimeout(() => playEmergency(), 500);
      } else {
        playDefault();
      }
    },
  };
};

export default useNotifications;