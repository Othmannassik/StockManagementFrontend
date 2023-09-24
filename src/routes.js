import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
//
import LoginPage from './pages/LoginPage';
import DashboardAppPage from './pages/DashboardAppPage';
import Materiels from './pages/Materiels';
import Commandes from './pages/Commandes';
import Etablissements from './pages/Etablissements';
import Livraison from './pages/Livraison';
import Prestataires from './pages/Prestataires';
import Proprietaires from './pages/Proprietaires';
import TypeMateriels from './pages/TypeMateriels';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard" />, index: true },
        { path: 'dashboard', element: <DashboardAppPage /> },
        { path: 'materiels', element: <Materiels /> },
        { path: 'commandes', element: <Commandes />},
        { path: 'etablissements', element: <Etablissements />},
        { path: 'Livraisons', element: <Livraison />},
        { path: 'prestataires',element: <Prestataires />},
        { path: 'proprietaires', element: <Proprietaires />},
        { path: 'typeMateriels', element: <TypeMateriels />}
      ],
    },
  ]);

  return routes;
}
