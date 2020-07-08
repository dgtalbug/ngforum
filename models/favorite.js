"use strict";
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define(
    "Favorite",
    {
      replyId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
    },
    { timestamps: false }
  );
  Favorite.associate = function (models) {
    // associations can be defined here
  };
  Favorite.removeAttribute("id");
  return Favorite;
};
