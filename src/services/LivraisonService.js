export const LivraisonService = {
  getLivraisonsData() {
      return [
          {
            id: '1000',
            numBl: 'f230fh0g3',
            numBc:209398,
            date: '19/08/2023',
            quantity: 1
          },
          {
            id: '1001',
            numBl: 'f230fh0g3',
            numBc:209398,
            date: '19/08/2023',
            quantity: 1
          },
          {
            id: '1002',
            numBl: 'f230fh0g3',
            numBc:209398,
            date: '19/08/2023',
            quantity: 1
          },
          {
            id: '1003',
            numBl: 'f230fh0g3',
            numBc:209398,
            date: '19/08/2023',
            quantity: 1
          },
          {
            id: '1004',
            numBl: 'f230fh0g3',
            numBc:209398,
            date: '19/08/2023',
            quantity: 1
          },
          {
            id: '1005',
            numBl: 'f230fh0g3',
            numBc:209398,
            date: '19/08/2023',
            quantity: 1
          },
          {
            id: '1006',
            numBl: 'f230fh0g3',
            numBc:209398,
            date: '19/08/2023',
            quantity: 1
          },
          {
            id: '1007',
            numBl: 'f230fh0g3',
            numBc:209398,
            date: '19/08/2023',
            quantity: 1
          },
          {
            id: '1008',
            numBl: 'f230fh0g3',
            numBc:209398,
            date: '19/08/2023',
            quantity: 1
          },
      ];
  },
    getLivraisons(){
        return Promise.resolve(this.getLivraisonsData());
    }
};

