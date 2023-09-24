import axios from 'axios';
import Http from './Http-Comman';

export const CommandeService = {
  
    // Retrieve a list of commandes
    getCommandes: async (token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.get(`/commandes`, {headers});
        return response.data;
    },

    // Retrieve a list of prestataires
    getPrestataires: async (token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.get(`/prestataires`, {headers});
        return response.data;
    },

    // Retrieve a list of etablissements
    getEtablissements: async (token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.get(`/etablissements`, {headers});
        return response.data;
    },

    // Add Commande
    addCommande: async (commande, token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.post(`/commandes`, commande, {headers});
        return response.data;
    },

    downloadBC : async (id, token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.get(`/files/${id}`, { headers, responseType: 'blob'});
        return response;
    },

    // Update Commande
    updateCommande: async (id, commande, token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.put(`/commandes/${id}`, commande, {headers});
        return response.data;
    },

    // Delete Commande
    deleteCommande: async (id, token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.delete(`/commandes/${id}`, {headers});
        return response.data;
    },

    countLivraisonByCmd: async (id, token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.get(`/commandes/${id}/countLivraisons`, {headers});
        return response.data;
    },

    export: async (token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.get(`/commandes/export`, { headers, responseType: 'arraybuffer' });
        return response;
      },

};

