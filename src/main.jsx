import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BookingProvider } from './context/BookingContext.jsx';
import { TicketProvider } from './context/TicketContext.jsx';
import { WalletProvider } from './context/WalletContext.jsx';
import './theme.css'; // your colours / dark-mode variables (Navbar used to load this, the new Navbar does not)
import './index.css';
import './station.css';
import './page-bg.css';
import './dark-mode.css'; // keep this last, so dark mode wins over the other stylesheets

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <LanguageProvider>
        <AuthProvider>
          <BookingProvider>
            <WalletProvider>
              <TicketProvider>
                <App />
              </TicketProvider>
            </WalletProvider>
          </BookingProvider>
        </AuthProvider>
      </LanguageProvider>
    </HashRouter>
  </React.StrictMode>
);