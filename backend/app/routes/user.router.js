const { Router } = require('express');
const userRouter = Router();
const { deleteUser, login, profile, register, resetPassword, updateUser, findUser, updatePassword, changePasswordFromProfile, updateEmailVerifyStatus, sendVerifyEmail } = require('../controllers/user.controller');
const authentication = require("../middlewares/authentication.js");
const User = require('../models/user.model');
const { encrypt } = require('../utils');
const PreChatSurveyUser = require('../models/preChatSurveyUser.model');
const Invite = require('../models/invite.model');

userRouter.get('/getme', authentication, async (req, res) => {

    // const users = await User.findAll({})
    // for(i = 0; i < users.length; i++) {
    //     const updatedUser = await User.update({
    //         emailid: encrypt(users[i].emailid),
    //         firstname: encrypt(users[i].firstname),
    //         lastname: encrypt(users[i].lastname),
    //         phoneno: encrypt(users[i].phoneno),
    //     }, {
    //         where: { id: users[i].id }
    //     });
    // }

    // const prechatusers = await PreChatSurveyUser.findAll({})
    // for(i = 0; i < prechatusers.length; i++) {
    //     const updatedUser = await PreChatSurveyUser.update({
    //         emailid: encrypt(prechatusers[i].emailid),
    //     }, {
    //         where: { id: prechatusers[i].id }
    //     });
    // }

    // const invites = await Invite.findAll({})
    // for(i = 0; i < invites.length; i++) {
    //     const updatedUser = await Invite.update({
    //         invitedUserEmailId: encrypt(invites[i].invitedUserEmailId),
    //     }, {
    //         where: { id: invites[i].id }
    //     });
    // }

    
    res.status(200).json({
        status: true,
        user: req.user,
        token: req.userToken,
    })
});
userRouter.post('/findUserExist',findUser);
userRouter.post('/register', register);
userRouter.post('/resetpassword', resetPassword);
userRouter.post('/updatePassword',updatePassword);
userRouter.post('/login', login);
userRouter.get('/profile', profile);
userRouter.put('/update', updateUser);
userRouter.delete('/delete', deleteUser);
userRouter.post('/changePasswordFromProfile',changePasswordFromProfile);

userRouter.post('/updateEmailVerifyStatus',updateEmailVerifyStatus);
userRouter.post('/sendVerifyEmail',sendVerifyEmail);

module.exports = userRouter;