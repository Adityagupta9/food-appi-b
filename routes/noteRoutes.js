const express = require("express");
const { viewNote, editNote, deleteNote ,createNote} = require("../controllers/noteController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, adminOnly, createNote);

// Route: View Notes (Admin & Staff)
router.get("/view", protect, viewNote);

// Route: Edit Note (Admin Only)
router.put("/edit", protect, adminOnly, editNote);

// Route: Delete Note (Admin Only)
router.delete("/delete", protect, adminOnly, deleteNote);

module.exports = router;
