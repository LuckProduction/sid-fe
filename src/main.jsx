import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AntdConfigProviders, NotificationProvider } from './providers';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AntdConfigProviders>
      <NotificationProvider>
        {/* <AuthProvider> */}
          {/* <CrudModalProvider> */}
            <App />
          {/* </CrudModalProvider> */}
        {/* </AuthProvider> */}
      </NotificationProvider>
    </AntdConfigProviders>
  </StrictMode>
);
