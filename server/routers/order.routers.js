var express = require("express");
var router = express.Router();
const orderController = require("../controllers/order.controller.js");

//đăt hàng
router.post("/place", async (req, res) => {
  try {
    const result = await orderController.placeOrder(req);
    return res.status(201).json({
      success: true,
      message: "Đặt hàng thành công",
      order: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi đặt hàng",
    });
  }
});

//hủy đơn
//http://localhost:3000/order/cancel/:id
router.put("/cancel/:id", async (req, res) => {
  try {
    const result = await orderController.cancelOrderByUser(req);
    res.status(200).json({
      status: true,
      message: "Hủy đơn hàng thành công",
      order: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Lỗi hủy đơn hàng",
    });
  }
});
// Cập nhật trạng thái đơn hàng
// http://localhost:3000/order/status/:id
router.put("/status/:id", async (req, res) => {
  try {
    const result = await orderController.updateOrderStatus(req);
    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      order: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi cập nhật trạng thái",
    });
  }
});
module.exports = router;
