import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 4000,
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove after duration
    if (newNotification.duration) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, newNotification.duration);
    }

    return id;
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  clearNotifications: () => {
    set({ notifications: [] });
  },
}));

export const useNotifications = () => {
  const store = useNotificationStore();

  return {
    notifications: store.notifications,
    success: (title: string, message: string, duration?: number) =>
      store.addNotification({ type: 'success', title, message, duration }),
    error: (title: string, message: string, duration?: number) =>
      store.addNotification({ type: 'error', title, message, duration }),
    warning: (title: string, message: string, duration?: number) =>
      store.addNotification({ type: 'warning', title, message, duration }),
    info: (title: string, message: string, duration?: number) =>
      store.addNotification({ type: 'info', title, message, duration }),
    remove: store.removeNotification,
    clear: store.clearNotifications,
  };
};
