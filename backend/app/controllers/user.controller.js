const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const User = require('../models/user.model');
const Organization = require('../models/organization.model');
const OrgUser = require('../models/orgusers.model');
const UserProject = require('../models/userprojects.model');
const OrgToken = require('../models/orgTokens.model');
const { prepareAndSendMail } = require('../services/email.service');
const { createJWT, parseJWT } = require('./jwt.controller');
const Invite = require('../models/invite.model');
const { allKeysForEmail, allEmailTypes } = require('../constants');

const stripe = require('stripe')(process.env.STRIPE_KEY)

const createUserToken = (id) => {
    let expiry = new Date();
    expiry.setHours(expiry.getHours() + 6);
    // expiry.setSeconds(expiry.getSeconds() + 30);
    const token = createJWT(id, expiry.getTime() / 1000);
    return token;
}

const hashAndSaltPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
}

// Register a new User
exports.register = async (req, res) => {
    try {
        // Extract data from request
        const { firstname, lastname, source, emailid, password, usertype, information, invite } = req.body;
        // Validate request
        if (!firstname || !lastname || !source || !emailid || !password || !usertype) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }
        if (!information)
            return res.status(400).json({ status: false, message: "information must be given." });

        const { companyname, companywebsite, projectname, icon } = information;


        // Verify password strength
        if (password.length < 8) {
            return res.status(400).json({ status: false, message: "password must not be shorter than 8" });
        }

        // check email duplication
        const user = await User.findOne({ where: { emailid: emailid } });
        if (user) {
            return res.status(409).json({ status: false, message: "duplicated email" })
        }

        // hash password
        const hash = hashAndSaltPassword(password);

        // Create a User
        let newUser = {
            firstname, lastname, source, emailid, usertype
        }

        let planId = process.env.DEFAULT_PLAN_ID
        if (planId) {
            const singlePlan = await stripe.products.retrieve(planId);
            let nowDate = new Date();
            let purchasedAt = new Date(nowDate); 
            let planDetails = {
                "planId": planId,
                "planName": singlePlan.name,
                "limits": JSON.parse(singlePlan.metadata.limits),
                "purchasedAt": purchasedAt,
                "expiredAt": new Date((nowDate).setMonth((nowDate).getMonth() + 1))
            }

            newUser = { ...newUser, planDetails: planDetails }
        }

        // Save the user
        const createdUser = await User.create({
            ...newUser, password: hash
        });

        if (!createdUser)
            return res.status(500).json({ status: false, message: "Some error occurred while creating a user." })


        //check if theirs invitation code if theirs one do this
        if (invite) {
            const invitedUser = await Invite.findOne(
                {
                    where: { invitationCode: invite }
                });

            if (invitedUser && invitedUser.invitationStatus === 'pending') {
                invitedUser.invitationStatus = 'completed';
                invitedUser.invitedUserId = createdUser.id;

                let data = await invitedUser.save();
                console.log('Invitation acepted While Registration', data);
            }
        }

        // Add a new record to `Organization` table
        const createdOrg = await Organization.create({
            organizationname: companyname,
            website: companywebsite,
            user: createdUser.id
        });

        // Add a new record to `userprojecrts` table
        const createdUserProject = await UserProject.create({
            organizationId: createdOrg.id, projectname: projectname, icon: icon
        });

        const projectToken = CryptoJS.AES.encrypt(JSON.stringify({ projectId: createdUserProject.id, userId: createdUser.id }), process.env.PROJECT_SECRET_KEY).toString()

        // const projectToken = JSON.stringify({ projectId: createdUserProject.id, userId: createdUser.id });


        createdUserProject.projecttoken = projectToken.toString();
        createdUserProject.save();

        console.log('Orgination Created in [user.controller.js]', createdOrg);

        let userOrgs = [];
        userOrgs.push(createdOrg.id);
        // Add a new record to `orgusers` table
        await OrgUser.create({
            organizations: userOrgs,
            user: createdUser.id
        });
        await OrgToken.create({
            organization: createdOrg.id,
            projectid: createdUserProject.id,
            openapikey: process.env.OPENAI_KEY_FOR_ORG,
        });



        // Return result
        const token = createUserToken(createdUser.id);
        return res.status(201).json({
            status: true,
            token: token,
            user: createdUser,
            message: "Registered Successfully!"
        })
    } catch (e) {
        console.log('Error While Register:::::', e);
        return res.status(500).json({ status: false, message: "Some error occurred while creating a user." })
    }
};

