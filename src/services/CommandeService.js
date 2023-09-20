import axios from 'axios';
import Http from './Http-Comman';

export const CommandeService = {
  
    // Retrieve a list of commandes
    getCommandes: async () => {
        const response = await Http.get(`/commandes`);
        return response.data;
    },

    // Retrieve a list of prestataires
    getPrestataires: async () => {
        const response = await Http.get(`/prestataires`);
        return response.data;
    },

    // Retrieve a list of etablissements
    getEtablissements: async () => {
        const response = await Http.get(`/etablissements`);
        return response.data;
    },

    // Add Commande
    addCommande: async (commande) => {
        const response = await Http.post(`/commandes`, commande);
        return response.data;
    },

    downloadBC : async (id) => {
        const response = await Http.get(`/files/${id}`, {responseType: 'blob'});
        return response;
    },

    // Update Commande
    updateCommande: async (id, commande) => {
        const response = await Http.put(`/commandes/${id}`, commande);
        return response.data;
    },

    // Delete Commande
    deleteCommande: async (id) => {
        const response = await Http.delete(`/commandes/${id}`);
        return response.data;
    },

  getCommandesWithLivraisonsData() {
      return [
        {
            id: '1000',
            numBc: 209398,
            date: '19/08/2023',
            quantity: 28,
            status: 'DELIVERED',
            prestataire: 'Ahmed',
            materiel: "HP elitebook",
            typeMateriel: 'Laptop',
            livraisons: [
                {
                    id: '1000-0',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                },
                {
                    id: '1000-1',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                },
                {
                    id: '1000-2',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                },
                {
                    id: '1000-3',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                }
            ]
        },
        {
            id: '1001',
            numBc: 209398,
            date: '19/08/2023',
            quantity: 24,
            status: 'PENDING',
            prestataire: 'Ali',
            materiel: "Lenovo Thinkpad",
            typeMateriel: 'Laptop',
            livraisons: [
                {
                    id: '1000-0',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                },
                {
                    id: '1000-1',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                }
            ]
        },
        {
            id: '1002',
            numBc: 209398,
            date: '19/08/2023',
            quantity: 19,
            status: 'PENDING',
            prestataire: 'Omar',
            materiel: "HP elitebook",
            typeMateriel: 'Laptop',
            livraisons: [
                {
                    id: '1000-0',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                },
                {
                    id: '1000-1',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                },
                {
                    id: '1000-2',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                }
            ]
        },
        {
            id: '1003',
            numBc: 209398,
            date: '19/08/2023',
            quantity: 5,
            status: 'CANCELED',
            prestataire: 'Ahmed',
            materiel: "Lenovo ThinkBook",
            typeMateriel: 'Laptop',
            livraisons: []
        },
        {
            id: '1004',
            numBc: 209398,
            date: '19/08/2023',
            quantity: 37,
            status: 'DELIVERED',
            prestataire: 'Mostafa',
            materiel: "HP",
            typeMateriel: 'Scanner',
            livraisons: [
                {
                    id: '1000-0',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                },
                {
                    id: '1000-1',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                },
                {
                    id: '1000-2',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                },
                {
                    id: '1000-3',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                }
            ]
        },
        {
            id: '1005',
            numBc: 209398,
            date: '19/08/2023',
            quantity: 9,
            status: 'DELIVERED',
            prestataire: 'Imad',
            materiel: "Azus",
            typeMateriel: 'Laptop',
            livraisons: [
                {
                    id: '1000-0',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                }
            ]
        },
        {
            id: '1006',
            numBc: 209398,
            date: '19/08/2023',
            quantity: 15,
            status: 'CREATED',
            prestataire: 'Ahmed',
            materiel: "Huwawi",
            typeMateriel: 'Lecteur NFC',
            livraisons: []
        },
        {
            id: '1007',
            numBc: 209398,
            date: '19/08/2023',
            quantity: 20,
            status: 'CANCELED',
            prestataire: 'Ahmed',
            materiel: "HP elitebook",
            typeMateriel: 'Accessories',
            livraisons: []
        },
        {
            id: '1008',
            numBc: 209398,
            date: '19/08/2023',
            quantity: 33,
            status: 'DELIVERED',
            prestataire: 'Karim',
            materiel: "Dell Latitude",
            typeMateriel: 'Laptop',
            livraisons: [
                {
                    id: '1000-0',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                },
                {
                    id: '1000-1',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                },
                {
                    id: '1000-2',
                    numBl: 'f230fh0g3',
                    date: '19/08/2023',
                    quantity: 1
                }
            ]
        },
        {
            id: '1009',
            numBc: 209398,
            date: '19/08/2023',
            quantity: 45,
            status: 'CREATED',
            prestataire: 'Yassine',
            materiel: "Dell",
            typeMateriel: 'Poste de travaile',
            livraisons: []
        },
      ];
  },

  getCommandesMini() {
      return Promise.resolve(this.getCommandesData().slice(0, 5));
  },

  getCommandesSmall() {
      return Promise.resolve(this.getCommandesData().slice(0, 10));
  },

  getCommandesWithLivraisonsSmall() {
      return Promise.resolve(this.getCommandesWithLivraisonsData().slice(0, 10));
  },

  getCommandesWithLivraisons() {
      return Promise.resolve(this.getCommandesWithLivraisonsData());
  }
};

