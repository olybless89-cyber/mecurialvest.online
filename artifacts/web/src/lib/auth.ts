export const getToken = () => localStorage.getItem('nexbank_access_token');
export const setToken = (t: string) => localStorage.setItem('nexbank_access_token', t);
export const setRefreshToken = (t: string) => localStorage.setItem('nexbank_refresh_token', t);
export const getRefreshToken = () => localStorage.getItem('nexbank_refresh_token');
export const clearTokens = () => { 
  localStorage.removeItem('nexbank_access_token'); 
  localStorage.removeItem('nexbank_refresh_token'); 
};
export const getUser = () => { 
  try { return JSON.parse(localStorage.getItem('nexbank_user') || 'null'); } 
  catch { return null; } 
};
export const setUser = (u: unknown) => localStorage.setItem('nexbank_user', JSON.stringify(u));
export const clearUser = () => localStorage.removeItem('nexbank_user');