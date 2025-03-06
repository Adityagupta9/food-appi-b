const Food = require("../models/foodModel");
const fs = require("fs");

// Create Food Item
const createFoodItem = async (req, res) => {
  try {
    console.log("🔹 Request received at /api/food/create");

    console.log("🟢 Request Body:", req.body);
    console.log("🟢 Uploaded File:", req.file);

    const { name, description, price, tag } = req.body;
    const file = req.file;  // Correct way to access uploaded file

    if (!name || !description || !price || !tag) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    const food = new Food({
      name,
      description,
      price,
      tag,
      status: "Pending",
    });

    if (file) {
      food.photo.data = file.buffer;
      food.photo.contentType = file.mimetype;
      console.log("🟢 File attached successfully");
    }

    await food.save();
    console.log("✅ Food item created successfully:", food);

    res.status(201).json({ message: "Food item created successfully", food });
  } catch (error) {
    console.log("❌ Server error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

  

// Get All Food Items (Without Photo)
const getAllFoodItems = async (req, res) => {
  try {
    const foods = await Food.find().select("-photo");
    const formattedFoods = foods.map(food => ({
      ...food._doc,
      photoUrl: `https://food-appi-b.vercel.app/api//photo/${food._id}`,
    }));

    res.status(200).json(formattedFoods);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Get Food Photo
const getFoodPhoto = async (req, res) => {
    try {
      const foodId = req.params.id.trim();  // Trim any extra whitespace or newline characters
     
  
      const food = await Food.findById(foodId).select("photo");
  
      if (!food || !food.photo || !food.photo.data) {
        console.log("❌ Photo not found for this ID");
        return res.status(404).send({ error: "Photo not found" });
      }
  
      res.set("Content-Type", food.photo.contentType);
      res.send(food.photo.data);
    } catch (error) {
      console.log("❌ Error fetching image:", error.message);
      res.status(500).send({ error: "Error fetching image", details: error.message });
    }
  };
  
  

// Delete Food Item
const deleteFoodItem = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ error: "Food item not found" });
    }
    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = { createFoodItem, getAllFoodItems, getFoodPhoto, deleteFoodItem };
