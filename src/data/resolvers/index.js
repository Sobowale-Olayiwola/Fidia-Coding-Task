const { userMutations } = require("./Mutation/User");
const { User } = require("./Query/User");

module.exports = {
  Query: {
    ...User,
  },
  Mutation: {
    ...userMutations,
  },
};
