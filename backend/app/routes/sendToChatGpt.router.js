const { Router } = require('express');
const { sendToChatGpt, breakReactCode, breakNodeCode } = require('../controllers/sendToChatGpt.controller');
const sendToChatGptRouter = Router();


sendToChatGptRouter.post('/sendToChatGpt',sendToChatGpt);
sendToChatGptRouter.post('/breakReactCode',breakReactCode);
sendToChatGptRouter.post('/breakNodeCode',breakNodeCode);
module.exports = sendToChatGptRouter;

