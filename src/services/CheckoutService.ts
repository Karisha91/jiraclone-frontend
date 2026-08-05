export const createCheckoutSession = async (): Promise<string> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.text();
}