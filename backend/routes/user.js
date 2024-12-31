const express = require("express");
const {
  userSignup,
  userLogin,
  getUserLoggedin,
  getAllUsers,
  editUsername,
  googleLogin,
} = require("../controllers/userController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/google-login", googleLogin);
router.put("/edit/:userId", editUsername)
router.get("/user/:id", authenticateToken, getUserLoggedin);
router.get("/all", getAllUsers);

module.exports = router;
