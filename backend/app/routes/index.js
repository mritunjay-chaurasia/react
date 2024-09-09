const { Router } = require('express');

const userRouter = require('./user.router');
const toolRouter = require('./tool.router');
const orgTokensRouter = require('./orgTokens.router');
const orgRouter = require('./org.router');
const chatHistoryRouter = require('./chatHistory.router');
const preChatSurveyRouter = require('./preChatSurvey.router');
const userProjectRouter = require('./userProject.router');
const sendToChatGptRouter = require('./sendToChatGpt.router');
const saveToEmailTypesRouter = require('./saveToEmailTypes.router');
const inviteRouter = require('./invite.router');
const readFolderRouter = require('./readFolder.router');
const superAdminRouter = require('./superAdmin.router');
const workorder = require('./workOrder.router');
const wikiPage = require('./wikiPage.router') 
const github = require('./github.router');
const stripeRouter = require('./stripe.router');
const fullStoryRouter = require('./fullStory.router');
const wireframeRouter = require('./wireframe.router');
const supportRouter = require('./support.router');
const updateComment = require('./updateComments.router');
const usersNotification = require('./usersNotification.router');
const productMaterial = require('./productMaterial.router');

const router = Router();

router.use('/user', userRouter);
router.use('/tools', toolRouter);
router.use('/tokens', orgTokensRouter);
router.use('/org', orgRouter);
router.use('/chatHistory', chatHistoryRouter);
router.use('/surveyData', preChatSurveyRouter);
router.use('/userProject', userProjectRouter);
router.use('/chatGpt',sendToChatGptRouter);
router.use('/email',saveToEmailTypesRouter);
router.use('/invite',inviteRouter);

router.use('/stripe',stripeRouter);
router.use('/read',readFolderRouter);
router.use('/superAdmin',superAdminRouter);
router.use('/workorder',workorder);
router.use('/wikiPage',wikiPage);
router.use('/git',github)

router.use('/fullStory', fullStoryRouter)
router.use('/wireframeScreen',wireframeRouter)
router.use('/supportUser',supportRouter)
router.use('/updateComment',updateComment);
router.use('/userNotification',usersNotification);
router.use('/productMaterial',productMaterial);

module.exports = router;