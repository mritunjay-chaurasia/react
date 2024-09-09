const { Router } = require('express');
const userProjectRouter = Router();
const { updateProjectSettings, upload, getAllMyProjects, loadProject, addProject, updateProject, deleteProject,updateUserProject, getFunctionList, addFunctionList, generateAPIList, keepFileInReq, deleteFunctionList, updateFunctionList } = require('../controllers/userProject.controller');
const authentication = require("../middlewares/authentication.js");
const projectAuth = require('../middlewares/projectAuth');

// userProjectRouter.get('/loadProject', projectAuth, loadProject); // API for Embed Project

// APIs for Chat2Action Project

// Authentication Middleware
userProjectRouter.use(authentication);

userProjectRouter.get('/getAllProjects', getAllMyProjects);
userProjectRouter.post('/addProject', addProject);
userProjectRouter.patch('/updateProjectSettings', upload.single('file'), updateProjectSettings);
userProjectRouter.put('/updateProject', updateProject);
userProjectRouter.delete('/deleteProject', deleteProject);
userProjectRouter.get('/loadProject', loadProject);
userProjectRouter.put('/updateUserProject', updateUserProject);
userProjectRouter.get('/getFunctionList', getFunctionList);
userProjectRouter.post('/addFunctionList', addFunctionList);
userProjectRouter.delete('/deleteFunctionList', deleteFunctionList);
userProjectRouter.put('/updateFunctionList', updateFunctionList);
userProjectRouter.post('/generateAPIList', keepFileInReq.single('file'), generateAPIList);
module.exports = userProjectRouter;