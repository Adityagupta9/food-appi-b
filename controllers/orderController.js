const Order = require("../models/Order");

const createOrder = async (req, res) => {
    try {
        console.log("🔍 Received request body:", req.body); // Debugging log

        const { customerName, items, totalAmount, status } = req.body;

        if (!customerName || !items || items.length === 0) {
            return res.status(400).json({ message: "Invalid order data" });
        }

        // Ensure each item has a name, quantity, and price
        for (const item of items) {
            if (!item.name || !item.quantity || !item.price) {
                return res.status(400).json({ message: "Each item must have a name, quantity, and price" });
            }
        }

        // Auto-calculate total amount if missing
        const calculatedTotalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const newOrder = await Order.create({
            customerName,
            items,
            totalAmount: totalAmount || calculatedTotalAmount, // Use provided or calculated total
            status: status || "Pending",
        });

        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        console.error("❌ Error in creating order:", error.message);
        res.status(400).json({ message: "Error in creating order", error: error.message });
    }
};

module.exports = { createOrder };
