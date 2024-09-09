const { Router } = require('express');
const { readFolder, getFolderData, upload, readFile, createRouteStructure, searchDocs, getCodeLogic, saveNewProjectStructure, createNewPythonProjectStructure, createNewNodeProjectStructure } = require('../controllers/readFolder.controller');
const readFolderRouter = Router();

// readFolderRouter.post('/readFolder',readFolder)
readFolderRouter.get('/getFolderData/:projectId',getFolderData)
readFolderRouter.post('/readFile',readFile);
readFolderRouter.post('/createRouteStructure', createRouteStructure);
readFolderRouter.get('/searchDocs', searchDocs);
readFolderRouter.post('/getCodeLogic', getCodeLogic);
readFolderRouter.post('/createNewPythonProjectStructure', createNewPythonProjectStructure);
readFolderRouter.post('/createNewNodeProjectStructure', createNewNodeProjectStructure);
readFolderRouter.post('/saveNewProjectStructure', saveNewProjectStructure);

module.exports = readFolderRouter;