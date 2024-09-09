const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration
const { encrypt, decrypt } = require('../utils');

const PreChatSurveyUser = sequelize.define('preChatSurveyUsers', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    organization: {
        type: DataTypes.INTEGER,
    },
    sessionid: {
        type: DataTypes.INTEGER,
    },
    emailid: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    phonenumber: {
        type: DataTypes.STRING,
    },
});

// // Hook to encrypt data after invite creation
// PreChatSurveyUser.beforeCreate(async (surveyUsers, options) => {
//     surveyUsers.emailid = encrypt(surveyUsers.emailid);
// });

// // Hook to encrypt data before find
// PreChatSurveyUser.beforeFind(async (options) => {
//     if (options.where && options.where.emailid) {
//         // Encrypt the emailid value before the query
//         options.where.emailid = encrypt(options.where.emailid);
//     }
// });

// // Hook to decrypt data after invite creation
// PreChatSurveyUser.afterFind(async (surveyUsers, options) => {
//     surveyUsers.emailid = decrypt(surveyUsers.emailid);
// });

// PreChatSurveyUser.beforeSave(async(surveyUsers) => {
//     if(surveyUsers.emailid) surveyUsers.emailid = encrypt(surveyUsers.emailid);
// })


// PreChatSurveyUser.afterSave(async(surveyUsers) => {
//     surveyUsers.emailid = decrypt(surveyUsers.emailid);
// })

module.exports = PreChatSurveyUser;
