import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface Notification {
  message: string;
  issueId: number;
}

export function useNotifications(userId: number | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

  return { notifications };
}