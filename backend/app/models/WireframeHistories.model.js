const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const WireframeHistories = sequelize.define('wireFrameHistories', {
    id: {
        type: DataTypes.INTEGER,
        // autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    // wireFramId:{
    //     type: DataTypes.INTEGER
    // },
    project: {
        type: DataTypes.INTEGER
    },
    wireFrameHistories: {
        type: DataTypes.ARRAY(DataTypes.JSON({
            sessionId: {
                type: DataTypes.INTEGER
            },
            messages: DataTypes.ARRAY(DataTypes.JSON),
            userSessionWireFrame: DataTypes.ARRAY(DataTypes.TEXT)
        }))
    },
    sessionTracker: {
        type: DataTypes.INTEGER
    }
});


module.exports = WireframeHistories;
