/** 
* This is constant files for exporting .env files 
* @author : Mandeep Singh 
*/
module.exports.allEmailTypes = {
    EMAIL_TYPE_FORGETPASSWORD: 'resetPassword',
    EMAIL_TYPE_VERIFY_EMAIL: 'verifyEmail',
    EMAIL_TYPE_INVITATION_EMAIL: 'inviteUserToOrg',
    EMAIL_TYPE_UPLOAD_SUCCESS_EMAIL: 'uploadSuccess',
    EMAIL_TYPE_UPLOAD_ERROR_EMAIL: 'uploadError',
    EMAIL_TYPE_CREATE_TICKET: 'createTicket',
    EMAIL_TYPE_CHANGE_STATUS: 'statusChange',
    EMAIL_TYPE_ASSIGNEE_STATUS: 'assigneeChange',
    EMAIL_TYPE_COMMENT_ADDED: 'commentAdded',
    EMAIL_TYPE_UPDATE_NOTIFICATION: 'updateNotification',
    EMAIL_TYPE_MENTION_NOTIFICATION: 'mentionNotification',
};

module.exports.allKeysForEmail = {
    KEYFOR_USERFNAME: 'userName',
    KEYFOR_REPORTERFNAME: 'reporterName',
    KEYFOR_VERIFY_EMAIL_LINK: 'emailVerificationLink',
    KEYFOR_RESET_PASSWORD_LINK: 'resetPasswordLink',
    KEYFOR_ORG_INVITE_LINK: 'orgInviteLink',
    KEYFOR_WORK_ORDER_LINK: 'taskLink',
    KEYFOR_EMAIL: 'email',
    KEYFOR_ORGANIZATION_NAME: 'organisationName',
    KEYFOR_PLUGIN_NAME:'pluginname',
    KEYFOR_PROJECT_TYPE:'projectcodetype',
    KEYFOR_TASKID:'taskId',
    KEYFOR_TASK_NAME:'taskName',
    KEYFOR_TASK_SUMMARY:'taskSummary',
    KEYFOR_TASK_COMMENT:'taskComment',
    KEYFOR_PREVIOUS_STATUS:'previousStatus',
    KEYFOR_CURRENT_STATUS:'currentStatus',
    KEYFOR_COMMENT_BY_USER:'commentByUser',
};
