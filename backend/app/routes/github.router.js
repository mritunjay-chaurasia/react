const { Router } = require('express');
const { updateGitHubFile, saveGitTokenToDb } = require('../controllers/github.controller');
const github = Router();


github.post('/updateGitHubFile', updateGitHubFile);
github.post('/saveGitTokenToDb',saveGitTokenToDb);

module.exports = github;