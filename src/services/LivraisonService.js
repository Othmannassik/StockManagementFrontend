import Http from './Http-Comman';

export const LivraisonService = {

  getLivraisons : async () => {
    const response = await Http.get('/livraisons');
    return response.data;
  },

  createLivraison : async (livraison, cmdId) => {
    const response =  await Http.post(`/livraisons/${cmdId}`, livraison);
    return response.data;
  },

  downloadBL : async (id) => {
    const response = await Http.get(`/files/${id}`, {responseType: 'blob'});
    return response;
},

  getLivraisonById: async (id) => {
    const response = await Http.get(`/livraisons/${id}`);
    return response.data;
  },

  updateLivraison: async(id, cmdId,livraison) => {
    const response = await Http.put(`/livraisons/${id}/${cmdId}`,livraison);
    return response.data;
  },

  deletePLivraison: async (id) => {
    const response = await Http.delete(`/livraisons/${id}`);
    return response.data;
  },

  cmdByLivraison: async (id) => {
    const response = await Http.get(`/livraisons/${id}/commande`);
    return response.data;
  },

  export: async () => {
    const response = await Http.get(`/livraisons/export`, { responseType: 'arraybuffer' });
    return response;
  },
};