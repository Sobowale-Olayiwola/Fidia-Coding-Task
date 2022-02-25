/**
 * This handles all the required configuration for the User model.
 * @module MODELS:User
 */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // Model Required fields
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdOn: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  updatedOn: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  // Custom Fields
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  country: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
});

const Users = mongoose.model("User", UserSchema);

module.exports = {
  Users,
};
