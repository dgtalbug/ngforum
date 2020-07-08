"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Favorites", {
      replyId: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Favorites");
  },
};
