const User = require("../models/user");
const Recipe = require("../models/recipe");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, name, email } = payload;

    let user = await User.findOne({ googleId: sub });

    if (!user) {
      user = new User({
        googleId: sub,
        name,
        email,
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { googleId: sub, name, email, userId: user._id },
      process.env.JWT_SECRET
    );

    res.json({
      token: jwtToken,
      userId: user._id,
      name: user.name,
      email: user.email,
      message: "Login successful!",
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "Invalid Google token or error verifying token" });
  }
};

const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res
      .status(201)
      .json({ message: "User created successfully", name: user.name });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET
    );

    console.log("Generated token:", token);
    console.log("User data:", user);

    res.status(200).json({
      status: "ok",
      data: {
        token,
        userId: user._id,
        name: user.name,
        email: user.email,
      },
      message: "Login Successful",
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("likedRecipes")
      .populate({
        path: "savedRecipes",
        populate: {
          path: "createdBy",
          model: "User",
        },
      });
    res.json(users);
  } catch (error) {}
};

const getUserLoggedin = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId)
      .populate({
        path: "likedRecipes",
        populate: {
          path: "createdBy",
          model: "User",
        },
      })
      .populate({
        path: "savedRecipes",
        populate: {
          path: "createdBy",
          model: "User",
        },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      likedRecipes: user.likedRecipes,
      savedRecipes: user.savedRecipes,
      followers: user.followers,
      following: user.following,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const editUsername = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.status(200).json({ status: "ok", data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const FollowUser = async (req, res) => {
  try {
    console.log("Request params:", req.params);
    console.log("Authenticated user ID:", req.user.userId);

    const { userId } = req.params; 
    const currentUserId = req.user.userId;

    if (userId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    console.log("Target user found:", targetUser);

    const updatedTargetUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { followers: currentUserId } },
      { new: true }
    );

    console.log("Updated target user:", updatedTargetUser);

    const updatedUser = await User.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { following: userId } },
      { new: true }
    ).populate("following", "name email");

    console.log("Updated authenticated user:", updatedUser);

    return res.status(200).json({
      message: "User followed successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("FollowUser Error:", error);
    res.status(500).json({ message: "An error occurred while following the user." });
  }
};




module.exports = {
  userLogin,
  userSignup,
  getUserLoggedin,
  getAllUsers,
  googleLogin,
  editUsername,
  FollowUser
};
