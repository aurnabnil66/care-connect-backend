import gql from "graphql-tag";

export const authTypeDefs = gql`
  scalar DateTime

  type CreateAdminPayload {
    userId: Int!
    email: String!
    approval: Boolean!
  }

  type AdminProfile {
    userId: Int!
    email: String!
    approval: Boolean!
  }

  type LoginPayload {
    token: String!
    userId: Int!
    email: String!
    role: String!
  }

  input CreateAdminInput {
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    getAdminProfile: AdminProfile
  }

  type Mutation {
    createAdmin(input: CreateAdminInput!): CreateAdminPayload!
    registerAdmin(input: CreateAdminInput!): CreateAdminPayload!
    loginAdmin(input: LoginInput!): LoginPayload!
  }
`;
