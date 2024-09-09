const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration

const UserBilling = sequelize.define('userBillings', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    organization: {
        type: DataTypes.INTEGER,
    },
    plan: {
        type: DataTypes.STRING,
    },
    periodstartdate: {
        type: DataTypes.STRING
    },
    periodenddate: {
        type: DataTypes.STRING
    },
    billingamount: {
        type: DataTypes.STRING,
        defaultValue: 'wordpress'
    },
    billingdate: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    billed: {
        type: DataTypes.BOOLEAN,
        defaultVaule: false
    }
});

module.exports = UserBilling;
