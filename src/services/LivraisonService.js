import Http from './Http-Comman';

export const LivraisonService = {

  getLivraisons : async () => {
    const response = await Http.get('/livraisons');
    return response.data;
  },

  createLivraison : async (livraison) => {
    const response =  await Http.post("/livraisons", livraison);
    return response.data;
  },

  getLivraisonById: async (id) => {
    const response = await Http.get(`/livraisons/${id}`);
    return response.data;
  },

  updateLivraison: async(livraison) => {
    const response = await Http.put(`/livraisons/${livraison.idLiv}`,livraison);
    return response.data;
  },

  deletePLivraison: async (id) => {
    const response = await Http.delete(`/livraisons/${id}`);
    return response.data;
  },

};