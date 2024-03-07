"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("characters", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gameId: {
        type: Sequelize.INTEGER,
        references: {
          model: "games",
          key: "id",
        },
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thumbnailPath: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thumbnailHeight: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      thumbnailWidth: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rectStartX: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rectStartY: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rectEndX: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rectEndY: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("characters");
  },
};
