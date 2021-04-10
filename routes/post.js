const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort("-createdAt").limit(10);
    res.json(posts);
  } catch (err) {
    res.status(404).json(err.message);
  }
});

router.post("/", auth, async (req, res) => {
  const _id = req.userId;
  try {
    const result = await Post.create({ ...req.body, creatorId: _id });
    res.status(201).send(result);
  } catch (error) {
    res.status(409).json(error);
  }
});

router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const result = await Post.find({ creatorId: _id });
    res.send(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/like/", auth, async (req, res) => {
  const _id = req.userId;
  const postId = req.body.postId;
  try {
    const post = await Post.findById(postId);
    const liked = post.likes.includes(_id);
    if (liked) {
      post.likes = post.likes.filter((like) => like !== _id);
    } else {
      post.likes.push(_id);
    }
    await Post.findByIdAndUpdate(postId, post, {
      new: true,
    });
    res.status(200);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
