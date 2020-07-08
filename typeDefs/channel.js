const { gql } = require("apollo-server-express");

module.exports = gql`
  type Channel {
    id: ID!
    name: String!
    slug: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  extend type Query {
    channels: [Channel!]!
  }
`;
