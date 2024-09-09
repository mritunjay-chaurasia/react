const { Router } = require('express');
const { getAllUsers, getAllRepos } = require('../controllers/superAdmin.controller');
const authentication = require('../middlewares/authentication');
const { getAllDocs } = require('../controllers/documentations.controller');
const superAdminRouter = Router();

superAdminRouter.get('/getAllUsers', authentication, getAllUsers);
superAdminRouter.post('/getAllRepos', authentication, getAllRepos);
superAdminRouter.get('/getAllDocs', authentication, getAllDocs);

module.exports = superAdminRouter;