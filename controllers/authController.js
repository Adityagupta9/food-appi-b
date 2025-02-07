const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios"); // ✅ Add missing axios import

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User (Admin only)
const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (role !== "staff" && role !== "admin") {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, phone, password: hashedPassword, role });
    
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Login User
const login = async (req, res) => {
  try {

    const { email, password, recaptchaToken } = req.body;

    if (!email || !password || !recaptchaToken) {
      console.log("❌ Missing fields:", { email, password, recaptchaToken });
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify reCAPTCHA token
    const recaptchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET,
          response: recaptchaToken,
        },
      }
    );


    if (!recaptchaResponse.data.success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user._id, user.role);
    res.json({ message: "Login successful", token, user });

  } catch (error) {
    console.error("❌ Server error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching user", error: error.message });
  }
};

module.exports = { register, login, getUserProfile };
