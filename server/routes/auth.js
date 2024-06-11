const express = require("express");
const router = express.Router();
const User = require("../models/users");
const { encryptPassword, comparePassword } = require("../utils/hash");
const generateToken = require("../utils/token");
const requireAuth = require("../middleware/requireAuth");

router.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const hashedPassword = await encryptPassword(password);
    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();
    const token = generateToken({
      id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
    });
    return res.status(200).json({ token, user: newUser });
  } catch (error) {
    return res.status(400).json({ message: "Error occured while registering" });
  }
});

router.get("/user/:userId", requireAuth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.find({ _id: userId });
    res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ message: "Error while reteriving data" });
  }
});

router.get("/users", requireAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ message: "Error while fetching users data" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Account not found" });

  const validate = await comparePassword(user.password, password);
  if (validate) {
    const token = generateToken({
      id: user._id,
      userName: user.userName,
      email: user.email,
    });
    return res
      .status(200)
      .json({ token, user, message: "Logged in successfully" });
  } else return res.status(400).json({ message: "Login failed" });
});

module.exports = router;
