const mongoose = require("mongoose");

const User = mongoose.model(
  "user",
  mongoose.Schema({
    _id: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    imageUrl: String,
    bannerImgUrl: String,
    friends: [String],
    bio: String,
    birthday: Date,
  })
);

module.exports = User;
