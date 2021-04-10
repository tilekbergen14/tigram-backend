const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

router.post("/google/", async (req, res) => {
  const { imageUrl, username, token } = req.body;
  try {
    const { email, sub } = jwt.decode(token);
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.send({ result: userExist, token });
    }
    const user = await User.create({ imageUrl, username, email, _id: sub });
    res.send({ result: user, token });
  } catch (err) {
    console.log(err.message);
    res.status(400).send("Something went wrong");
  }
});

router.post("/signin/", async (req, res) => {
  const { password, email } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (!userExist) return res.status(400).send("User not found!");

    if (password.length < 5)
      return res.status(400).send("Password must be longer than 4 characters!");

    const passwordsMatch = await bcrypt.compare(password, userExist.password);
    if (!passwordsMatch) return res.status(400).send("Wrong password!");

    const token = jwt.sign(
      { username: userExist.username, id: userExist._id },
      process.env.JWT_SECRET
    );
    res.status(201).json({ result: userExist, token });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/signup/", async (req, res) => {
  const { email, username, password, password2 } = req.body;
  const _id = mongoose.Types.ObjectId().toString();
  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).send("This email already exists!");

    if (password !== password2)
      return res.status.length(400).send("Passwords doesn't match");

    const hashedPass = await bcrypt.hash(password, 12);
    const result = await User.create({
      username,
      password: hashedPass,
      email,
      _id,
    });

    const token = jwt.sign(
      { username: result.username, id: result._id },
      process.env.JWT_SECRET
    );
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