// Login User
module.exports.login = async (req, res) => {
    // Extract data from request
    const { emailid, password, invite } = req.body;
    try {
        // Get user by emailid
        const user = await User.findOne({ where: { emailid } });

        
        if (!user)
        return res.status(404).json({ status: false, message: "User Not Found!" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {

            //check if theirs invitation code if theirs one do this
            if (!user.planDetails) {
                let planId = process.env.DEFAULT_PLAN_ID
                if (planId) {
                    const singlePlan = await stripe.products.retrieve(planId);
                    let nowDate = new Date();
                    let purchasedAt = new Date(nowDate); 
                    let defaultPlanDetails = {
                        "planId": planId,
                        "planName": singlePlan.name,
                        "limits": JSON.parse(singlePlan.metadata.limits),
                        "purchasedAt": purchasedAt,
                        "expiredAt": new Date((nowDate).setMonth((nowDate).getMonth() + 1))
                    }
                    user.planDetails = defaultPlanDetails
                    await user.save();
                }
            }

            if (invite) {
                const invitedUser = await Invite.findOne(
                    {
                        where: { invitationCode: invite }
                    });

                if (invitedUser && invitedUser.invitationStatus === 'pending') {
                    invitedUser.invitationStatus = 'completed';
                    invitedUser.invitedUserId = user.id;

                    let data = await invitedUser.save();
                    console.log('Invitation acepted While Login', data);
                }
            }

            const token = createUserToken(user.id);
            return res.status(200).json({
                status: true,
                token: token,
                user: user,
                message: "Logged in Successfully"
            })
        } else {
            return res.status(400).json({ status: false, message: "Wrong password" });
        }
    } catch (e) {
        console.log('Error While Login', e);
        return res.status(500).json({ message: "Some error occurred while logging in a user." });
    }
}

/**    
* This Function Is Main Controller of Reset Password It Requires Users email in body    
* @response : JSON    
* @author : Mandeep Singh    
*/
module.exports.resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const foundUser = await User.findOne({
            where: { emailid: email }
        });
        if (!foundUser) {
            return res.status(404).json({ status: false, message: 'No User Account Found Related With Provided Email Address' });
        } else {
            const currentTime = new Date();
            const expireTime = new Date(currentTime.getTime() + process.env.EXPIRE_AFTER * 60000);
            const codeToSent = createJWT(email, process.env.EXPIRE_AFTER * 60000);
            foundUser.resetPassword = {
                code: codeToSent,
                createdTime: currentTime,
                expireTime: expireTime,
            };
            //saving newGenrated Infomation to database
            await foundUser.save();
            //creating url to send user
            const url = `${process.env.CLIENT_URL}/changePassword/${codeToSent}`;
            let keys = {
                [allKeysForEmail.KEYFOR_USERFNAME]: foundUser.firstname,
                [allKeysForEmail.KEYFOR_RESET_PASSWORD_LINK]: url,
            }
            prepareAndSendMail(email, allEmailTypes.EMAIL_TYPE_FORGETPASSWORD, keys);
            console.log('code is:', codeToSent, 'expire after :', expireTime);
            return res.status(200).json({ status: true, message: 'Link to reset password hasbeen sent to your email address, follow it for more Information ' });
        }
    }
    catch (error) {
        console.log('error while reset password', error);
        return res.status(500).json({ status: false, message: 'Error while reseting password, please try after sometime', error: error });
    }
}

