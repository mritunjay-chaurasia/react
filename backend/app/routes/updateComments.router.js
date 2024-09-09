const { Router } = require('express');
const authentication = require('../middlewares/authentication');
const {keepMultipleFileInReq,addComment,getUpdatedComments } = require('../controllers/updateComments.controller');

const updateComments = Router();

updateComments.post('/addUpdatedComment', authentication,keepMultipleFileInReq.array('files'), addComment);
updateComments.get('/getUpdatedComments', authentication, getUpdatedComments);

module.exports = updateComments;