const { Router } = require('express');
const toolRouter = Router();
const {
    getProjectTools,
    addUserTool,
    getTool,
    getUserTool,
    update,
    updateFields,
    getAllToolTypes,
    deleteTool,
    updateVector,
    keepFileInReq,
    cloneGithub,
    getGitAcessCode,
    sendToolStatusEmail,
    getClonedRepo,
    saveClonedRepoFile
} = require('../controllers/tool.controller');
const authentication = require("../middlewares/authentication.js");


toolRouter.get('/getProjectTools', authentication, getProjectTools);
toolRouter.post('/addUserTool', authentication, keepFileInReq.single('file'), addUserTool);
toolRouter.get('/toolmaster/:toolid', getTool);
toolRouter.get('/usertool/:projectId/:id?', getUserTool);
toolRouter.put('/update', update);
toolRouter.delete('/deleteTool/:projectId/:toolid', deleteTool);
toolRouter.put('/updateFields', updateFields);
toolRouter.patch('/update_vector', updateVector);
toolRouter.get('/getalltooltypes', getAllToolTypes);

toolRouter.post('/getGitAcessCode',getGitAcessCode)
toolRouter.post('/cloneGithub',authentication, cloneGithub);
toolRouter.post('/getClonedRepo',authentication, getClonedRepo);
toolRouter.post('/saveClonedRepoFile',authentication, saveClonedRepoFile);


toolRouter.post('/sendToolStatusEmail',sendToolStatusEmail);

module.exports = toolRouter;
