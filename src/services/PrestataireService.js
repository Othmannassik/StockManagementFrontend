export const PrestataireService = {
    getPrestataireData() {
        return [
            {
                "id": 1,
                "Raison Social": "ElectroOmar",
                "Email":"electroomar@gmail.com",
                "Téléphone": "0545679809",
                "nbcmd": 7,
                "Adresse": "Rabat"
              }, 
              {
                "id": 2 ,
                "Raison Social": "ElectroYou",
                "Email":"electroYou@gmail.com",
                "Téléphone": "0545678909",
                "nbcmd": 6,
                "Adresse": "Casablanca",
              },
              {
                "id": 3,
                "Raison Social": "Electronic",
                "Email":"electronic@gmail.com",
                "Téléphone": "0545687683",
                "nbcmd": 10,
                "Adresse": "Rabat",
              },
              {
                "id": 4,
                "Raison Social": "Electro",
                "Email":"electro@gmail.com",
                "Téléphone": "0545666789",
                "nbcmd": 20,
                "Adresse":"Casablanca"
              },
              {
                "id": 5,
                "Raison Social": "Electrom",
                "Email":"electrom@gmail.com",
                "Téléphone": "0545679089",
                "nbcmd": 21,
                "Adresse":"Rabat"
              },
              {
                "id": 6,
                "Raison Social": "Electroo",
                "Email":"electroo@gmail.com",
                "Téléphone": "0545679890",
                "nbcmd": 7,
                "Adresse":"Casablanca",
              },
              {
                "id": 7,
                "Raison Social": "Electronc",
                "Email":"electronc@gmail.com",
                "Téléphone": "0545679028",
                "nbcmd": 9,
                "Adresse":"Rabat"
              }
        ];
    },

    getPrestataires() {
        return Promise.resolve(this.getPrestataireData());
    },
};

