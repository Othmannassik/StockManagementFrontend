export const EtablissementService = {
  getEtablissementData() {
    return [{
        "idEtb": 1,
        "name": "Rhybox",
        "adresse": "94408 Anhalt Pass",
        "ville": "Nantes",
        "nb_Materiel": 1988
      },
      {
        "idEtb": 2,
        "name": "Flipbug",
        "adresse": "7141 Mayer Court",
        "ville": "Ponte Nova",
        "nb_Materiel": 1999
      },
      {
        "idEtb": 3,
        "name": "Abata",
        "adresse": "90984 Forster Court",
        "ville": "Kladovo",
        "nb_Materiel": 2001
      },
      // {
      //   "idEtb": 4,
      //   "name": "Innotype",
      //   "adresse": "7 Mosinee Lane",
      //   "ville": "Joliet",
      //   "nb_Materiel": 1999
      // },
      // {
      //   "idEtb": 5,
      //   "name": "Shufflebeat",
      //   "adresse": "7292 Hoard Trail",
      //   "ville": "Qigzhi",
      //   "nb_Materiel": 1996
      // },
      // {
      //   "idEtb": 6,
      //   "name": "Kazu",
      //   "adresse": "6 Thompson Park",
      //   "ville": "Eslāmābād",
      //   "nb_Materiel": 2012
      // },
      // {
      //   "idEtb": 7,
      //   "name": "Bubblemix",
      //   "adresse": "01 Coleman Trail",
      //   "ville": "Świebodzice",
      //   "nb_Materiel": 1996
      // },
      // {
      //   "idEtb": 8,
      //   "name": "Eidel",
      //   "adresse": "27 Summit Court",
      //   "ville": "Cochabamba",
      //   "nb_Materiel": 2008
      // },
      // {
      //   "idEtb": 9,
      //   "name": "Dynabox",
      //   "adresse": "83 Moose Way",
      //   "ville": "Chavárion",
      //   "nb_Materiel": 2011
      // },
      // {
      //   "idEtb": 10,
      //   "name": "Yotz",
      //   "adresse": "941 Oriole Alley",
      //   "ville": "Yankou",
      //   "nb_Materiel": 1986
      // },
      // {
      //   "idEtb": 11,
      //   "name": "Vinder",
      //   "adresse": "73147 Bonner Pass",
      //   "ville": "Dosso",
      //   "nb_Materiel": 2012
      // },
      // {
      //   "idEtb": 12,
      //   "name": "Meeveo",
      //   "adresse": "580 Hintze Point",
      //   "ville": "Fengshan",
      //   "nb_Materiel": 2012
      // },
      // {
      //   "idEtb": 13,
      //   "name": "Feedfire",
      //   "adresse": "2 Lunder Alley",
      //   "ville": "Quisqueya",
      //   "nb_Materiel": 1976
      // },
      // {
      //   "idEtb": 14,
      //   "name": "Flashdog",
      //   "adresse": "1 Merrick Circle",
      //   "ville": "Ipoh",
      //   "nb_Materiel": 1987
      // },
      // {
      //   "idEtb": 15,
      //   "name": "Yodoo",
      //   "adresse": "36052 Blackbird Trail",
      //   "ville": "Leribe",
      //   "nb_Materiel": 1993
      // },
      // {
      //   "idEtb": 16,
      //   "name": "Mymm",
      //   "adresse": "610 Becker Lane",
      //   "ville": "Kraaifontein",
      //   "nb_Materiel": 2013
      // },
      // {
      //   "idEtb": 17,
      //   "name": "Voonix",
      //   "adresse": "20 Brown Alley",
      //   "ville": "Aného",
      //   "nb_Materiel": 1999
      // },
      // {
      //   "idEtb": 18,
      //   "name": "Podcat",
      //   "adresse": "150 Garrison Street",
      //   "ville": "Palmares",
      //   "nb_Materiel": 2011
      // },
      // {
      //   "idEtb": 19,
      //   "name": "Podcat",
      //   "adresse": "42568 Bluestem Parkway",
      //   "ville": "Biaoshan",
      //   "nb_Materiel": 1996
      // },
      // {
      //   "idEtb": 20,
      //   "name": "Yoveo",
      //   "adresse": "25421 Novick Street",
      //   "ville": "Beilun",
      //   "nb_Materiel": 1993
      // },
      // {
      //   "idEtb": 21,
      //   "name": "Aimbo",
      //   "adresse": "8 Steensland Crossing",
      //   "ville": "Luofang",
      //   "nb_Materiel": 2007
      // },
      // {
      //   "idEtb": 22,
      //   "name": "Jabberbean",
      //   "adresse": "6911 Bonner Crossing",
      //   "ville": "Banhā",
      //   "nb_Materiel": 1996
      // },
      // {
      //   "idEtb": 23,
      //   "name": "Aimbo",
      //   "adresse": "5656 Waywood Point",
      //   "ville": "Condong",
      //   "nb_Materiel": 1987
      // },
      // {
      //   "idEtb": 24,
      //   "name": "Lazzy",
      //   "adresse": "81074 Valley Edge Pass",
      //   "ville": "Lokossa",
      //   "nb_Materiel": 1997
      // },
      // {
      //   "idEtb": 25,
      //   "name": "Teklist",
      //   "adresse": "46324 Bluejay Alley",
      //   "ville": "Helang",
      //   "nb_Materiel": 2009
      // }
    ]
  },

  getEtablissements() {
    return Promise.resolve(this.getEtablissementData());
  },
};
