// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Tableau de Bord',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Matériels',
    path: '/materiels',
    icon: icon('ic_materiel'),
  },
  // {
  //   title: 'Affectation',
  //   path: '/dashboard/Affectations',
  //   icon: icon('ic_user'),
  // },
  {
    title: 'Commande',
    path: '/Commandes',
    icon: icon('ic_commande'),
  },
  {
    title: 'Etablissement',
    path: '/Etablissements',
    icon: icon('ic_etablissement'),
  },
  {
    title: 'Livraison',
    path: '/Livraisons',
    icon: icon('ic_livraison'),
  },
  {
    title: 'Prestataire',
    path: '/Prestataires',
    icon: icon('ic_user'),
  },
  {
    title: 'Proprietaire',
    path: '/Proprietaires',
    icon: icon('ic_proprietaire'),
  },
  {
    title: 'Type of Materiels',
    path: '/typeMateriels ',
    icon: icon('ic_type'),
  },
  
];

export default navConfig;
