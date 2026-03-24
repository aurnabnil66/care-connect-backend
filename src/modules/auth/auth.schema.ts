import gql from "graphql-tag";

export const authTypeDefs = gql`
  scalar DateTime

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

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    getAdminProfile: AdminProfile
  }

  type Mutation {
    registerAdmin(input: CreateAdminInput!): AdminProfile!
    loginAdmin(input: LoginInput!): LoginPayload!
  }
`;
