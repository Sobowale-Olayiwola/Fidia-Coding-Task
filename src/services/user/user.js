/**
 *
 * This handles the business logic for the User Model
 * @module SERVICE:User
 */

const UserController = require("../../controller/user");
const { verifyToken, generateToken } = require("../../utilities/encryption");
const RootService = require("../_root");
const appEvent = require("../../events/_config");
const jwt = require("jsonwebtoken");

/**
 *
 * This is the integration of the User model routes
 *  with the User model controller bridging by holding core business logic.
 * @class
 */
class UserService extends RootService {
  constructor() {
    super();
    this.userController = new UserController();
    this.serviceName = "UserService";
  }

  /**
   *
   * @typedef RequestFunctionParameter
   * @property {object} request Express Request parameter
   * @property {function} next Express NextFunction parameter
   */

  async verifyEmail({ request, response, next }) {
    const { verificationToken } = request.query;
    try {
      const decode = await verifyToken(verificationToken);
      const filter = { conditions: { _id: decode.userId } };
      const result = await this.userController.readRecords(filter);
      if (result && result.failed)
        throw new CustomControllerError(result.error);
      if (result[0].emailVerified) {
        throw new Error("Kindly login, email is already verified");
      } else {
        const updateResult = await this.userController.updateRecords({
          conditions: { _id: decode.userId },
          data: {
            emailVerified: true,
          },
        });
        if (updateResult && updateResult.failed)
          throw new CustomControllerError(updateResult.error);
        updateResult["message"] = "Email verified. Kindly login";
        return this.processUpdateResult({ result: updateResult });
      }
    } catch (e) {
      if ((e.message = "jwt expired")) {
        const payload = jwt.verify(verificationToken, process.env.SIGNATURE, {
          ignoreExpiration: true,
        });
        return this.processHTMLResponse({
          payload: {
            html: `
            <h1>Resend Email Confirmation Link</h1>
            <p>Thank you for your registration on Fidia. Kindly resend your email verification link by clicking on the following link below</p>
            <a href=${process.env.BASE_URL}/api/v1/users/resend-email-verification?userId=${payload.userId}> Click here</a>
            </div>
          `,
          },
        });
      }
      const processedError = this.formatError({
        service: this.serviceName,
        error: e,
        functionName: "verifyEmail",
      });
      return next(processedError);
    }
  }
  async resendEmailVerification({ request, response, next }) {
    try {
      const filter = { conditions: { _id: request.query.userId } };
      const user = await this.userController.readRecords(filter);
      if (user && user.failed) throw new CustomControllerError(user.error);
      const token = await generateToken({
        payload: { userId: user[0]._id },
        expirationTime: "24h",
      });
      appEvent.emit("USER_SIGNUP", {
        emailContent: {
          verificationToken: token,
          subject: "Email Confirmation Resent",
          action: "confirmation",
        },
        user: user[0],
      });
      response
        .status(200)
        .json({ message: "Kindly check your mail for confirmation link" });
      return;
    } catch (e) {
      const processedError = this.formatError({
        service: this.serviceName,
        error: e,
        functionName: "resendEmailVerification",
      });
      return next(processedError);
    }
  }
}

module.exports = UserService;
