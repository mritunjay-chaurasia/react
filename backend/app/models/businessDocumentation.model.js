const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration

const BusinessDocumentation = sequelize.define('businessDocumentations', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    toolId: {
        type: DataTypes.INTEGER,
    },
    businessDocs: {
        type: DataTypes.JSON,
    },
    type: {
        type: DataTypes.STRING,
    },
    projectId: {
        type: DataTypes.INTEGER,
    },
}, {
    timestamps: true,
});

module.exports = BusinessDocumentation;