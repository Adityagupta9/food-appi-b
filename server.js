require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const staffRoutes = require("./routes/staffRoutes");
const noteRoutes = require("./routes/noteRoutes");
const foodRoutes = require("./routes/foodRoutes");

const app = express();

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ✅ Root Route to Check if Backend is Running
app.get("/", (req, res) => {
    console.log("✅ Root route accessed");
    res.send("✅ API is running....");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/food", foodRoutes);

// Connect to Database
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at port: ${PORT}`);
});
