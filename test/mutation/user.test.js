const sinon = require("sinon");
const { expect } = require("chai");
const { Users } = require("../../src/data/models/User");
const EasyGraphQLTester = require("easygraphql-tester");
const resolvers = require("../../src/data/resolvers");
const { typeDefs } = require("../../src/data/schema");
const { userMutations } = require("../../src/data/resolvers/Mutation/User");
const { signup, login } = userMutations;
describe("Tests User Mutations", () => {
  let tester;
  beforeEach(() => {
    tester = new EasyGraphQLTester(typeDefs, resolvers);
    global.hashObject = sinon.spy((object) => "yryrt3647648HFHJE&%^@%%@jdhfh");
    global.generateToken = sinon.spy(
      (payload) => "tdyfhyhfdh356784949i39fhjfhyr7hf"
    );
    global.sendEmail = sinon.spy(({ user, emailContent }) => {
      return {
        message: "Email Sent",
      };
    });
  });

  afterEach(() => {
    sinon.restore();
  });
  describe("User signup", () => {
    it("throws an error when invalid field is provided", async () => {
      let error;
      try {
        const mutation = `
                mutation signup($input: UserInput!) {
                    signup(input: $input) {
                        name
                        email
                        mobileNumber
                        password
                        country
                    }
                }      
              `;
        tester.test(true, mutation, {
          input: {
            name: "tolu",
            email: "patience@gmail.com",
            mobilePhoneNumber: "070637387292",
            password: "password",
            country: "Nigeria",
          },
        });
      } catch (e) {
        error = e;
      }
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.be.eq(
        'Variable "$input" got invalid value { name: "tolu", email: "patience@gmail.com", mobilePhoneNumber: "070637387292", password: "password", country: "Nigeria" }; Field "mobileNumber" of required type "String!" was not provided.'
      );
    });
    it("throws an error when user exists and email is verified", async () => {
      let error;
      try {
        sinon.stub(Users, "find").returns([
          {
            name: "Patience",
            country: "Nigeria",
            isDeleted: false,
            isActive: true,
            id: "62169d46186a97b43ddc183b",
            email: "patience@gmail.com",
            mobileNumber: "07064714787",
            emailVerified: true,
            password:
              "$2b$10$1fUUhHqdLJFRiQ3L0XYQf.ZJhfvXKuyW4WkQSpSCWxXIF75ONrlum",
          },
        ]);
        let root;
        await signup(root, {
          input: {
            name: "tolu",
            email: "patience@gmail.com",
            mobilePhoneNumber: "070637387292",
            password: "password",
            country: "Nigeria",
          },
        });
      } catch (err) {
        error = err;
      }
      expect(error.message).to.be.eq("Please kindly login");
    });
    it("throws an error when user exist and has not verified email", async () => {
      let error;
      try {
        sinon.stub(Users, "find").returns([
          {
            name: "Patience",
            country: "Nigeria",
            isDeleted: false,
            isActive: true,
            id: "62169d46186a97b43ddc183b",
            email: "patience@gmail.com",
            mobileNumber: "07064714787",
            emailVerified: false,
            password:
              "$2b$10$1fUUhHqdLJFRiQ3L0XYQf.ZJhfvXKuyW4WkQSpSCWxXIF75ONrlum",
          },
        ]);
        let root;
        await signup(root, {
          input: {
            name: "tolu",
            email: "patience@gmail.com",
            mobileNumber: "070637387292",
            password: "password",
            country: "Nigeria",
          },
        });
      } catch (err) {
        error = err;
      }
      expect(error.message).to.be.eq(
        "Kindly check your email and click the verification link"
      );
    });
    it("should create a user and send confirmation email", async () => {
      sinon.stub(Users, "find").returns([]);

      const userResponse = {
        name: "Peter",
        country: "Nigeria",
        isDeleted: false,
        isActive: true,
        id: "62169d46186a97b43ddc183b",
        email: "peter@gmail.com",
        mobileNumber: "070637387292",
        emailVerified: false,
        password:
          "$2b$10$1fUUhHqdLJFRiQ3L0XYQf.ZJhfvXKuyW4WkQSpSCWxXIF75ONrlum",
      };
      sinon.stub(Users, "create").returns(userResponse);
      let root;
      const result = await signup(root, {
        input: {
          name: "Peter",
          email: "peter@gmail.com",
          mobileNumber: "070637387292",
          password: "password",
          country: "Nigeria",
        },
      });
      expect(result)
        .to.haveOwnProperty("id")
        .to.be.eq("62169d46186a97b43ddc183b");
    });
  });

  describe("User login", () => {
    it("throws an error when existing user has not verified email", async () => {
      let error;
      try {
        sinon.stub(Users, "find").returns([
          {
            name: "Patience",
            country: "Nigeria",
            isDeleted: false,
            isActive: true,
            id: "62169d46186a97b43ddc183b",
            email: "patience@gmail.com",
            mobileNumber: "07064714787",
            emailVerified: false,
            password:
              "$2b$10$1fUUhHqdLJFRiQ3L0XYQf.ZJhfvXKuyW4WkQSpSCWxXIF75ONrlum",
          },
        ]);
        let root;
        await login(root, {
          input: {
            email: "patience@gmail.com",
            password: "password",
          },
        });
      } catch (err) {
        error = err;
      }
      expect(error.message).to.be.eq(
        "Kindly check your email and click the verification link"
      );
    });
  });
});
