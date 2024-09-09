const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); 
const User = require('./user.model');

const UpdateComments = sequelize.define('updateComments', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    projectId: {
        type: DataTypes.INTEGER
    },
    commentByUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User, 
            key: 'id',
        },
    },
    text: {
        type: DataTypes.TEXT
    },
    image: {
        type: DataTypes.JSON
    }
}, {
    timestamps: true,
});

UpdateComments.belongsTo(User, { foreignKey: 'commentByUserId', as: 'commentBy' });

module.exports = UpdateComments;
