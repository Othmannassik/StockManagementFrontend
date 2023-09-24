import http from "./Http-Comman";

export const ProprietaireService = {

  // Retrieve a list of proprietaires
    getProprietaires: async (token) => {
      const headers = {
        Authorization: `Bearer ${token}`
    };
      const response = await http.get(`/proprietaires`, {headers});
      return response.data;
    },
  
  // Retrieve a list of materiels by proprietaire
    getMaterielsByProprietaire: async (id, token) => {
      const headers = {
        Authorization: `Bearer ${token}`
    };
      const response = await http.get(`/proprietaires/${id}/affectations`, {headers});
      return response.data;
    },

    // add proprietaire
    addProprietaire: async (proprietaire, token) => {
      const headers = {
        Authorization: `Bearer ${token}`
    };
      const response = await http.post(`/proprietaires`, proprietaire, {headers});
      return response.data;
    },

    // update proprietaire
    updateProprietaire: async (id, proprietaire, token) => {
      const headers = {
        Authorization: `Bearer ${token}`
    };
      const response = await http.put(`/proprietaires/${id}`, proprietaire, {headers});
      return response.data;
    },

    // delete proprietaire
    deleteProprietaire: async (id, token) => {
      const headers = {
        Authorization: `Bearer ${token}`
    };
      const response = await http.delete(`/proprietaires/${id}`, {headers});
      return response.data;
    },

    // get materiels
    getMateriels: async (token) => {
      const headers = {
        Authorization: `Bearer ${token}`
    };
      const response = await http.get(`/materiel-details`, {headers});
      return response.data;
    },

    // delete a materiel
    deleteMateriel: async (id, token) => {
      const headers = {
        Authorization: `Bearer ${token}`
    };
      const response = await http.delete(`/affectations/${id}`, {headers});
      return response.data;
    },

    // add materiel to proprietaire
    addMaterielToProprietaire: async (affectationData, token) => {
      const headers = {
        Authorization: `Bearer ${token}`
    };
      const response = await http.post(`/affectations`, affectationData, {headers});
      return response.data;
    },

    export: async (token) => {
      const headers = {
        Authorization: `Bearer ${token}`
    };
      const response = await http.get(`/proprietaires/export`, { headers, responseType: 'arraybuffer' });
      return response;
    },

};

