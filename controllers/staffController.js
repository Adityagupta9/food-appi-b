const Order = require("../models/Order");

const getAllOrders = async(req,res)=>{
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(400).json({message:"Error in fetching all orders",error:error.message});
    }
}

const updateOrder = async(req,res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;
        const order = await Order.findById(id);
        if(!order){
            res.status(400).json({message:"Invalid order"});
        }
        order.status = status;
        await order.save();
        res.status(200).json({message:"Order updated successfully",order});
    } catch (error) {
        res.status(500).json({message:"Error while updating the order",error:error.message})
    }

}

module.exports = {getAllOrders,updateOrder};