import gql from "graphql-tag";

export const authTypeDefs = gql`
  scalar DateTime

  type AdminProfile {
    id: ID!
    userId: String!
  }

  type Hospital {
    id: ID!
    name: String!
    address: String!
    city: String!
    createdAt: DateTime
  }

  input createHospitalInput {
    name: String!
    address: String!
    city: String!
  }

  type Query {
    getAdminProfile: AdminProfile
    getAllHospitals: [Hospital!]!
  }

  type Mutation {
    createHospital(input: createHospitalInput!): Hospital!
  }
`;
