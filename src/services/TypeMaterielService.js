import Http from './Http-Comman';

export const TypeMaterielService = {


    // Retrieve a list of TypeMateriels
    getTypeMateriels: async () => {
        const response = await Http.get(`/typeMateriels`);
        return response.data;
    },

    // Create a new TypeMateriel
    createTypeMateriel: async (typeMateriel) => {
        const response = await Http.post(`/typeMateriels`, typeMateriel);
        return response.data;
    },

    // Retrieve a single TypeMateriel by ID
    getTypeMaterielById: async (id) => {
        const response = await Http.get(`/typeMateriels/${id}`);
        return response.data;
    },

    // Update an existing TypeMateriel
    updateEtablissement: async (id, Etablissement) => {
        const response = await Http.put(`/etablissements/${id}`, Etablissement);
        return response.data;
    },

    // Delete a TypeMateriel by ID
    deleteTypeMateriel: async (id) => {
        const response = await Http.delete(`/typeMateriels/${id}`);
        return response.data;
    },


};