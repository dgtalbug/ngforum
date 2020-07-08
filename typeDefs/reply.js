const { gql } = require("apollo-server-express");

module.exports = gql`
  type Reply {
    id: ID!
    content: String!
    user: User!
    isBestAnswer: Boolean!
    favorites: [Favorite]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  extend type Mutation {
    createReply(threadId: ID!, content: String!): Reply!
    markAsFavorite(id: ID!): Favorite!
    unmarkAsFavorite(id: ID!): Boolean!
    markAsBestAnswer(id: ID!): Reply!
    unmarkAsBestAnswer(id: ID!): Reply!
    updateReply(id: ID!, content: String!): Reply!
    deleteReply(id: ID!): Boolean!
  }

  extend type Subscription {
    replyAdded: Reply!
    replyFavorited: Favorite!
    replyUnfavorited: Favorite!
    replyMarkedAsBestAnswer: Reply!
    replyUnmarkedAsBestAnswer: Reply!
  }
`;
