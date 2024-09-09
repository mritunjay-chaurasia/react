const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration

const OrgToken = sequelize.define('orgTokens', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    organization: {
        type: DataTypes.INTEGER,
    },
    projectid: {
        type: DataTypes.INTEGER,
    },
    openapikey: {
        type: DataTypes.STRING,
        defaultValue:'null',
    },
    serpapikey: {
        type: DataTypes.STRING,
        defaultValue:'null',
    },
    rtekey: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
});

module.exports = OrgToken;
