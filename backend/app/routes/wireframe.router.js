const { Router } = require("express");
const wireFrameRouter = Router();

const {
  createWireframeScreen,
  fetchAllWireFrameData,
  removeWireframeScreen,
  removeAllWireframeScreen,
} = require("../controllers/wireframe.controller.js");
const authentication = require("../middlewares/authentication.js");


wireFrameRouter.post(
    "/addWireframScreen",
    authentication,
    createWireframeScreen
  );

  wireFrameRouter.post(
    '/fetchAllWireFramesData',
    authentication,
    fetchAllWireFrameData
  );

wireFrameRouter.post(
  "/deleteWireframeScreen",
  authentication,
  removeWireframeScreen
);

wireFrameRouter.delete(
  "/deleteAllWireframeScreen",
  authentication,
  removeAllWireframeScreen
);
module.exports = wireFrameRouter;
