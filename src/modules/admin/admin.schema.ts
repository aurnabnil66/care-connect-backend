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

  input ApproveByAdminInput {
    userId: Int!
    approval: Boolean!
  }

  # ---------------------------- Queries ----------------------------
  type Query {
    getAllAdmins(page: Int, limit: Int): [AdminProfile!]!
    getPendingAdmins(page: Int, limit: Int): [AdminProfile!]!
  }

  # ---------------------------- Mutations ----------------------------
  type Mutation {
    createAdmin(input: CreateAdminInput!): CreateAdminResponse!
    updateAdmin(input: UpdateAdminInput!): UpdateAdminResponse!
    deleteAdmin(input: DeleteAdminInput!): DeleteAdminResponse!

    # Admin Approval
    approveByAdmin(input: ApproveByAdminInput!): AdminProfile
  }
`;
