const { ForbiddenError } = require("apollo-server-express");
const REPLY_ADDED = "REPLY_ADDED";
const REPLY_FAVORITED = "REPLY_FAVORITED";
const REPLY_UNFAVORITED = "REPLY_UNFAVORITED";
const REPLY_MARKED_AS_BESTANSWER = "REPLY_MARKED_AS_BESTANSWER";
const REPLY_UNMARKED_AS_BESTANSWER = "REPLY_UNMARKED_AS_BESTANSWER";
module.exports = {
  Mutation: {
    async createReply(
      parent,
      { threadId, content },
      { models, authUser, pubSub }
    ) {
      const thread = await models.Thread.findByPk(threadId);
      const reply = await models.Reply.create({
        threadId,
        content,
        userId: authUser.id,
      });
      await thread.update({ lastRepliedAt: new Date() });

      pubSub.publish(REPLY_ADDED, { replyAdded: reply });

      return reply;
    },
    async markAsFavorite(parent, { id }, { models, authUser, pubSub }) {
      const [favorite] = await models.Favorite.findOrCreate({
        where: {
          replyId: id,
          userId: authUser.id,
        },
      });
      pubSub.publish(REPLY_FAVORITED, { replyFavorited: favorite });
      return favorite;
    },
    async unmarkAsFavorite(parent, { id }, { models, authUser, pubSub }) {
      const favorite = await models.Favorite.findOne({
        where: {
          replyId: id,
          userId: authUser.id,
        },
      });
      await favorite.destroy();
      pubSub.publish(REPLY_UNFAVORITED, { replyUnfavorited: favorite });

      return true;
    },
    async markAsBestAnswer(parent, { id }, { models, authUser, pubSub }) {
      const reply = await models.Reply.findByPk(id);

      const thread = await reply.getThread();
      if (thread.userId !== authUser.id) {
        throw new ForbiddenError("Not allowed");
      }

      await reply.update({ isBestAnswer: true });
      await thread.update({ isResolved: true });
      pubSub.publish(REPLY_MARKED_AS_BESTANSWER, {
        replyMarkedAsBestAnswer: reply,
      });

      return reply;
    },
    async unmarkAsBestAnswer(parent, { id }, { models, authUser, pubSub }) {
      const reply = await models.Reply.findByPk(id);

      const thread = await reply.getThread();
      if (thread.userId !== authUser.id) {
        throw new ForbiddenError("Not allowed");
      }

      await reply.update({ isBestAnswer: false });
      await thread.update({ isResolved: false });
      pubSub.publish(REPLY_UNMARKED_AS_BESTANSWER, {
        replyUnmarkedAsBestAnswer: reply,
      });

      return reply;
    },
    async updateReply(parent, { id, content }, { models, authUser }) {
      const reply = await models.Reply.findByPk(id);
      if (authUser.id !== reply.userId) {
        throw new ForbiddenError("Not Allowed");
      }

      await reply.update({ content });
      return reply;
    },
    async deleteReply(parent, { id, content }, { models, authUser }) {
      const reply = await models.Reply.findByPk(id);
      if (authUser.id !== reply.userId) {
        throw new ForbiddenError("not allowd");
      }
      await reply.destroy();
      return true;
    },
  },
  Reply: {
    favorites(reply, args, { models }) {
      return models.Favorite.findAll({
        where: {
          replyId: reply.id,
        },
      });
    },
    user(reply) {
      return reply.getUser();
    },
  },
  Subscription: {
    replyAdded: {
      subscribe(parent, args, { pubSub }) {
        return pubSub.asyncIterator(REPLY_ADDED);
      },
    },
    replyFavorited: {
      subscribe(parent, args, { pubSub }) {
        return pubSub.asyncIterator(REPLY_FAVORITED);
      },
    },
    replyUnfavorited: {
      subscribe(parent, args, { pubSub }) {
        return pubSub.asyncIterator(REPLY_UNFAVORITED);
      },
    },
    replyMarkedAsBestAnswer: {
      subscribe(parent, args, { pubSub }) {
        return pubSub.asyncIterator(REPLY_FAVORITED);
      },
    },
    replyUnmarkedAsBestAnswer: {
      subscribe(parent, args, { pubSub }) {
        return pubSub.asyncIterator(REPLY_FAVORITED);
      },
    },
  },
};