/**    
* This Function Update Users Password in Database API
 It Requires Code:JWT,email,password in body    
* @response : JSON    
* @author : Mandeep Singh    
*/
module.exports.updatePassword = async (req, res) => {
    try {
        const { code, email, password } = req.body;
        const foundUser = await User.findOne({
            where: { emailid: email }
        });
        let resetPasswordData = foundUser?.resetPassword ? (foundUser.resetPassword?.code ? foundUser.resetPassword : JSON.parse(foundUser.resetPassword)) : false

        if (!foundUser || (resetPasswordData && !resetPasswordData.code)) {
            if (!foundUser) {
                return res.status(404).json({ status: false, message: 'User Not Found' });
            } else {
                return res.status(401).json({ status: false, message: 'Link Invalid Or Expired Unauthorized Access' });
            }

        } else {
            if (resetPasswordData?.code === code) {
                // means user is valid code is correct check if its not expired 
                const currentTime = new Date();
                if (currentTime > resetPasswordData.expireTime) {
                    // means code expired;
                    return res.status(401).json('Code Expired');
                } else {
                    // hash password
                    const hash = hashAndSaltPassword(password);
                    // ok so user code is valid lets update password
                    foundUser.password = hash;
                    resetPasswordData = {};
                    let resp = await foundUser.save();
                    return res.status(200).json({ status: true, message: 'Password Updated' });
                }
            }
            else {
                return res.status(401).status({ status: false, message: 'Invalid Link' });
            }

        }
    } catch (error) {
        console.log(`error while updating Password`, error);
        return res.status(500).json({ message: 'Error While Updating Password', error });
    }
}

// Get user profile
module.exports.profile = async (req, res) => {
    // Extract data from request
    const { token } = req.body;

    // Parse JWT
    const decoded = await parseJWT(token);

    if (typeof (decoded) === 'string') {
        return res.status(400).json({ message: decoded });
    } else {
        // Get userid from decoded token
        const { userid } = decoded;

        try {
            // Get user by userid
            const user = await User.findOne({
                where: { userid }
            });

            if (!user)
                return res.status(500).json({ message: "Some error occurred while getting user profile." });

            // Get org by userid
            const org = await OrgUser.findOne({
                where: { userid }
            });

            if (!org)
                return res.status(500).json({ message: "Some error occurred while getting user profile." });

            const { orgid } = org;

            // Get userorg by orgid
            const userOrg = await Organization.findOne({
                where: { id: orgid },
            });

            // Get project by orgid
            const project = await UserProject.findOne({
                where: { organizationId: orgid }
            });

            if (!userOrg || !project)
                return res.status(500).json({ message: "Some error occurred while getting user profile." });

            // Return result
            return res.json({
                firstname: user.firstname,
                lastname: user.lastname,
                source: user.source,
                emailid: user.emailid,
                phoneno: user.phoneno,
                usertype: user.usertype,
                orgid: userOrg.orgid,
                orgname: userOrg.organizationname,
                projectname: project.projectname
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Some error occurred while creating user profile." });
        }
    }
}

/**
* This Function Update Users Details in Database from Profile Settings
 It Requires firstname, lastname, source, emailid, phoneno, usertype from body
* @response : JSON
* @author : Mandeep Singh
*/
module.exports.updateUser = async (req, res) => {
    const { firstname, lastname, source, emailid, phoneno, usertype } = req.body;

    try {
        const user = await User.findOne({
            where: { emailid: emailid }
        });

        if (!user) {
            return res.status(404).json({ status: false, message: 'User Not Found !' });
        } else {
            user.firstname = firstname;
            user.lastname = lastname;
            user.source = source;
            user.phoneno = phoneno;
            user.usertype = usertype;

            const response = await user.save();
            return res.status(200).json({ status: true, message: 'User Updated Successfully', user: response });
        }

    } catch (error) {
        console.log('error while updating user', error);
        return res.status(500).json({ status: false, message: 'Error While Updating User !', error: error });
    }
}

/**
* This Function Update Users Password from Profile Setting
 It Requires email, oldPassword, newPassword from body
* @response : JSON
* @author : Mandeep Singh
*/
module.exports.changePasswordFromProfile = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({
            where: { emailid: email }
        });

        if (!user) {
            return res.status(404).json({ status: false, message: "User Not Found" });
        } else {
            const passwordMatch = await bcrypt.compare(oldPassword, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ status: false, message: 'Invalid Credentials !' });
            } else {
                // hash password
                const hash = hashAndSaltPassword(newPassword);
                // lets update password
                user.password = hash;

                await user.save();
                return res.status(200).json({ status: true, message: "Password Updated relog for changes to take effect." });
            }
        }
    } catch (error) {
        console.log('error while updating password ::::', error);
        return res.status(500).json({ status: false, message: "Error Updating Password", error: error });

    }
}

