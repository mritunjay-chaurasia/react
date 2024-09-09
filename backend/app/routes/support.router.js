const { Router } = require("express");
const supportRouter = Router();

const { addUserForSupport } = require("../controllers/support.controller.js");
const authentication = require("../middlewares/authentication.js");

supportRouter.post("/supportUserAccount", authentication, addUserForSupport);

module.exports = supportRouter;
