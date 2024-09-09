const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.config'); //import the database configuration
const OrgUser = require('./orgusers.model');
const { encrypt, decrypt } = require('../utils');

const User = sequelize.define("users", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    firstname: {
        type: DataTypes.STRING
    },
    lastname: {
        type: DataTypes.STRING
    },
    source: {
        type: DataTypes.STRING,
        defaultValue: 'Platform'
    },
    emailid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        validate: {
            min: 6
        }
    },
    phoneno: {
        type: DataTypes.STRING
    },
    usertype: {
        type: DataTypes.STRING,
        defaultValue: 'Individual'
    },
    resetPassword:
    {
        type: DataTypes.JSON({
            code: DataTypes.STRING,
            createdTime: DataTypes.STRING,
            expireTime: DataTypes.STRING,
        }),
    },
    emailverified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    // emailWasSent:{
    //     type:DataTypes.BOOLEAN,
    //     defaultValue:false,
    // },
    verificationKey: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    gittoken:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    gitusername:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    stripe_id:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    planDetails: {
        type: DataTypes.JSON({
            planId: DataTypes.STRING,
            planName: DataTypes.STRING,
            purchasedAt: DataTypes.STRING,
            expiredAt: DataTypes.STRING,
        }),
    },
    isLiveUser: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
}, {
    timestamps: true,
    createdAt: true,    // add createdAt attribute
    updatedAt: false,   // don't add updatedAt attribute
});

// // Hook to encrypt data after user creation
// User.beforeCreate(async (user, options) => {
//     user.firstname = encrypt(user.firstname);
//     user.lastname = encrypt(user.lastname);
//     user.emailid = encrypt(user.emailid);
//     // user.phoneno = encrypt(user.phoneno);
// });

// // Hook to decrypt data after user creation
// User.afterFind(async (user, options) => {
//     if (user) {
//         user.firstname = decrypt(user.firstname);
//         user.lastname = decrypt(user.lastname);
//         user.emailid = decrypt(user.emailid);
//         // user.phoneno = decrypt(user.phoneno);
//     }
// });

// // Hook to encrypt data before find
// User.beforeFind(async (options) => {
//     if (options.where && options.where.emailid) {
//         // Encrypt the emailid value before the query
//         options.where.emailid = encrypt(options.where.emailid);
//     }
// });

// User.beforeSave(async(data) => {
//     if(data.firstname) data.firstname = encrypt(data.firstname);
//     if(data.lastname) data.lastname = encrypt(data.lastname);
//     if(data.emailid) data.emailid = encrypt(data.emailid);
//     // if(data.phoneno) data.phoneno = encrypt(data.phoneno);
// })


// User.afterSave(async(user) => {
//     user.firstname = decrypt(user.firstname);
//     user.lastname = decrypt(user.lastname);
//     user.emailid = decrypt(user.emailid);
//     // user.phoneno = decrypt(user.phoneno);
// })

module.exports = User;
