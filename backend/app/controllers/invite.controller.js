const Invite = require("../models/invite.model");
const { prepareAndSendMail } = require("../services/email.service");
const { createJWT } = require("./jwt.controller");
const User = require("../models/user.model");
const { allKeysForEmail, allEmailTypes } = require("../constants");
const OrgUser = require('../models/orgusers.model');
const { decrypt } = require("../utils");


const stringForRandomValue = `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;
const invitationCodLimit = 8;

/**
 * This Function Invite User to org with email link
 * @params = None
 * @response : None
 * @author : Mandeep Singh
 */
module.exports.inviteUserToOrg = async (req, res) => {
    try {
        const {
            invitedByUserId,
            invitedOrgId,
            invitedOrgName,
            invitedUserEmailId,
            assignedRole,
        } = req.body;
        // const expireTime = Math.floor(Date.now() / 1000) * process.env.EXPIRE_AFTER;

        // const invitationCode = createJWT(
        //     { invitedUserEmailId, invitedOrgName },
        //     expireTime
        // );

        // let isOwner = false;
        // const checkIfUserIsOwner = await Invite.findAll({where:{invitedOrgId:invitedOrgId}});

        // if(checkIfUserIsOwner.length >0)
        // {
        //     // means previously some one invited some one in this org so its not owner coz owner needs to be invite some one
        //     // untill he/she can intreact with org
        //     isOwner = false;
        // }
        // else
        // {
        //     isOwner = true;
        // }
        const invitationCode = genrateInvitationCode(invitationCodLimit, stringForRandomValue);

        const userAlreadyRegister = await User.findOne({ where: { emailid: invitedUserEmailId } });
        let url = '';
        if (userAlreadyRegister) {
            url = `${process.env.CLIENT_URL}/preview?invite=${invitationCode}`;
        } else {
            url = `${process.env.CLIENT_URL}/login?invite=${invitationCode}`;
        }

        const alreadyInvited = await checkIfUserAlreadyInvited(
            invitedOrgId,
            invitedUserEmailId
        );

        if (alreadyInvited) {
            return res
                .status(409)
                .json({ status: false, message: "User Already Invited" });
        }

        let keysAndValues = {
            [allKeysForEmail.KEYFOR_ORGANIZATION_NAME]: invitedOrgName,
            [allKeysForEmail.KEYFOR_ORG_INVITE_LINK]: url,
        };

        prepareAndSendMail(
            invitedUserEmailId,
            allEmailTypes.EMAIL_TYPE_INVITATION_EMAIL,
            keysAndValues
        );

        const invitedUser = new Invite({
            invitedByUserId: invitedByUserId,
            invitedOrgId: invitedOrgId,
            invitedUserEmailId: invitedUserEmailId,
            assignedRole: assignedRole,
            invitationCode: invitationCode,
            invitationStatus: "pending",
            userAction: "unblock",
        });

        // if (isOwner)
        // {
        //    const user = await User.findOne({where:{id:invitedByUserId}}) ;
        //    console.log('Finding Owner Email id provided', invitedByUserId,'user found ',user);
        //    invitedUser.ownerEmailId = user.emailid;
        // }

        let response = await invitedUser.save();
        console.log(
            "Response after Saving Invited User Data to Database :: ",
            response
        );

        return res
            .status(200)
            .json({
                status: true,
                message: `Successfully Invited User To Join ${invitedOrgName} `,
            });
    } catch (error) {
        console.log("Error Occurred While Sending User Invite >>>>>>> ", error);
        return res
            .status(500)
            .json({
                status: false,
                message: "Some Error Occurred While Sending User Invite",
                error: error,
            });
    }
};
/**
 * This Function checks if user Invited By Owner
 * @params = invitedOrgId:Int, emailId:String
 * @response : Boolean
 * @author : Mandeep Singh
 */
const checkIfUserAlreadyInvited = async (invitedOrgId, emailId) => {
    try {
        const foundOrList = await Invite.findAll({
            where: { invitedUserEmailId: emailId },
        });

        for (let i = 0; i < foundOrList.length; i++) {
            const element = foundOrList[i];

            if (element.invitedOrgId === invitedOrgId) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.log("Error While Checking User Status ", error);
        return false;
    }
};

/**
 * This Function Checks if user is authorised and make sure user is legit and  invited
 * @params = None
 * @response : JSON
 * @author : Mandeep Singh
 */
module.exports.checkIfInvited = async (req, res) => {
    const { invitationCode /*, orgName */ } = req.body;

    try {
        // const getAllWithSameOrg = await
        const inviteDetails = await Invite.findOne({
            where: { invitationCode: invitationCode },
        });


        if (
            inviteDetails &&
            invitationCode === inviteDetails.dataValues.invitationCode &&
            inviteDetails.dataValues.invitationStatus === "pending"
        ) {
            // means registration not completed so link is valid
            return res
                .status(200)
                .json({ status: true, message: `You are Invited To Join Organization`, inviteDetails: inviteDetails });
        } else {
            return res
                .status(401)
                .json({ status: false, message: "Link Invalid or Already Used" });
        }
    } catch (error) {
        console.log("Error While Invite Link Validation :::: ", error);
        return res
            .status(500)
            .json({
                status: false,
                message: "Error While Invite Link Validation",
                error: error,
            });
    }
};

/**
 * This Function Help user acepting invitation also handle Owner inputs regarding block/unblock a user
 * @params = None
 * @response : JSON
 * @author : Mandeep Singh
 */
module.exports.invitationAcepted = async (req, res) => {
    const { invitationCode, emailid, userAction } = req.body;
    try {
        const invitedUser = await Invite.findOne({
            where: { invitationCode: invitationCode },
        });

        if (userAction !== "") {
            if (invitedUser) {
                invitedUser.userAction = userAction;
                let data = await invitedUser.save();
                console.log("user Status Updated ", data);
                return res
                    .status(200)
                    .json({ status: true, message: "User Status Updated" });
            } else {
                return res
                    .status(404)
                    .json({
                        status: false,
                        message: "Invited User Not Found, Can't Change User Status !",
                    });
            }
        }

        if (invitedUser && invitedUser.invitationStatus === "pending") {
            invitedUser.invitationStatus = "completed";

            const findNewlyRegistredUser = await User.findOne({
                where: { emailid: emailid },
            });
            if (findNewlyRegistredUser) {
                invitedUser.invitedUserId = findNewlyRegistredUser.id;
            } else {
                return res
                    .status(404)
                    .json({
                        status: false,
                        message: "Newly Invited User Not Found after registration !",
                    });
            }
            let data = await invitedUser.save();
            console.log(" invitation acepted status updated ", data);
            return res
                .status(200)
                .json({
                    status: true,
                    message: "Successfully Registred and Joined Org",
                });
        } else {
            return res
                .status(401)
                .json({
                    status: false,
                    message:
                        invitedUser === null
                            ? "Invited User Not Found"
                            : ` User Already Registered ${invitedUser.invitationStatus}`,
                });
        }
    } catch (error) {
        return res
            .status(500)
            .json({
                status: false,
                message: "Some Error Occured While Invitation Acepting",
                error: error,
            });
    }
};

/**
 * This Function Fetch Already Invited List related with a orgId
 * @params = None
 * @response : JSON
 * @author : Mandeep Singh
 */
module.exports.getInvitedList = async (req, res) => {
    const { invitedOrgId, selectedOrgUserId } = req.body;

    try {
        const foundData = await Invite.findAll({
            where: { invitedOrgId: invitedOrgId },
        });

        const owner = await User.findOne({ where: { id: selectedOrgUserId } });

        const ownerEmail = owner.emailid;

        if (!foundData) {
            res
                .status(404)
                .json({ status: false, message: "No Invitation Data Found", ownerEmail: ownerEmail });
        } else {

            // for (const invite of foundData) {
            //     invite.invitedUserEmailId = decrypt(invite.invitedUserEmailId);
            // }

            res.status(200).json({ status: true, message: "Data Found", foundData: foundData, ownerEmail: ownerEmail });
        }
    } catch (error) {
        console.log("error while getting inviation list ", error);
        res
            .status(500)
            .json({ status: false, message: "error while getting inviation list" });
    }
};


const genrateInvitationCode = (limit, array) => {
    if (!limit || !array) {
        throw new Error(`Can't Genrate Code Without Both Parameters`);
    }
    let string = '';
    for (let i = 0; i < limit; i++) {
        const index = Math.floor(Math.random() * array.length);
        string += array.charAt(index);
    }
    return string;
}