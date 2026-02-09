export const getCurrentUserId = (): number | null => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);

    return decoded.userId || decoded.id || decoded.sub; 
  } catch (e) {
    return null;
  }
};