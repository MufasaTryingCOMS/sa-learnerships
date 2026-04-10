const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["applicant", "provider", "admin"],
      default: "applicant",
    },
    //this is the status that we can be use to block or unblock users 
    // instead of deleting them because we might need the data for future reference
    status: {
      type: String,
enum: ["active", "inactive", "disabled"],
      default: "active",
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("User", userSchema);
