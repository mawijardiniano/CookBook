const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { token } = req.body;  // The token received from frontend

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // The Client ID
    });

    const payload = ticket.getPayload();
    const { sub, name, email } = payload;

    // Check if the user already exists in the database
    let user = await User.findOne({ googleId: sub });

    // If user doesn't exist, create a new user
    if (!user) {
      user = new User({
        googleId: sub,  // Store the Google ID for future logins
        name,
        email,
      });

      // Save the new user to the database
      await user.save();
    }

    // Create a JWT token for the user (whether they were created or found)
    const jwtToken = jwt.sign({ googleId: sub, name, email }, process.env.JWT_SECRET);

    // Send the token and user info in the response
    res.json({
      token: jwtToken,
      name: user.name,
      email: user.email,
      message: 'Login successful!',
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid Google token or error verifying token' });
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
      process.env.JWT_SECRET,
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
    console.error("Error during login:", error.message); // Log the error message
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {}
};

const getUserLoggedin = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { userLogin, userSignup, getUserLoggedin, getAllUsers, googleLogin };
