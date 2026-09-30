import { createRoot } from 'react-dom/client';
import './index.css';
import Routes from './App.jsx';
import { RouterProvider } from 'react-router';
import { Provider } from 'react-redux';
import { Store } from './store/Store.js';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={googleClientId}>
        <Provider store={Store}>
            <Toaster position="top-right" theme="dark" />
            <RouterProvider router={Routes} />
        </Provider>
    </GoogleOAuthProvider>
);
