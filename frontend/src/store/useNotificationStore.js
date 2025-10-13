import { create } from 'zustand';

const useNotificationStore = create((set, get) => ({
  notifications: [
    {
      id: 1,
      title: 'Application Status Update',
      message: 'Your no-dues application has been approved by Department',
      type: 'success',
      timestamp: '2024-01-15T11:00:00Z',
      read: false,
    },
    {
      id: 2,
      title: 'Query Raised',
      message: 'Library has raised a query regarding your application',
      type: 'warning',
      timestamp: '2024-01-16T09:00:00Z',
      read: false,
    },
    {
      id: 3,
      title: 'Application Approved',
      message: 'Your no-dues application has been fully approved',
      type: 'success',
      timestamp: '2024-01-15T13:00:00Z',
      read: true,
    },
  ],

  addNotification: (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));
    return newNotification;
  },

  markAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    }));
  },

  removeNotification: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== notificationId
      ),
    }));
  },

  getUnreadCount: () => {
    return get().notifications.filter((notification) => !notification.read).length;
  },
}));

export default useNotificationStore;
