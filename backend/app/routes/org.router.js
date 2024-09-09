const { Router } = require('express');
const orgRouter = Router();
const { getOrgDetails, getOrganization, addOrganization, updateOrganization, deleteOrganization ,getAllOrgDetails,getOrgDetailsById,getAllOrgDetailsOwner} = require('../controllers/org.controller');
const authentication = require("../middlewares/authentication.js");

orgRouter.get('/getOrgDetails', authentication, getOrgDetails);
orgRouter.get('/getAllOrgDetails', authentication, getAllOrgDetails);
orgRouter.get('/getAllOrgDetailsOwner', authentication, getAllOrgDetailsOwner);
orgRouter.get('/getAllOrgDetailsById', authentication, getOrgDetailsById);
orgRouter.get('/getorganization', authentication, getOrganization);
orgRouter.post('/addOrganization', authentication, addOrganization);
orgRouter.put('/updateOrganization', authentication, updateOrganization);
orgRouter.delete('/deleteOrganization', authentication, deleteOrganization);

orgRouter.get('/getOrgDetailsById', getOrgDetails);


module.exports = orgRouter;