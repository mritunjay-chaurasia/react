const { Router } = require("express");
const authentication = require("../middlewares/authentication");

const {
  updateUserNotification,
  fetchUsersNotification,
  addUsersNotification,
} = require("../controllers/usersNotification.controller");

const usersNotification = Router();

usersNotification.post(
  "/addUsersNotification",
  authentication,
  addUsersNotification
);

usersNotification.post("/fetchUsersNotification", authentication, fetchUsersNotification);
usersNotification.post("/updateNotification", authentication, updateUserNotification);

module.exports = usersNotification;
