const express = require("express");
const { createFoodItem, getAllFoodItems, deleteFoodItem, getFoodPhoto } = require("../controllers/foodController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const multer = require("multer");

const router = express.Router();

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage, 
    limits: { fileSize: 2 * 1024 * 1024 }  // 2MB limit
});


// Routes with middleware
router.post("/create", protect, adminOnly, upload.single("photo"), createFoodItem);
router.get("/all", protect,adminOnly, getAllFoodItems);
router.get("/photo/:id", protect,adminOnly, getFoodPhoto);
router.delete("/delete/:id", protect, adminOnly, deleteFoodItem);

module.exports = router;
