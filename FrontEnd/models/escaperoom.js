'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EscapeRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EscapeRoom.init({
    layerCount: DataTypes.INTEGER,
    timerMinutes: DataTypes.INTEGER,
    layers: DataTypes.JSON,
    keypadCode: DataTypes.STRING,
    hint: DataTypes.STRING,
    quizUnlock: DataTypes.STRING,
    helpContent: DataTypes.TEXT,
    quiz: DataTypes.JSON,
    h1: DataTypes.TEXT,
    h2: DataTypes.TEXT,
    h3: DataTypes.TEXT,
    hiddenQuestion: DataTypes.STRING,
    hiddenAnswer: DataTypes.STRING,
    sequenceChunks: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'EscapeRoom',
  });
  return EscapeRoom;
};