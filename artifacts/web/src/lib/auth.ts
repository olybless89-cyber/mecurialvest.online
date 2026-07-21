export const getToken = () => localStorage.getItem('orcabank_access_token');
export const setToken = (t: string) => localStorage.setItem('orcabank_access_token', t);
export const setRefreshToken = (t: string) => localStorage.setItem('orcabank_refresh_token', t);
export const getRefreshToken = () => localStorage.getItem('orcabank_refresh_token');
export const clearTokens = () => { 
  localStorage.removeItem('orcabank_access_token'); 
  localStorage.removeItem('orcabank_refresh_token'); 
};
export const getUser = () => { 
  try { return JSON.parse(localStorage.getItem('orcabank_user') || 'null'); } 
  catch { return null; } 
};
export const setUser = (u: unknown) => localStorage.setItem('orcabank_user', JSON.stringify(u));
export const clearUser = () => localStorage.removeItem('orcabank_user');