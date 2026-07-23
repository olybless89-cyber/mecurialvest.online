export const getToken = () => localStorage.getItem('mercurialvest_access_token');
export const setToken = (t: string) => localStorage.setItem('mercurialvest_access_token', t);
export const setRefreshToken = (t: string) => localStorage.setItem('mercurialvest_refresh_token', t);
export const getRefreshToken = () => localStorage.getItem('mercurialvest_refresh_token');
export const clearTokens = () => { 
  localStorage.removeItem('mercurialvest_access_token'); 
  localStorage.removeItem('mercurialvest_refresh_token'); 
};
export const getUser = () => { 
  try { return JSON.parse(localStorage.getItem('mercurialvest_user') || 'null'); } 
  catch { return null; } 
};
export const setUser = (u: unknown) => localStorage.setItem('mercurialvest_user', JSON.stringify(u));
export const clearUser = () => localStorage.removeItem('mercurialvest_user');