import gql from "graphql-tag";

export const adminTypeDefs = gql`
  scalar DateTime

  # ---------------------------- Types ----------------------------
  type AdminProfile {
    userId: Int!
    name: String
    phone: String
    email: String
    approval: Boolean
  }

  type Hospital {
    id: Int!
    name: String!
    address: String!
    city: String!
    createdAt: DateTime
  }

  type CreateAdminResponse {
    userId: Int
    email: String
    name: String
    phone: String
    approval: Boolean
  }

  type UpdateAdminResponse {
    userId: Int
    email: String
    name: String
    phone: String
    approval: Boolean
  }

  type DeleteAdminResponse {
    userId: Int
    email: String
    name: String
    phone: String
    approval: Boolean
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
  input CreateAdminInput {
    email: String!
    password: String!
    name: String
    phone: String
  }

  input UpdateAdminInput {
    userId: Int!
    email: String
    password: String
    name: String
    phone: String
    approval: Boolean
  }

  input DeleteAdminInput {
    userId: Int!
  }

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

  input ApproveByAdminInput {
    userId: Int!
    approval: Boolean!
  }

  # ---------------------------- Queries ----------------------------
  type Query {
    # Admin
    getAllAdmins(page: Int, limit: Int): [AdminProfile!]!
    getPendingAdmins(page: Int, limit: Int): [AdminProfile!]!

    # Hospital
    getAllHospitals(page: Int, limit: Int): [Hospital!]!
    getHospitalById(id: Int!): Hospital
  }

  # ---------------------------- Mutations ----------------------------
  type Mutation {
    # Admin
    createAdmin(input: CreateAdminInput!): CreateAdminResponse!
    updateAdmin(input: UpdateAdminInput!): UpdateAdminResponse!
    deleteAdmin(input: DeleteAdminInput!): DeleteAdminResponse!

    # Admin Approval
    approveByAdmin(input: ApproveByAdminInput!): AdminProfile

    # Hospital
    createHospital(input: CreateHospitalInput!): CreateHospitalResponse!
    updateHospital(input: UpdateHospitalInput!): UpdateHospitalResponse!
    # deleteHospital(input: DeleteHospitalInput!): DeleteHospitalResponse!
  }
`;
