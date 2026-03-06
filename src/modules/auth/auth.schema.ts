import gql from "graphql-tag";

export const authTypeDefs = gql`
  scalar DateTime

  type CreateAdminPayload {
    userId: ID!
    email: String!
    approval: Boolean!
  }

  type AdminProfile {
    userId: String!
    approval: Boolean!
  }

  type LoginPayload {
    token: String!
    userId: ID!
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
    pendingAdmins: [AdminProfile!]!
  }

  type Mutation {
    createAdmin(input: CreateAdminInput!): CreateAdminPayload!
    loginAdmin(input: LoginInput!): LoginPayload!
  }
`;
