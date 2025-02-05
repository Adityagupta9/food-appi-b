const {createOrder} = require("../controllers/orderController");
const {protect,adminOnly} = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();


router.post("/create-order",protect,adminOnly,createOrder);

module.exports = router;