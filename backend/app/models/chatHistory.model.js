const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration
const User = require('./user.model');

const ChatHistory = sequelize.define('chatHistories', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    project: {
        type: DataTypes.INTEGER
    },
    userid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'User', // Make sure it matches the actual table name of the Organization model
            key: 'id',
        },
    },
    sessionId: {
        type: DataTypes.STRING
    },
    usertype: {
        type: DataTypes.JSON({
            user: DataTypes.STRING,
            finalResponse: DataTypes.STRING
        })
    },
    timestamp: {
        type: DataTypes.STRING,
        defaultValue: Date.now().toLocaleString('en-US', { timeZone: 'EST' })
    },
});

ChatHistory.belongsTo(User, { foreignKey: 'userid', as: 'ownerdetails' });

module.exports = ChatHistory;
