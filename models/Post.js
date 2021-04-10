const mongoose = require("mongoose");

const Post = mongoose.model(
  "post",
  mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      creatorId: String,
      likes: [{ type: String }],
      imageUrl: String,
      user: String,
    },
    { timestamps: true }
  )
);

module.exports = Post;
