import { createContext, useContext } from "react";
import { Notification } from "../hooks/useNotifications";

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (notificationId: number) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  markAsRead: () => {},
});

export function useNotificationContext() {
  return useContext(NotificationContext);
}