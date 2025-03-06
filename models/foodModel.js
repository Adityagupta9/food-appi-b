const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    tag: {
        type: String, // Specify the type
        enum: ["North Indian", "Chinese", "Salad", "Mughlai", "Biryani", "Seafood", "Beverages", "Desserts"],
        required: true
      },
      
      
    status: { type: String, enum: ["Pending", "Available"], default: "Pending" },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
