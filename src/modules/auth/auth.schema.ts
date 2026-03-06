import gql from "graphql-tag";

export const authTypeDefs = gql`
  scalar DateTime

  type CreateAdminPayload {
    userId: ID!
    email: String!
  }

  type AdminProfile {
    id: ID!
    userId: String!
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

  type Mutation {
    createAdmin(input: CreateAdminInput!): CreateAdminPayload!
    loginAdmin(input: LoginInput!): LoginPayload!
  }
`;
