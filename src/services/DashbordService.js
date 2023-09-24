import Http from './Http-Comman';

export const DashboardService = {

    materielsCount: async (token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.get(`/materiel-details/count`, {headers});
        return response.data;
    },

    pendingCmdCount: async (token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.get(`/commandes/pending`, {headers});
        return response.data;
    },

    countMaterielsNotUsed: async (token) => {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await Http.get(`/materiel-details/notUsedMat`, {headers});
        return response.data;
    },
};