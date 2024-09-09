const { Router } = require('express');
const { fetchSubscriptionDetails, getAllPlans, addCustomerCard } = require('../controllers/stripe.controller');
const authentication = require('../middlewares/authentication');
const stripeRouter = Router();


stripeRouter.get('/fetchSubscriptionDetails', authentication, fetchSubscriptionDetails);
stripeRouter.get('/subscriptions', authentication, getAllPlans);
stripeRouter.post('/addCustomerCard', authentication, addCustomerCard);

module.exports = stripeRouter;

