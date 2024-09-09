const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.config'); //import the database configuration

const OrgUser = sequelize.define('orgUsers', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    organizations: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true
    },
    user: {
        type: DataTypes.UUID,
        unique: true
    },
    userrole: {
        type: DataTypes.STRING,
        defaultValue: "admin"
    }
});

module.exports = OrgUser;
