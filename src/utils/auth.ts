export const getUserIdFromToken = (): number | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded?.userId ?? null;
  } catch (error) {
    console.error('Error getting userId from token:', error);
    return null;
  }
};


export const getUsernameFromToken = (): string | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded?.sub ?? null;
  } catch (error) {
    console.error('Error getting username from token:', error);
    return null;
  }
};


export const getUserRoleFromToken = (): string | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded?.roles ?? null;
  } catch (error) {
    console.error('Error getting user role from token:', error);
    return null;
  }

};
