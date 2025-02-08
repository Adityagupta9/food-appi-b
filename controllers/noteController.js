const Note = require("../models/Note");

// ✅ Create Multiple Notes (Admin Only)
const createNote = async (req, res) => {
  try {
    const { content } = req.body;

    const newNote = await Note.create({ content, createdBy: req.user.id });
    res.status(201).json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    res.status(500).json({ message: "Error creating note", error: error.message });
  }
};

// ✅ View All Notes (Admin & Staff)
const viewNote = async (req, res) => {
  try {
    const notes = await Note.find();
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error: error.message });
  }
};

// ✅ Edit a Note by ID (Admin Only)
const editNote = async (req, res) => {
  try {
    const { noteId, content } = req.body;

    let note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.content = content;
    await note.save();

    res.json({ message: "Note updated successfully", note });
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error: error.message });
  }
};

// ✅ Delete a Note by ID (Admin Only)
const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.body;

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    await Note.findByIdAndDelete(noteId);
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error: error.message });
  }
};

module.exports = { createNote, viewNote, editNote, deleteNote };
