const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration

const ToolMaster = sequelize.define('toolMasters', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    toolname: {
        type: DataTypes.STRING
    },
    visiblename: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    icon: {
        type: DataTypes.STRING
    },
    toolimage: {
        type: DataTypes.STRING
    }
});

module.exports = ToolMaster;
