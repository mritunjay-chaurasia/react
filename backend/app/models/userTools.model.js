const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration

const UserTool = sequelize.define('userTools', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    toolMaster: {
        type: DataTypes.INTEGER
    },
    repoName: {
        type: DataTypes.STRING
    },
    ownerName: {
        type: DataTypes.STRING
    },
    project: {
        type: DataTypes.INTEGER
    },
    icon: {
        type: DataTypes.STRING,
        defaultValue: "ri-tools-fill"
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "active"
    },
    connectionDate: {
        type: DataTypes.STRING,
        defaultValue: Date.now()
    },
    statusChangeDate: {
        type: DataTypes.STRING,
        defaultValue: Date.now()
    },
    pluginType: {
        type: DataTypes.STRING
    },
    pluginTypeName: {
        type: DataTypes.STRING
    },
    pluginName: {
        type: DataTypes.STRING
    },
    pluginDescription: {
        type: DataTypes.STRING
    },
    pluginDetails: {
        type: DataTypes.JSON
    },
    persistDirectoryPath: {
        type: DataTypes.STRING
    },
    documentation: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
    documentationStatus:{
        type:DataTypes.STRING,
        defaultValue:'Uploading',
    },
    nodeProject: {
        type:DataTypes.BOOLEAN,
        defaultValue: false,
    },
    reactProject: {
        type:DataTypes.BOOLEAN,
        defaultValue: false,
    },
    routes: {
        type: DataTypes.ARRAY(DataTypes.JSON),
    },
    interactionStructure: {
        type: DataTypes.ARRAY(DataTypes.JSON),
    },
    userFlowData: {
        type: DataTypes.ARRAY(DataTypes.JSON),
    }
}, {
    timestamps: true,
});

module.exports = UserTool;

