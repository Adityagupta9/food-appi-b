const {getAllOrders,updateOrder} = require("../controllers/staffController");
const {protect,staffOnly}  = require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

router.get("/orders",protect,staffOnly,getAllOrders);
router.put("/update-order/:id",protect,staffOnly,updateOrder);

module.exports = router;