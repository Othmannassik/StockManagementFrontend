import Http from './Http-Comman';

export const PrestataireService = {

  getPrestataires : async (token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.get('/prestataires', {headers});
    return response.data;
  },

  createPrestataire : async (prestataire, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response =  await Http.post("/prestataires", prestataire, {headers});
    return response.data;
  },

  getPrestataireById: async (id, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.get(`/prestataires/${id}`, {headers});
    return response.data;
  },

  updatePrestataire: async(id,prestataire, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.put(`/prestataires/${id}`,prestataire, {headers});
    return response.data;
  },

  deletePrestataire: async (id, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.delete(`/prestataires/${id}`, {headers});
    return response.data;
  },

  nbCmdByPrestataire: async (id, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.get(`/prestataires/${id}/commandes`, {headers});
    return response.data;
  },

          // export Prestataires 
          export: async (token) => {
            const headers = {
              Authorization: `Bearer ${token}`
          };
            const response = await Http.get(`/prestataires/export`, { headers, responseType: 'arraybuffer' });
            return response;
        },

};