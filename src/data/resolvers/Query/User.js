const { Users } = require("../../models/User");
const User = {
  getUserByID: (root, args) => {
    return new Promise((resolve, reject) => {
      Users.findById(args.id, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });
  },
  getUsers: () => {
    return new Promise((resolve, reject) => {
      Users.find({}, (err, users) => {
        if (err) reject(err);
        else resolve(users);
      });
    });
  },
};

module.exports = {
  User,
};
