const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcrypt");

// Create Staff
const createStaff = async (req, res) => {
    try {
        const { email, name, phone, password } = req.body;
        if (!email || !name || !phone || !password) {
            return res.status(400).json({ message: "Enter all fields" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Staff already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newStaff = await User.create({ name, email, phone, password: hashedPassword, role: "staff" });
        res.status(201).json({ message: "Staff created successfully", newStaff });
    } catch (error) {
        res.status(500).json({ message: "Error in creating staff", error: error.message });
    }
};

// Update Staff (Admin Only)
const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, password } = req.body;
        const staff = await User.findById(id);
        if (!staff || staff.role !== "staff") {
            return res.status(404).json({ message: "Staff not found" });
        }

        if (password) {
            staff.password = await bcrypt.hash(password, 10);
        }
        staff.name = name || staff.name;
        staff.email = email || staff.email;
        staff.phone = phone || staff.phone;

        await staff.save();
        res.status(200).json({ message: "Staff updated successfully", updatedStaff: staff });
    } catch (error) {
        res.status(500).json({ message: "Error in updating staff", error: error.message });
    }
};

// Delete Staff
const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await User.findById(id);
        if (!staff || staff.role !== "staff") {
            return res.status(404).json({ message: "Staff not found" });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "Staff account deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error in deleting staff account", error: error.message });
    }
};

// Get All Orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error while fetching all orders", error: error.message });
    }
};

// Get All Staff Members
const getAllStaff = async (req, res) => {
    try {
        const staff = await User.find({ role: "staff" });
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update Admin
const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, password } = req.body;

        const admin = await User.findById(id);
        if (!admin || admin.role !== "admin") {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (password) {
            admin.password = await bcrypt.hash(password, 10);
        }
        admin.name = name || admin.name;
        admin.email = email || admin.email;
        admin.phone = phone || admin.phone;

        await admin.save();
        res.status(200).json({ message: "Admin updated successfully", updatedAdmin: admin });
    } catch (error) {
        res.status(500).json({ message: "Error updating admin", error: error.message });
    }
};

// Delete Admin (An admin cannot delete themselves)
const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.id === id) {
            return res.status(400).json({ message: "You cannot delete yourself" });
        }

        const admin = await User.findById(id);
        if (!admin || admin.role !== "admin") {
            return res.status(404).json({ message: "Admin not found" });
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting admin", error: error.message });
    }
};

// Get All Admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: "admin" }).select("-password");
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: "Error fetching admins", error: error.message });
    }
};

// Delete All Orders (Admin Only)
const deleteAllOrders = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Only admins can delete all orders." });
        }

        await Order.deleteMany({});
        res.status(200).json({ message: "All orders have been deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting all orders", error: error.message });
    }
};

module.exports = {
    createStaff,
    updateStaff,
    deleteStaff,
    getAllOrders,
    getAllStaff,
    updateAdmin,
    deleteAdmin,
    getAllAdmins,
    deleteAllOrders,
};
