export const TypeMaterielService = {
    getMaterielData() {
        return [
            {
                "id": 1,
                "model": "Dell Latitude",
              },
              {
                "id": 2,
                "model": "Hp EliteBook",
              },
              {
                "id": 3,
                "model": "Lenovo Thinkpad",
              },
              {
                "id": 4,
                "model": "Asus",
              }
          ]
    },

    getMateriels() {
        return Promise.resolve(this.getMaterielData());
    },
};

