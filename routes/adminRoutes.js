const {createStaff,updateStaff,deleteStaff,getAllOrders,getAllStaff,updateAdmin,deleteAdmin,getAllAdmins,deleteAllOrders} = require("../controllers/adminController");
const {protect,adminOnly}  = require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

router.post("/create-staff",protect,adminOnly,createStaff);
router.put("/update-staff/:id", protect, adminOnly, updateStaff);
router.delete("/delete-staff/:id",protect,adminOnly,deleteStaff);
router.get("/orders",protect,adminOnly,getAllOrders);
router.get("/staff", protect, adminOnly, getAllStaff);
router.get("/admins", protect, adminOnly, getAllAdmins); 
router.put("/update-admin/:id", protect, adminOnly, updateAdmin);  
router.delete("/delete-admin/:id", protect, adminOnly, deleteAdmin);
router.delete("/delete-all-order",protect, adminOnly, deleteAllOrders);

module.exports = router;