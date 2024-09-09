import apiClient from "./index";

/**
 * This Function Invite User To ORG
 * @params = invitedByUserId:String, invitedOrgId:Integer, invitedOrgName:String, invitedUserEmailId:String, assignedRole:String
 * @response : JSON
 * @author : Mandeep Singh
 */
export const inviteUserToOrg = (
    invitedByUserId,
    invitedOrgId,
    invitedOrgName,
    invitedUserEmailId,
    assignedRole
) => {
    return apiClient
        .post("/invite/inviteUserToOrg", {
            invitedByUserId,
            invitedOrgId,
            invitedOrgName,
            invitedUserEmailId,
            assignedRole,
        })
        .then((response) => {
            if (response.status) {
                return response.data;
            }
        });
};

/**
 * This Function Checks If User Invited
 * @params = invitationCode:String,orgName:String
 * @response : JSON
 * @author : Mandeep Singh
 */
export const checkIfInvited = (invitationCode /*, orgName */) => {
    return apiClient
        .post("/invite/checkIfInvited", {
            invitationCode,
            // orgName,
        })
        .then((response) => {
            if (response.status) {
                return response.data;
            }
        });
};

/**
* This Function Helps user in acepting a invite also it handles block/unblock status of user
if user action = '' it will not check for user action instead acept invite if its not ''it will handle user
action (block/unblock)
* @params = invitationCode:String,emailid:String,userAction:String
* @response : JSON
* @author : Mandeep Singh
*/
export const invitationAcepted = (invitationCode, emailid, userAction = "") => {
    return apiClient
        .post("/invite/invitationAcepted", {
            invitationCode,
            emailid,
            userAction,
        })
        .then((response) => {
            if (response.data) {
                return response.data;
            }
        });
};

/**
 * This Function Fetch User Invited List
 * @params = invitedOrgId:Integer
 * @response : JSON
 * @author : Mandeep Singh
 */
export const getInvitedList = (invitedOrgId,selectedOrgUserId) => {
    return apiClient
        .post("/invite/getInvitedList", {
            invitedOrgId: invitedOrgId,selectedOrgUserId:selectedOrgUserId
        })
        .then((respnse) => {
            if (respnse.data) {
                return respnse.data;
            }
        });
};
