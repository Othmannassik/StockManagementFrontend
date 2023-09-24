import Http from './Http-Comman';

export const LivraisonService = {

  getLivraisons : async (token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.get('/livraisons', {headers});
    return response.data;
  },

  createLivraison : async (livraison, cmdId, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response =  await Http.post(`/livraisons/${cmdId}`, livraison, {headers});
    return response.data;
  },

  downloadBL : async (id, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.get(`/files/${id}`, {headers, responseType: 'blob'});
    return response;
},

  getLivraisonById: async (id, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.get(`/livraisons/${id}`, {headers});
    return response.data;
  },

  updateLivraison: async(id, cmdId,livraison, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.put(`/livraisons/${id}/${cmdId}`,livraison , {headers});
    return response.data;
  },

  deletePLivraison: async (id, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.delete(`/livraisons/${id}`, {headers});
    return response.data;
  },

  cmdByLivraison: async (id, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.get(`/livraisons/${id}/commande`, {headers});
    return response.data;
  },

  export: async (token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.get(`/livraisons/export`, { headers, responseType: 'arraybuffer' });
    return response;
  },
};