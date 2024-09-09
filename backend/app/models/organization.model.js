const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration
const UserProject = require('./userprojects.model');
const User = require('./user.model');

const Organization = sequelize.define('organizations', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    user: {
        type: DataTypes.UUID
    },
    organizationname: {
        type: DataTypes.STRING
    },
    website: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
    },
    plan: {
        type: DataTypes.STRING,
        defaultValue: 'Free'
    },
});

// Association setup
Organization.hasMany(UserProject, { foreignKey: 'organizationId', as: 'allProjects' });
Organization.belongsTo(User, { foreignKey: 'user', as: 'ownerUserDetails' });
// UserProject.belongsTo(User, { foreignKey: 'pointPerson', as: 'pointPersonUser' });

module.exports = Organization;
