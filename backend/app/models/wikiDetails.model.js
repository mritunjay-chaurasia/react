const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration
const User = require('./user.model');
const WorkOrderComment = require('./workOrderComment.model');

const wikiDetails = sequelize.define("wikiDetails", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    projectDetails: DataTypes.JSON,  
    projectId: DataTypes.INTEGER  
}, {
    timestamps: true,   
});

module.exports = wikiDetails;
