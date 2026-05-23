import { createContext, useContext } from "react";
import { Notification } from "../hooks/useNotifications";

interface NotificationContextType {
  notifications: Notification[];
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
});

export function useNotificationContext() {
  return useContext(NotificationContext);
}