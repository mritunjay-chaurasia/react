
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration

const EmailFormat = sequelize.define('emailFormats', {
    emailType: DataTypes.STRING,
    sgEmailTemplateId: DataTypes.STRING,
}, {
    timestamps: true
});

module.exports = EmailFormat;





