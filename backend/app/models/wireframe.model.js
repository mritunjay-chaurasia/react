const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Wireframe = sequelize.define('wireframes', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    project: {
        type: DataTypes.INTEGER
    },
    messages: {
        type: DataTypes.JSON 
    },
    userSessionWireFrame: {
        type: DataTypes.TEXT
    }
});

module.exports = Wireframe;
