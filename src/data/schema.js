const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date
  type User {
    id: ID
    isActive: Boolean
    isDeleted: Boolean
    createdOn: Date
    updatedOn: Date
    name: String
    email: String
    mobileNumber: String
    emailVerified: Boolean
    password: String
    country: String
  }

  input UserInput {
    name: String!
    email: String!
    mobileNumber: String!
    password: String!
    country: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getUserByID(id: ID!): User
    getUsers: [User]
  }
  type Mutation {
    signup(input: UserInput!): User
    login(input: LoginInput!): AuthPayload!
  }
`;

module.exports = { typeDefs };
