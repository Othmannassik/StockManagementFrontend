export const ProprietaireService = {
    getProprietaireData() {
        return [
            {
                "id": 1,
                "firstName": "Hicham",
                "lastName": "Abassi",
                "email": "h.abassi@gmail.com",
                "telephone": "036383389",
                "materiels": [
                  {
                    "id" : 1,
                    "model": "Mac",
                    "date": "19/09/2023",
                    "motif": "affectation"
                  }
                ]
              },
              {
                "id": 2,
                "firstName": "Imad",
                "lastName": "barikhi",
                "email": "i.barikhi@gmail.com",
                "telephone": "98850950",
                "materiels": [
                  {
                    "id" : 1,
                    "model": "Lenovo",
                    "date": "19/09/2023",
                    "motif": "affectation"
                  },
                  {
                    "id" : 2,
                    "model": "Dell",
                    "date": "19/09/2023",
                    "motif": "affectation"
                  }
                ]
              },
              {
                "id": 3,
                "firstName": "Nada",
                "lastName": "Ayouti",
                "email": "n.ayouti@gmail.com",
                "telephone": "494984983",
                "materiels": []
              },
              {
                "id": 4,
                "firstName": "Zineb",
                "lastName": "Idrissi",
                "email": "z.idrissi@gmail.com",
                "telephone": "74009309309",
                "materiels": [
                  {
                    "id" : 1,
                    "model": "Accer",
                    "date": "19/09/2023",
                    "motif": "affectation"
                  }
                ]
              },
              {
                "id": 5,
                "firstName": "Hicham",
                "lastName": "Abassi",
                "email": "h.abassi@gmail.com",
                "telephone": "036383389",
                "materiels": []
              },
              {
                "id": 6,
                "firstName": "Yassmine",
                "lastName": "Zaki",
                "email": "y.zaki@gmail.com",
                "telephone": "590589409",
                "materiels": [
                  {
                    "id" : 1,
                    "model": "HP",
                    "date": "19/09/2023",
                    "motif": "affectation"
                  },
                  {
                    "id" : 1,
                    "model": "Dell",
                    "date": "19/09/2023",
                    "motif": "affectation"
                  },
                  {
                    "id" : 1,
                    "model": "Thinkpad",
                    "date": "19/09/2023",
                    "motif": "affectation"
                  }
                ]
              },
              {
                "id": 7,
                "firstName": "Jalal",
                "lastName": "Chabaki",
                "email": "j.chabaki@gmail.com",
                "telephone": "398383093",
                "materiels": []
              },
              {
                "id": 8,
                "firstName": "Aya",
                "lastName": "Dissaoui",
                "email": "a.dissaoui@gmail.com",
                "telephone": "309398409",
                "materiels": [
                  {
                    "id" : 1,
                    "model": "Dell",
                    "date": "19/09/2023",
                    "motif": "affectation"
                  }
                ]
              },
              {
                "id": 9,
                "firstName": "Omar",
                "lastName": "Hidach",
                "email": "o.hidach@gmail.com",
                "telephone": "398302044",
                "materiels": []
              },
              {
                "id": 10,
                "firstName": "Ali",
                "lastName": "Igamane",
                "email": "a.igamane@gmail.com",
                "telephone": "3304843094",
                "materiels": [
                  {
                    "id" : 1,
                    "model": "Azus",
                    "date": "19/09/2023",
                    "motif": "affectation"
                  }
                ]
              },
        ];
    },

    getProprietaires() {
        return Promise.resolve(this.getProprietaireData());
    },
};

