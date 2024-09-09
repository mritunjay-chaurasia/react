const { Router } = require('express');
const { inviteUserToOrg, checkIfInvited, invitationAcepted, getInvitedList } = require('../controllers/invite.controller');
const inviteRouter  = Router();

inviteRouter.post('/inviteUserToOrg',inviteUserToOrg);
inviteRouter.post('/checkIfInvited',checkIfInvited);
inviteRouter.post('/invitationAcepted',invitationAcepted);
inviteRouter.post('/getInvitedList',getInvitedList);

module.exports = inviteRouter;