const express = require("express");
const {
  userSignup,
  userLogin,
  getUserLoggedin,
  getAllUsers,
  getUserProfile,
  editUsername,
  googleLogin,
  FollowUser,
  UnFollow
} = require("../controllers/userController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/google-login", googleLogin);
router.post("/follow/:userId",authenticateToken, FollowUser);
router.post("/unfollow/:userId",authenticateToken, UnFollow);
router.put("/edit/:userId", editUsername)
router.get("/user/:id", authenticateToken, getUserLoggedin);
router.get("/profile/:userId", getUserProfile);
router.get("/all", getAllUsers);

module.exports = router;
