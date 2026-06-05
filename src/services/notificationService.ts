export interface Notification {
    id: number;
    message: string;
    issueId: number;
    isRead: boolean;
}


export const getNotificationsByUserId = async (userId: number): Promise<Notification[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.json();
};

export const markNotificationAsRead = async (notificationId: number): Promise<Response> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
};



