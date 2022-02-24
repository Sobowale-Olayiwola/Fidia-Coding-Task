/**
 *
 * This is the entry-point for all Nodejs Events in the application
 * @module EVENTS:Config
 */

const EventEmitter = require("events");

const { Logger } = require("../utilities/logger");
// const { sendEmail } = require("../utilities/mailer");

/**
 *
 * This class extends the NodeJS event emitter class and allows
 *  for using custom events in the application.
 * @class
 */
class AppEvent extends EventEmitter {}

const appEvent = new AppEvent();

appEvent.on("error", (error) => {
  Logger.error(`[AppEvent Error] ${error}`);
});

appEvent.on("USER_SIGNUP", async ({ user, emailContent }) => {
  await sendEmail({ user, emailContent });
});

module.exports = appEvent;
