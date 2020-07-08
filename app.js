const express = require("express");
const { ApolloServer, PubSub } = require("apollo-server-express");
const models = require("./models");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const { getAuthUser } = require("./utils");
const http = require("http");

const app = express();
const port = 4000;

const pubSub = new PubSub();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, connection }) => {
    if (connection) {
      return { models, pubSub };
    } else {
      const authUser = getAuthUser(req);
      return { models, authUser, pubSub };
    }
  },
});

server.applyMiddleware({ app, cors: true });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port }, () => {
  console.info(`server ready at http://localhost:${port}${server.graphqlPath}`);
  console.log(
    `Subscription Server running at ws://localhost:${port}${server.subscriptionsPath}`
  );
});
