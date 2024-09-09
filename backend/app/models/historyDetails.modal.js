const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration
const User = require('./user.model');

const HistoryDetail = sequelize.define('historyDetails', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    workOrderId:DataTypes.INTEGER,
    statusType: DataTypes.STRING,
    updatedBy: {  
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    from: DataTypes.JSON,  
    to: DataTypes.JSON,  
    fromUUid: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    change: DataTypes.STRING,
    toUUid: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
}, {
    timestamps: true,
});

HistoryDetail.belongsTo(User, { foreignKey: 'updatedBy', as: 'updatedByUser' });
HistoryDetail.belongsTo(User, { foreignKey: 'fromUUid', as: 'fromUUidDetails' });
HistoryDetail.belongsTo(User, { foreignKey: 'toUUid', as: 'toUUidDetails' });

module.exports = HistoryDetail;
