const appEvent = require("../../../events/_config");
const { Users } = require("../../models/User");

const userMutations = {
  async signup(root, { input }) {
    const [existingUser] = await Users.find({ email: input.email });
    if (existingUser) {
      if (existingUser.emailVerified) {
        throw new Error("Please kindly login");
      } else {
        throw new Error(
          "Kindly check your email and click the verification link"
        );
      }
    }
    const password = await hashObject(input.password);
    const user = await Users.create({
      name: input.name,
      email: input.email,
      mobileNumber: input.mobileNumber,
      country: input.country,
      password,
    });
    const token = await generateToken({
      payload: { userId: user.id },
      expirationTime: "24h",
    });
    appEvent.emit("USER_SIGNUP", {
      emailContent: {
        verificationToken: token,
        subject: "Email Confirmation",
        action: "confirmation",
        htmlTemplate: "welcome",
      },
      user,
    });
    return user;
  },

  async login(root, { input }) {
    const [user] = await Users.find({ email: input.email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    if (!user.emailVerified) {
      throw new Error(
        "Kindly check your email and click the verification link"
      );
    }
    const passwordValid = await verifyObject({
      sentObject: input.password,
      accurateObject: user.password,
    });
    if (!passwordValid) {
      throw new Error("Invalid email or password");
    }
    return {
      token: await generateToken({
        payload: { userId: user.id },
        expirationTime: "30d",
      }),
      user: user,
    };
  },
};

module.exports = { userMutations };
