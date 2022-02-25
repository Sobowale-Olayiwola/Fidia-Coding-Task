const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date
  """
  A Fidia user
  """
  type User {
    "Fidia's user unique ID"
    id: ID
    "To determine if the user is still active based on activities on Fidia platform"
    isActive: Boolean
    "To determine if a soft delete is performed on the user due to data science"
    isDeleted: Boolean
    "The date of creation of Fidia user account"
    createdOn: Date
    "The date of last update performed on the user"
    updatedOn: Date
    "Fidia's user name"
    name: String
    "Fidia's user email"
    email: String
    "Fidia's user mobile number"
    mobileNumber: String
    "To determine if the user has verified their account via email"
    emailVerified: Boolean
    "The Fidia's user password which is hashed due to security reasons"
    password: String
    "The Fidia's user country of location"
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
