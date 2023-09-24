import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { KeycloakProvider } from "keycloak-react-web";
import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primereact/resources/primereact.css';   
import 'primeicons/primeicons.css';                                 // icons
import 'primeflex/primeflex.css'; 
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
import ScrollToTop from './components/scroll-to-top';
import authService from './services/AuthService';
import { AccessTokenProvider } from './services/AccessTokenProvider';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <KeycloakProvider client={authService} initOptions={{onLoad : "login-required"}}>
      <HelmetProvider>
        <BrowserRouter>
          <ThemeProvider>
            <ScrollToTop />
            <AccessTokenProvider>
              <Router />
            </AccessTokenProvider>
          </ThemeProvider>
        </BrowserRouter>
      </HelmetProvider>
    </KeycloakProvider>
  );
}
