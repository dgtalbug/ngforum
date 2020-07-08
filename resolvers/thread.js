const { ApolloError, ForbiddenError } = require("apollo-server-express");

module.exports = {
  Query: {
    async thread(parent, { id }, { models }) {
      const thread = await models.Thread.findByPk(id);
      if (!thread) {
        throw new ApolloError("Thread Not found");
      }
      return thread;
    },
    async threads(parent, args, { models }) {
      return await models.Thread.findAll();
    },
  },
  Mutation: {
    createThread(parent, args, { models, authUser }) {
      if (authUser === null) {
        throw new ApolloError("Email already in use.");
      }
      return models.Thread.create({
        ...args,
        userId: authUser.id,
        lastRepliedAt: new Date(),
      });
    },
    async updateThread(
      parent,
      { id, title, content, channelId },
      { models, authUser }
    ) {
      const thread = await models.Thread.findByPk(id);
      if (authUser.id !== thread.userId) {
        throw new ForbiddenError("Not allowed");
      }
      await thread.update({ title, content, channelId });
      return thread;
    },
  },
  Thread: {
    creator(thread) {
      return thread.getUser();
    },
    channel(thread) {
      return thread.getChannel();
    },
    replies(thread) {
      return thread.getReplies();
    },
  },
};
