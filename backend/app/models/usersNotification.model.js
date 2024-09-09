const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); 
const User = require('./user.model');

const UsersNotification = sequelize.define('usersNotification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    projectId: {
        type: DataTypes.INTEGER
    },
    notifiedBy:{
        type: DataTypes.UUID
    },
    type:{
        type: DataTypes.STRING
    },
    notifiedUsers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    notifiedTo: {
        type:DataTypes.JSON,
    },
}, {
    timestamps: true,
});

UsersNotification.belongsTo(User, { foreignKey: 'notifiedBy', as: 'commentBy' });

module.exports = UsersNotification;
