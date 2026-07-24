import { createRoot } from 'react-dom/client';
import { setBaseUrl, setAuthTokenGetter } from '@workspace/api-client-react';

import App from './App';

import './index.css';

setBaseUrl(import.meta.env.VITE_API_URL || '');
setAuthTokenGetter(() => localStorage.getItem('mercurialvest_access_token'));

createRoot(document.getElementById('root')!).render(<App />);