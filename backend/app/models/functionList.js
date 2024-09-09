const { DataTypes, STRING } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration

const FunctionList = sequelize.define('functionLists', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    code: {
        type: DataTypes.STRING
    },
    projectId: {
        type: DataTypes.STRING
    },
    steps: {
        type: DataTypes.ARRAY(DataTypes.JSON)
    },
});

module.exports = FunctionList;