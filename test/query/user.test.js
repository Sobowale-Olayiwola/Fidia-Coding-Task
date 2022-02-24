const { expect } = require("chai");
const resolvers = require("../../src/data/resolvers");
const { typeDefs } = require("../../src/data/schema");
const EasyGraphQLTester = require("easygraphql-tester");
describe("Tests User Queries", () => {
  let tester;
  beforeEach(() => {
    tester = new EasyGraphQLTester(typeDefs, resolvers);
  });

  describe("Queries list of registered users", () => {
    it("fetches all registered users", () => {
      const query = `
        {
            getUsers {
             id
             name
             emailVerified
             country
             email
            }
        }
        `;
      const fixture = {
        data: {
          getUsers: [
            {
              name: "Patience",
              country: "Nigeria",
              updatedOn: 1645649222866,
              createdOn: 1645649222866,
              isDeleted: false,
              isActive: true,
              id: "62169d46186a97b43ddc183b",
              email: "patience@gmail.com",
              mobileNumber: "07064714787",
              emailVerified: false,
              password:
                "$2b$10$1fUUhHqdLJFRiQ3L0XYQf.ZJhfvXKuyW4WkQSpSCWxXIF75ONrlum",
            },
            {
              name: "Gideon",
              country: "Nigeria",
              updatedOn: 1645708965183,
              createdOn: 1645708965183,
              isDeleted: false,
              isActive: true,
              id: "621786a5c6d41260492aa61f",
              email: "gideon@gmail.com",
              mobileNumber: "07064734787",
              emailVerified: false,
              password:
                "$2b$10$vh6bQXVr0ixA2jHjBfekJ.5nAGH7/bGBEE9S2/2b3lC8cHbFs6hja",
            },
            {
              name: "Stanley",
              country: "Nigeria",
              updatedOn: 1645731288841,
              createdOn: 1645731288841,
              isDeleted: false,
              isActive: true,
              id: "6217ddd84c9d79746d8d830f",
              email: "stanley@gmail.com",
              mobileNumber: "07062734787",
              emailVerified: false,
              password:
                "$2b$10$aWWC8ThknnMXlLZhvDzYWODoix9CqBop3vFsci/m827XBq1b0pn7e",
            },
            {
              name: "Stanley",
              country: "Nigeria",
              updatedOn: 1645731683700,
              createdOn: 1645731683700,
              isDeleted: false,
              isActive: true,
              id: "6217df63691a5398584306b4",
              email: "peter@gmail.com",
              mobileNumber: "08062734787",
              emailVerified: false,
              password:
                "$2b$10$4uynv2f6TMNH0ivLymUsde/FHHo2MHURQIkiXUdYhFFiv4U1iRtG2",
            },
            {
              name: "Stanley",
              country: "Nigeria",
              updatedOn: 1645735506216,
              createdOn: 1645735506216,
              isDeleted: false,
              isActive: true,
              id: "6217ee523fdc3be27add1678",
              email: "peters@gmail.com",
              mobileNumber: "0702734787",
              emailVerified: false,
              password:
                "$2b$10$BDnroMT9CAVm7PHSjSJiFer7kP4cO.o3XikZnHvI.WNpovV7TxJEy",
            },
          ],
        },
      };

      const {
        data: { getUsers },
      } = tester.mock({ query, fixture });
      for (let i = 0; i < getUsers.length; i++) {
        expect(getUsers[i]).to.have.all.keys(
          "id",
          "name",
          "emailVerified",
          "country",
          "email"
        );
      }
    });
  });
});
