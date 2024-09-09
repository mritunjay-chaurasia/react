const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration
const UserProject = require('./userprojects.model');

const FunctionData = sequelize.define('functionData', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fileName: {
        type: DataTypes.STRING
    },
    codeBlockTitle: {
        type: DataTypes.STRING
    },
    codeBlock: {
        type: DataTypes.STRING
    },
    refreshed: {
        type: DataTypes.BOOLEAN
    },
    toolId: {
        type: DataTypes.STRING
    },
    filePath: {
        type: DataTypes.STRING
    },
    imports: {
        type: DataTypes.BOOLEAN
    },
    codeBlockDocumentation: {
        type: DataTypes.STRING
    },
    codeBlockType: {
        type: DataTypes.STRING
    },
    projectType: {
        type: DataTypes.STRING
    },
    projectId: {
        type: DataTypes.STRING
    },
}, {
    timestamps: true,
});

module.exports = FunctionData;
