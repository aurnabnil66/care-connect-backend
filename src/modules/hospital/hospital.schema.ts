import gql from "graphql-tag";

export const hospitalTypeDefs = gql`
  scalar DateTime

  # ---------------------------- Types ----------------------------
  type Hospital {
    id: Int!
    name: String!
    address: String!
    city: String!
    createdAt: DateTime
  }

  type CreateHospitalResponse {
    id: Int!
    name: String!
    address: String!
    city: String!
    createdAt: DateTime
  }

  type UpdateHospitalResponse {
    id: Int!
    name: String!
    address: String!
    city: String!
    updatedAt: DateTime
  }

  type DeleteHospitalResponse {
    id: Int!
    name: String!
    address: String!
    city: String!
    deletedAt: DateTime
  }

  # ---------------------------- Inputs ----------------------------
  input CreateHospitalInput {
    name: String!
    address: String!
    city: String!
  }

  input UpdateHospitalInput {
    id: Int!
    name: String
    address: String
    city: String
  }

  input DeleteHospitalInput {
    id: Int!
  }

  # ---------------------------- Queries ----------------------------
  type Query {
    getAllHospitals(page: Int, limit: Int): [Hospital!]!
    getHospitalById(id: Int!): Hospital
  }

  # ---------------------------- Mutations ----------------------------
  type Mutation {
    createHospital(input: CreateHospitalInput!): CreateHospitalResponse!
    updateHospital(input: UpdateHospitalInput!): UpdateHospitalResponse!
    deleteHospital(input: DeleteHospitalInput!): DeleteHospitalResponse!
  }
`;
