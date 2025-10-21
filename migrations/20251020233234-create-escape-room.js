'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EscapeRooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roomName: {
        type: Sequelize.STRING
      },
      layerCount: {
        type: Sequelize.INTEGER
      },
      timerMinutes: {
        type: Sequelize.INTEGER
      },
      layers: {
        type: Sequelize.JSON
      },
      keypadCode: {
        type: Sequelize.STRING
      },
      hint: {
        type: Sequelize.STRING
      },
      quizUnlock: {
        type: Sequelize.STRING
      },
      helpContent: {
        type: Sequelize.TEXT
      },
      quiz: {
        type: Sequelize.JSON
      },
      h1: {
        type: Sequelize.TEXT
      },
      h2: {
        type: Sequelize.TEXT
      },
      h3: {
        type: Sequelize.TEXT
      },
      hiddenQuestion: {
        type: Sequelize.STRING
      },
      hiddenAnswer: {
        type: Sequelize.STRING
      },
      sequenceChunks: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EscapeRooms');
  }
};