"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          id: uuidv4(),
          username: "admin",
          email: "admin@admin.com",
          password: await bcrypt.hash("welcome@", 10),
          role: "ADMIN",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
