const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    content: { type: String, required: true }, // Note content
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
