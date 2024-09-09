const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration
const User = require('./user.model');
const WorkOrderComment = require('./workOrderComment.model');

const WorkOrderHistory = sequelize.define("workOrderHistories", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    workOrderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    assignedTo: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    principalArchitect: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    qaLead: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    developer: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    tester: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "todo"
    },
    taskName: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    mode: {
        type: DataTypes.STRING,
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
    aiResponce: {
        type: DataTypes.ARRAY(DataTypes.JSON)
    },
    priority: {
        type: DataTypes.STRING
    },
    taskHours: {
        type: DataTypes.JSON
    },
    projectId: {
        type: DataTypes.INTEGER
    },
    orgId:{
        type:DataTypes.INTEGER,
    },
    list: {
        type: DataTypes.JSON,
    },
}, {
    timestamps: true,   
});
// Association setup
WorkOrderHistory.belongsTo(User, { foreignKey: 'createdBy', as: 'createdByUser' });
WorkOrderHistory.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedToUser' });
WorkOrderHistory.belongsTo(User, { foreignKey: 'developer', as: 'developerUser' });
WorkOrderHistory.belongsTo(User, { foreignKey: 'tester', as: 'testerUser' });
WorkOrderHistory.hasMany(WorkOrderComment, { foreignKey: 'workOrderId', as: 'comments' });

module.exports = WorkOrderHistory;
