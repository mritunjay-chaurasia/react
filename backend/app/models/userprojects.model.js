const { DataTypes, STRING } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration
const Organization = require('./organization.model');
const User = require('./user.model');

const UserProject = sequelize.define('userProjects', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    organizationId: {
        type: DataTypes.INTEGER
    },
    projectname: {
        type: DataTypes.STRING
    },
    icon: {
        type: DataTypes.STRING
    },
    projecttoken: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
    },
    themesettings: {
        type: DataTypes.JSON,
    },
    surveysettings: {
        type: DataTypes.JSON,
    },
    pointPerson: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    aiProjectInitialization: {
        type: DataTypes.JSON(),
        allowNull: true,
    },
    selectedStatus: {
        type: DataTypes.JSON 
    },
    hideReleasedStatus: {
        type: DataTypes.BOOLEAN,
        defaultVaule: false
    },
    selectedPointUsers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    selectedDetails: {
        type: DataTypes.JSON 
    },
});

// Association setup
UserProject.belongsTo(User, { foreignKey: 'pointPerson', as: 'pointPersonUser' });


module.exports = UserProject;