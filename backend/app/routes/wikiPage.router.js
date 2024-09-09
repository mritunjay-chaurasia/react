const { Router } = require('express');
const authentication = require('../middlewares/authentication');
const { createWikiPage, getWikiPage ,updateWikiDetails,deleteWikiDetails} = require('../controllers/wikiPage.controller');
const wikiPage = Router();

wikiPage.post('/createWikiPage', authentication, createWikiPage);
wikiPage.post('/getWikiPage', authentication, getWikiPage);
wikiPage.post('/updateWikiDetails', authentication, updateWikiDetails);
wikiPage.delete('/deleteWikiDetails', authentication, deleteWikiDetails);

module.exports = wikiPage;