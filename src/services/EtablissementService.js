import Http from './Http-Comman';

export const EtablissementService = {


    // Retrieve a list of Etablissements
    getEtablissements: async (token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.get(`/etablissements`, {headers});
        return response.data;
    },

    // Create a new Etablissement
    createEtablissement: async (Etablissement, token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.post(`/etablissements`, Etablissement, {headers});
        return response.data;
    },

    // Retrieve a single Etablissement by ID
    getEtablissementById: async (id, token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.get(`/etablissements/${id}`, {headers});
        return response.data;
    },

    // Update an existing Etablissement
    updateEtablissement: async (id, Etablissement, token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.put(`/etablissements/${id}`, Etablissement , {headers});
        return response.data;
    },

    // Delete a Etablissement by ID
    deleteEtablissement: async (id, token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.delete(`/etablissements/${id}`, {headers});
        return response.data;
    },

    // Count Materiels by Etablissement
    nbMatByEtablissement: async (id, token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.get(`/etablissements/${id}/materiels`, {headers});
        return response.data;
      },

    // export Etablissements 
    export: async (token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
     const response = await Http.get(`/etablissements/export`, { headers, responseType: 'arraybuffer' });
     return response;
    },
};