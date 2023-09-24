import Http from './Http-Comman';

export const MaterielService = {

  getMateriels : async (token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.get('/materiels', {headers});
    return response.data;
  },

  getMaterielDetailsByMateriel : async (id, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.get(`/materiel-details/${id}/materiels`, {headers});
    return response.data;
  },

  createMateriel : async (materiel, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response =  await Http.post("/materiels", materiel, {headers});
    return response.data;
  },

  getMaterielById: async (id, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.get(`/materiels/${id}`, {headers});
    return response.data;
  }, 

  updateMateriel: async(id, materiel, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.put(`/materiels/${id}`,materiel, {headers});
    return response.data;
  },

  deleteMateriel: async (id, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.delete(`/materiels/${id}`, {headers});
    return response.data;
  },

  deleteMaterielDetail: async (id, token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.delete(`/materiel-details/${id}`, {headers});
    return response.data;
  },

  // export Materiels 
  export: async (token) => {
    const headers = {
      Authorization: `Bearer ${token}`
  };
    const response = await Http.get(`/materiels/export`, { headers, responseType: 'arraybuffer' });
    return response;
  },

};