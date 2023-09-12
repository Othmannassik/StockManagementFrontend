import Http from './Http-Comman';

export const EtablissementService = {


    // Retrieve a list of Etablissements
    getEtablissements: async () => {
        const response = await Http.get(`/etablissements`);
        return response.data;
    },

    // Create a new Etablissement
    createEtablissement: async (Etablissement) => {
        const response = await Http.post(`/etablissements`, Etablissement);
        return response.data;
    },

    // Retrieve a single Etablissement by ID
    getEtablissementById: async (id) => {
        const response = await Http.get(`/etablissements/${id}`);
        return response.data;
    },

    // Update an existing Etablissement
    updateEtablissement: async (Etablissement) => {
        const response = await Http.put(`/etablissements/${Etablissement.idTypeMat}`, Etablissement);
        return response.data;
    },

    // Delete a Etablissement by ID
    deleteEtablissement: async (id) => {
        const response = await Http.delete(`/etablissements/${id}`);
        return response.data;
    },

    // Count Materiels by Etablissement
    nbMatByEtablissement: async (id) => {
        const response = await Http.get(`/etablissements/${id}/materiels`);
        return response.data;
      },
};