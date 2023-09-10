import Http from './Http-Comman';

export const EtablissementService = {

  getEtablissements : async () => {
    const response = await Http.get('/etablissements');
    return response.data;
  },

  createEtablissement: async (etablissement) => {
    const response =  await Http.post("/etablissements", etablissement);
    return response.data;
  },

  getEtablissementById: async (id) => {
    const response = await Http.get(`/etablissements/${id}`);
    return response.data;
  },

  updateEtablissement: async(etablissement) => {
    const response = await Http.put(`/etablissements/${etablissement.id}`,etablissement);
    return response.data;
  },

  deleteEtablissement: async (id) => {
    const response = await Http.delete(`/etablissements/${id}`);
    return response.data;
  },

};