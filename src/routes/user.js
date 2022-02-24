/**
 * This handles the Sample routes declaration in the application
 * @module ROUTES:Sample
 */

const router = require("express").Router();

const { Logger } = require("../utilities/logger");
const UserService = require("../services/user/user");

const userService = new UserService();

try {
  router
    .get("/verify-email", async (request, response, next) => {
      request.payload = await userService.verifyEmail({
        request,
        response,
        next,
      });
      next();
    })
    .get("/resend-email-verification", async (request, response, next) => {
      await userService.resendEmailVerification({
        request,
        response,
        next,
      });
    });
} catch (e) {
  const currentRoute = "[Route Error] /user";
  if (verifyDevelopmentEnvironment) {
    console.log(`${currentRoute}: ${e.message}`);
  } else {
    Logger.error(`${currentRoute}: ${e.message}`);
  }
} finally {
  module.exports = router;
}
