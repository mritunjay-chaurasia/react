const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration

const RepoFlow = sequelize.define('repoFlows', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    projectId: {
        type: DataTypes.INTEGER,
    },
    sessionId: {
        type: DataTypes.STRING,
    },
    repoName: {
        type: DataTypes.STRING,
    },
    stepCount: {
        type: DataTypes.INTEGER,
    },
    repoDescription: {
        type: DataTypes.STRING,
    },
    allqna: {
        type: DataTypes.ARRAY(DataTypes.JSON),
    },
    summary: {
        type: DataTypes.STRING,
    },
    collectiveRequirement: {
        type: DataTypes.STRING,
    },
    flowchart: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true
});

module.exports = RepoFlow;