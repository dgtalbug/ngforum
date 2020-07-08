"use strict";
const sequelizeSlugify = require("sequelize-slugify");
module.exports = (sequelize, DataTypes) => {
  const Thread = sequelize.define(
    "Thread",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      channelId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      stauts: {
        type: DataTypes.ENUM("UNSOLVED", "SOLVED"),
        defaultValue: "UNSOLVED",
        allowNull: false,
      },
      isLocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      lastRepliedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {}
  );
  Thread.associate = function (models) {
    // associations can be defined here
    Thread.belongsTo(models.User, { foreignKey: "userId" });
    Thread.belongsTo(models.Channel, { foreignKey: "channelId" });
    Thread.hasMany(models.Reply);
  };
  sequelizeSlugify.slugifyModel(Thread, {
    source: ["title"],
  });
  return Thread;
};
