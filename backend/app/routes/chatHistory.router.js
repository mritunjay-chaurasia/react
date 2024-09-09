const { Router } = require('express');
const chatHistoryRouter = Router();

const { get, update, chatdata, loadPreviousChatSession, aiChatfeedback, updateMessage } = require('../controllers/chatHistory.controller');
const authentication = require("../middlewares/authentication.js");

// chatHistoryRouter.get('/', authentication, get);
chatHistoryRouter.put('/update', update);
chatHistoryRouter.put('/updateMessage', updateMessage);
chatHistoryRouter.get('/chatList', authentication, chatdata);
chatHistoryRouter.get('/loadPreviousChatSession', authentication, loadPreviousChatSession);
chatHistoryRouter.post('/aiChatfeedback', authentication, aiChatfeedback);

module.exports = chatHistoryRouter;