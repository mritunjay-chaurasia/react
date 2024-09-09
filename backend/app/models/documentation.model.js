const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration
const User = require('./user.model');

const Documentation = sequelize.define('documentations', {
    requirementType:{
        type: DataTypes.STRING,
    },
    data: {
        type: DataTypes.STRING,
    },
    projectId: {
        type: DataTypes.INTEGER,
    },
    toolId: {
        type: DataTypes.INTEGER,
    },
    projectType: {
        type: DataTypes.STRING
    },
    isTechnical: {
        type: DataTypes.BOOLEAN
    },
    path: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.UUID
    },
}, {
    timestamps: true, // Disable automatic "createdAt" and "updatedAt" fields
  });

Documentation.belongsTo(User, { foreignKey: 'userId', as: 'userdetails' });

module.exports = Documentation;