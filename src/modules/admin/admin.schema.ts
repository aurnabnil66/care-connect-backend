import gql from "graphql-tag";

export const adminTypeDefs = gql`
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

  type Hospital {
    id: Int!
    name: String!
    address: String!
    city: String!
    createdAt: DateTime
  }

  input CreateAdminInput {
    email: String!
    password: String!
  }

  input createHospitalInput {
    name: String!
    address: String!
    city: String!
  }

  input approveByAdminInput {
    userId: Int!
    approval: Boolean!
  }

  type Query {
    pendingAdmins: [AdminProfile!]!
    getAllHospitals: [Hospital!]!
  }

  type Mutation {
    createAdmin(input: CreateAdminInput!): CreateAdminPayload!
    createHospital(input: createHospitalInput!): Hospital!
    approveByAdmin(input: approveByAdminInput!): AdminProfile
  }
`;
