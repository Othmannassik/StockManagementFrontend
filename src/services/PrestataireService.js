import Http from './Http-Comman';

export const PrestataireService = {

  getPrestataires : async () => {
    const response = await Http.get('/prestataires');
    return response.data;
  },

  createPrestataire : async (prestataire) => {
    const response =  await Http.post("/prestataires", prestataire);
    return response.data;
  },

  getPrestataireById: async (id) => {
    const response = await Http.get(`/prestataires/${id}`);
    return response.data;
  },

  updatePrestataire: async(prestataire) => {
    const response = await Http.put(`/prestataires/${prestataire.idPres}`,prestataire);
    return response.data;
  },

  deletePrestataire: async (id) => {
    const response = await Http.delete(`/prestataires/${id}`);
    return response.data;
  },

  nbCmdByPrestataire: async (id) => {
    const response = await Http.get(`/prestataires/${id}/commandes`);
    return response.data;
  },

};