//Delete user
module.exports.deleteUser = async (req, res) => {
    // Extract data from request
    const { token } = req.body;

    // Parse JWT
    const decoded = await parseJWT(token);

    if (typeof (decoded) === 'string')
        return res.status(400).json({ message: decoded });

    // Get userid from decoded token
    const { userid } = decoded;

    try {
        const user = await User.findOne({
            where: { userid }
        });

        if (!user)
            return res.status(500).json({ message: "no user with such userid." });

        // Get orgusers by userid
        const org = await OrgUser.findOne({
            where: { userid }
        });

        // Get orgid
        const { orgid } = org;

        // delete a row from `users` table
        await User.destroy({
            where: { userid }
        });

        // delete a row from `Organizations` table
        await Organization.destroy({
            where: { orgid }
        });

        // delete a row from `orgusers` table
        await OrgUser.destroy({
            where: { userid }
        });

        // delete a row from `userprojects` table
        await UserProject.destroy({
            where: { orgid }
        });

        return res.json({
            message: "confirm message"
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Some error occurred while deleting user." });
    }

}

module.exports.findUser = async (req, res) => {

    try {
        let user = await User.findOne({ where: { emailid: req.body.emailid } });
        if (user) {
            return res.status(409).json({ message: "User Found" });
        }
        else {
            return res.status(200).json({ message: "User Not Found" });
        }
    }
    catch (error) {
        return res.status(200).json({ message: "User Not Found" });
    }
}

/**
* This Function send emails for account verification
* @params = require email from body:String
* @response : returns response from function
* @author : Mandeep Singh
*/
module.exports.sendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const foundUser = await User.findOne({
            where: { emailid: email }
        });
        if (!foundUser) {
            return res.status(404).json({ status: false, message: 'User Not Found' });
        } else {
            const expireTime = Math.floor(Date.now() / 1000) * process.env.EXPIRE_AFTER;
            // const endPoint = jwt.sign({email,expireTime},process.env.JWT_KEY);


            const endPoint = createJWT(email, expireTime);
            console.log('expire time :', expireTime);
            const url = `${process.env.CLIENT_URL}/preview?verifyEmail=${endPoint}`;

            foundUser.verificationKey = endPoint;

            // if (!foundUser.emailWasSent) {
            //     foundUser.emailWasSent = true;
            // }
            await foundUser.save();

            let keysAndValues = {
                [allKeysForEmail.KEYFOR_USERFNAME]: foundUser.firstname,
                [allKeysForEmail.KEYFOR_VERIFY_EMAIL_LINK]: url,
            }

            prepareAndSendMail(email, allEmailTypes.EMAIL_TYPE_VERIFY_EMAIL, keysAndValues);
            return res.status(200).json({ status: true, message: 'Link to reset password has been sent to your email address, follow it for more Information ' });

        }

    } catch (error) {
        return res.status(500).json({ status: false, message: 'Error While Sending Verification Email' })
    }
}

/**
* Function will change current Verification status of user account
* @params =  emaild : String, verificationStatus:Boolean (Require From Body)
* @response : returns response from function
* @author : Mandeep Singh
*/
module.exports.updateEmailVerifyStatus = async (req, res) => {
    const { email, verificationKey } = req.body;
    try {
        let user = await User.findOne({ where: { emailid: email } });
        if (!user) {
            return res.status(404).json({ status: false, message: "User Not Found" });
        }
        if (user.verificationKey === null) {
            return res.status(401).json({ status: false, message: 'unauthorized access None Key' });
        }
        if (user.verificationKey !== verificationKey) {
            console.log(`Keys Doesn't Match`);
            return res.status(401).json({ status: false, message: 'unauthorized access' });
        }
        // Parse JWT
        const decoded = parseJWT(verificationKey);

        if (typeof (decoded) === 'string') {
            return res.status(400).json({ message: decoded });
        } else {
            user.emailverified = true;
            user.verificationKey = null;
            let updatedUser = await user.save();
            return res.status(200).json({ status: true, message: 'Verification Success', user: updatedUser });
        }

    } catch (error) {
        console.log('Error While Verify User ', error);
        return res.status(500).json({ status: false, message: 'error while Verify User', error: error });
    }
}