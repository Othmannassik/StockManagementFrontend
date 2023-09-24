import Http from './Http-Comman';

export const TypeMaterielService = {


    // Retrieve a list of TypeMateriels
    getTypeMateriels: async (token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.get(`/typeMateriels`, {headers});
        return response.data;
    },

    // Create a new TypeMateriel
    createTypeMateriel: async (typeMateriel, token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.post(`/typeMateriels`, typeMateriel, {headers});
        return response.data;
    },

    // Retrieve a single TypeMateriel by ID
    getTypeMaterielById: async (id, token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.get(`/typeMateriels/${id}`, {headers});
        return response.data;
    },

    // Update an existing TypeMateriel
    updateTypeMateriel: async (id, typeMateriel, token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.put(`/typeMateriels/${id}`, typeMateriel, {headers});
        return response.data;
    },

    // Delete a TypeMateriel by ID
    deleteTypeMateriel: async (id, token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.delete(`/typeMateriels/${id}`, {headers});
        return response.data;
    },

        // Count Materiels by TypeMateriels
        nbMatByTypeMateriel: async (id, token) => {
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const response = await Http.get(`/typeMateriels/${id}/materiels`, {headers});
            return response.data;
          },

        // export TypeMateriels 
        export: async (token) => {
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const response = await Http.get(`/typeMateriels/export`, {headers, responseType: 'arraybuffer'});
            return response;
        },

};