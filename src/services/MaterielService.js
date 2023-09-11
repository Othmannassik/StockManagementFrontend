import Http from './Http-Comman';

export const MaterielService = {

  getMateriels : async () => {
    const response = await Http.get('/materiels');
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

  updateMateriel: async(materiel) => {
    const response = await Http.put(`/materiels/${materiel.idMat}`,materiel);
    return response.data;
  },

  deleteMateriel: async (id) => {
    const response = await Http.delete(`/materiels/${id}`);
    return response.data;
  },

};