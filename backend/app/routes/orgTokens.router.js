const { Router } = require('express');
const orgTokensRouter = Router();
const { get, updateOrgToken } = require('../controllers/orgTokens.controller');
const authentication = require("../middlewares/authentication.js");

orgTokensRouter.get('/:projectId', authentication, get);
orgTokensRouter.put('/updateToken', authentication, updateOrgToken);

module.exports = orgTokensRouter;