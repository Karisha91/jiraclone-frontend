import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getNotificationsByUserId, Notification, markNotificationAsRead } from "../services/notificationService";


export function useNotifications(userId: number | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);



  useEffect(() => {
    if (!userId) return;
    getNotificationsByUserId(userId).then((data) => {
    console.log(data);
    setNotifications(data);
});

  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      onConnect: () => {
        
        client.subscribe(`/queue/notifications/${userId}`, (message) => {
          const notification: Notification = JSON.parse(message.body);
          setNotifications((prev) => [...prev, notification]);
        });
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [userId]);

  const markAsRead = async (notificationId: number) => {
    await markNotificationAsRead(notificationId);
    setNotifications((prev) => prev.map((n) => n.id === notificationId ? { ...n, isRead: true } : n));
  };

  return { notifications, markAsRead };
}