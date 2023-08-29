import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
//
import LoginPage from './pages/LoginPage';
import DashboardAppPage from './pages/DashboardAppPage';
import Materiels from './pages/Materiels';
import Affectations from './pages/Affectations';
import Commandes from './pages/Commandes';
import Etablissements from './pages/Etablissements';
import Livraison from './pages/Livraison';
import Prestataires from './pages/Prestataires';
import Proprietaires from './pages/Proprietaires';
import TypeMateries from './pages/TypeMateries';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <LoginPage />,
      index:true
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'materiels', element: <Materiels /> },
        // { path: 'affectations', element: <Affectations />},
        { path: 'commandes', element: <Commandes />},
        { path: 'etablissements', element: <Etablissements />},
        { path: 'Livraisons', element: <Livraison />},
        { path: 'prestataires',element: <Prestataires />},
        { path: 'proprietaires', element: <Proprietaires />},
        { path: 'typeMateries', element: <TypeMateries />}
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
