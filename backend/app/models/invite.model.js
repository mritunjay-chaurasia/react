const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); //import the database configuration
const { encrypt, decrypt } = require('../utils');
const User = require('./user.model');

/**
* This Schema is For handling Invite User to Org 
* @params = None
* @response : None
* @author : Mandeep Singh
*/
const Invite = sequelize.define('invite', {

    invitedByUserId: DataTypes.UUID,
    invitedOrgId: DataTypes.INTEGER,
    invitedUserId: DataTypes.UUID,
    invitedUserEmailId: DataTypes.STRING,
    assignedRole: DataTypes.STRING,
    invitationCode: DataTypes.STRING,
    invitationStatus: DataTypes.STRING,
    userAction: DataTypes.STRING,

    timestamp: {
        type: DataTypes.STRING,
        defaultValue: Date.now().toLocaleString('en-US', { timeZone: 'EST' })
    },
});


// // Hook to encrypt data after invite creation
// Invite.beforeCreate(async (invite, options) => {
//     invite.invitedUserEmailId = encrypt(invite.invitedUserEmailId);
// });

// // Hook to encrypt data before find
// Invite.beforeFind(async (options) => {
//     if (options.where && options.where.invitedUserEmailId) {
//         // Encrypt the emailid value before the query
//         options.where.invitedUserEmailId = encrypt(options.where.invitedUserEmailId);
//     }
// });

// // Hook to decrypt data after invite creation
// Invite.afterFind(async (invite, options) => {
//     if(invite && invite.invitedUserEmailId) {
//         invite.invitedUserEmailId = decrypt(invite.invitedUserEmailId);
//     }
// });

// Invite.beforeSave(async(invite) => {
//     if(invite.invitedUserEmailId) invite.invitedUserEmailId = encrypt(invite.invitedUserEmailId);
// })


// Invite.afterSave(async(invite) => {
//     invite.invitedUserEmailId = decrypt(invite.invitedUserEmailId);

// })
Invite.belongsTo(User, { foreignKey: 'invitedUserId', as: 'invitedUserDetails' });


module.exports = Invite;
