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


};