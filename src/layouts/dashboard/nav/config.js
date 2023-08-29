// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Tableau de Bord',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Matériels',
    path: '/dashboard/materiels',
    icon: icon('ic_user'),
  },
  // {
  //   title: 'Affectation',
  //   path: '/dashboard/Affectations',
  //   icon: icon('ic_user'),
  // },
  {
    title: 'Commande',
    path: '/dashboard/Commandes',
    icon: icon('ic_user'),
  },
  {
    title: 'Etablissement',
    path: '/dashboard/Etablissements',
    icon: icon('ic_user'),
  },
  {
    title: 'Livraison',
    path: '/dashboard/Livraisons',
    icon: icon('ic_user'),
  },
  {
    title: 'Prestataire',
    path: '/dashboard/Prestataires',
    icon: icon('ic_user'),
  },
  {
    title: 'Proprietaire',
    path: '/dashboard/Proprietaires',
    icon: icon('ic_user'),
  },
  {
    title: 'Type of Materie',
    path: '/dashboard/typeMateries',
    icon: icon('ic_user'),
  },
  
];

export default navConfig;
