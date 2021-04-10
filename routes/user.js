const User = require("../models/User");
const router = require("express").Router();
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

router.post("/find/", async (req, res) => {
  try {
    const id = req.body.id;
    const user = await User.findById(id);
    res.send({
      username: user.username,
      imageUrl: user.imageUrl,
      bannerImgUrl: user.bannerImgUrl,
      _id: user._id,
    });
  } catch (error) {
    res.send(error);
  }
});
router.get("/find/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) res.send("User doesn't exist!");
    res.send(user);
  } catch (error) {
    res.send(error);
  }
});

router.get("/friend/:id", auth, async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  try {
    const user = await User.findById(userId);
    const user1 = await User.findById(id);
    const friends = user1.friends.includes(String(userId));
    if (friends) {
      user.friends = user.friends.filter((friend) => friend !== id);
      user1.friends = user1.friends.filter((friend) => friend !== userId);
    } else {
      user.friends.push(id);
      user1.friends.push(userId);
    }
    await User.findByIdAndUpdate(userId, user);
    await User.findByIdAndUpdate(id, user1);
    res.status(200);
  } catch (error) {
    res.send(error);
  }
});

router.get("/getusers/", async (req, res) => {
  try {
    const users = await User.find().limit(10);
    res.send(users);
  } catch (error) {
    res.send(error);
  }
});

router.post("/update/", auth, async (req, res) => {
  const _id = req.userId;
  try {
    if (_id !== req.body._id)
      return res.status(403).send("You don't have a permission");
    const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    const token = jwt.sign(
      { username: updatedUser.username, id: updatedUser._id },
      process.env.JWT_SECRET
    );
    res.send({ result: updatedUser, token });
  } catch (error) {
    res.send(error);
  }
});
module.exports = router;
