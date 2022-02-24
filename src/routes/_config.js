/**
 * This handles all the required Express router configuration for the application.
 * @module ROUTES:Config
 */

const router = require("express").Router();
const helmet = require("helmet");
const {
  handle404,
  handleError,
  setupRequest,
  processResponse,
  processHTMLResponse,
} = require("../middlewares/http");

/** Models Route Handlers */
const userRouteHandler = require("./user");

router.use(helmet());
/** Cross Origin Handling */
router.use(setupRequest);
//router.use("/samples", sampleRouteHandler);
router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to REST API" });
});
router.use("/users", userRouteHandler);
router.use(processHTMLResponse);
router.use(processResponse);

router.use(handle404);
router.use(handleError);

module.exports = router;
