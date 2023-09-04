export const LivraisonService = {
    getMaterielData() {
        return [
            {
                "id": 1,
                "numBonLiv": 4005,
                "numBonCom": 48,
                "date:":9/5/2023,
                "quantity": "7594",
                "BonLiv":"Dell",
              },
              {
                "id": 2,
                "numBonLiv": 4006,
                "numBonCom": 49,
                "date:":9/5/2023,
                "quantity": "7595",
                "BonLiv":"Hp",
              },
              {
                "id": 3,
                "numBonLiv": 4007,
                "numBonCom": 50,
                "date:":10/5/2023,
                "quantity": "7596",
                "BonLiv":"Dell"
              },
        ];
    },

    getMateriels() {
        return Promise.resolve(this.getMaterielData());
    },
};

