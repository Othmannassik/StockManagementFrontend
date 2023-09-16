import Http from './Http-Comman';

export const MaterielService = {

  getMateriels : async () => {
    const response = await Http.get('/materiels');
    return response.data;
  },

  getMaterielDetailsByMateriel : async (id) => {
    const response = await Http.get(`/materiel-details/${id}/materiels`);
    return response.data;
  },

  createMateriel : async (materiel) => {
    const response =  await Http.post("/materiels", materiel);
    return response.data;
  },

  getMaterielById: async (id) => {
    const response = await Http.get(`/materiels/${id}`);
    return response.data;
  }, 

  updateMateriel: async(id, materiel) => {
    const response = await Http.put(`/materiels/${id}`,materiel);
    return response.data;
  },

  deleteMateriel: async (id) => {
    const response = await Http.delete(`/materiels/${id}`);
    return response.data;
  },

  deleteMaterielDetail: async (id) => {
    const response = await Http.delete(`/materiel-details/${id}`);
    return response.data;
  },

};