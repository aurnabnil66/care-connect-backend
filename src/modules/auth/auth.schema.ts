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

  # type Hospital {
  #   id: ID!
  #   name: String!
  #   address: String!
  #   city: String!
  #   createdAt: DateTime
  # }

  input CreateAdminInput {
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  # input createHospitalInput {
  #   name: String!
  #   address: String!
  #   city: String!
  # }

  type Query {
    getAdminProfile: AdminProfile
    # getAllHospitals: [Hospital!]!
  }

  type Mutation {
    createAdmin(input: CreateAdminInput!): CreateAdminPayload!
    loginAdmin(input: LoginInput!): LoginPayload!
    # createHospital(input: createHospitalInput!): Hospital!
  }
`;
