const { Router } = require('express');
const { saveToEmailTypesSchema } = require('../services/email.service');
const saveToEmailTypesRouter = Router();


saveToEmailTypesRouter.post('/saveToEmailTypes', saveToEmailTypesSchema);
module.exports = saveToEmailTypesRouter;
