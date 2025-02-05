const express = require("express");
const { login, register,getUserProfile} = require("../controllers/authController");
const { protect,adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register",protect,adminOnly,register);
router.post("/login", login);
router.get("/user",protect,getUserProfile);

module.exports = router;
