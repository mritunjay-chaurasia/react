const { Router } = require('express');
const preChatSurveyRouter = Router();
const { prechatsurvey, getPrechatUser } = require('../controllers/preChatSurvey.controller');
const authentication = require("../middlewares/authentication.js");
const projectAuth = require('../middlewares/projectAuth');

preChatSurveyRouter.post('/perUserData', projectAuth, prechatsurvey); // API for Embed Project

preChatSurveyRouter.get('/getUserData/:orgid', getPrechatUser);

module.exports = preChatSurveyRouter;