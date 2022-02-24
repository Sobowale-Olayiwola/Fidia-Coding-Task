const { NODE_ENV } = process.env;
const {
  CustomControllerError,
  CustomValidationError,
} = require("./customErrors");

const {
  hashObject,
  verifyObject,
  generateToken,
  verifyToken,
} = require("./encryption");

const { sendEmail } = require("./mailer");

global.verifyDevelopmentEnvironment = NODE_ENV === "development" ? true : false;
global.verifyProductionEnvironment = NODE_ENV === "production" ? true : false;

/**
 * Custom Error Object globalization
 */
global.CustomValidationError = CustomValidationError;
global.CustomControllerError = CustomControllerError;

/**
 * Encryption object globalization
 */
global.hashObject = hashObject;
global.verifyObject = verifyObject;
global.generateToken = generateToken;
global.verifyToken = verifyToken;

/**
 * Globalizing sendEmail
 */
global.sendEmail = sendEmail;
