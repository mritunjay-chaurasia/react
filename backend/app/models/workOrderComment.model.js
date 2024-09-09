const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration
const User = require('./user.model');

const WorkOrderComment = sequelize.define('workOrderComments', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    workOrderId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    commentByUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User, // Make sure it matches the actual table name of the Organization model
            key: 'id',
        },
    },
    text: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.JSON
    }
}, {
    timestamps: true,
});

WorkOrderComment.belongsTo(User, { foreignKey: 'commentByUserId', as: 'commentBy' });

module.exports = WorkOrderComment;
