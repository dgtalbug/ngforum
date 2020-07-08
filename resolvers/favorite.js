module.exports = {
  Favorite: {
    user(favorite, args, { models }) {
      return models.User.findByPk(favorite.userId);
    },
    reply(favorite, args, { models }) {
      return models.Reply.findByPk(favorite.replyId);
    },
  },
};
