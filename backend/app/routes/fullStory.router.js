const { Router } = require('express');
const { saveEvents, getEvents } = require('../controllers/fullStory.controller');
const fullStoryRouter  = Router();

fullStoryRouter.post('/saveEvents', saveEvents);
fullStoryRouter.get('/getEvents', getEvents);

module.exports = fullStoryRouter;