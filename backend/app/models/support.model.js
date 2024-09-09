const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Support = sequelize.define("support", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
    validate: {
      len: [10], // Minimum length of 10 characters
    },
  },
  message: {
    type: DataTypes.STRING,
  },
  user: {
    type: DataTypes.UUID,
  },
});

module.exports = Support;
