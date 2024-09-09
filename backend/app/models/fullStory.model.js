const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration

const FullStory = sequelize.define('fullStory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userSessionId: {
        type: DataTypes.STRING
    },
    events: {
        type: DataTypes.ARRAY(DataTypes.JSON)
    }
}, {
    timestamps: true
});

module.exports = FullStory;
