const { gql } = require("apollo-server-express");

module.exports = gql`
  type Favorite {
    user: User!
    reply: Reply!
  }
`;
