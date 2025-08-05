var express = require("express");
var router = express.Router();
const orderController = require("../controllers/order.controller.js");
const { getOrdersByUserId } = require("../controllers/order.controller.js");
const { getOrderByIdAndUser } = require("../controllers/order.controller.js");
const { getAllOrders } = require("../controllers/order.controller.js");
const { updateIsPaid } = require("../controllers/order.controller.js");
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

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Lấy userId từ URL params

    // Kiểm tra userId hợp lệ
    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "Thiếu userId trong URL",
      });
    }

    const response = await getOrdersByUserId(userId);

    if (response.status) {
      return res.status(200).json(response);
    } else {
      return res.status(404).json(response);
    }
  } catch (error) {
    console.error("❌ Lỗi trong router:", error.message);
    return res.status(500).json({
      status: false,
      message: "Lỗi máy chủ: " + error.message,
    });
  }
});
// Lấy đơn hàng theo userId và orderId
router.get("/orders/:userId/:orderId", async (req, res) => {
  try {
    const { userId, orderId } = req.params;

    const order = await getOrderByIdAndUser(orderId, userId);

    if (!order) {
      return res.status(404).json({ message: "Order not found or invalid ID" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Lấy tất cả đơn hàng
// http://localhost:5000/order/get/all
router.get("/get/all", async (req, res) => {
  try {
    const orders = await orderController.getAllOrders();
    res.status(200).json({
      success: true,
      message: "Lấy tất cả đơn hàng thành công",
      orders: orders,
    });
  } catch (error) {
    console.error("Lỗi khi lấy tất cả đơn hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ: " + error.message,
    });
  }
});
// Cập nhật phương thức thanh toán
// http://localhost:5000/order/update-ispaid/:orderId
router.put("/update-ispaid/:orderId/", async (req, res) => {
  const { orderId } = req.params;
  const { isPaid } = req.body;

  try {
    const updatedOrder = await updateIsPaid(orderId, isPaid);
    res.status(200).json({
      message: "Cập nhật trạng thái thanh toán thành công.",
      order: updatedOrder,
    });
  } catch (error) {
    const statusCode = error.status || 500;
    const message = error.message || "Lỗi server khi cập nhật isPaid.";
    res.status(statusCode).json({ message });
  }
});

module.exports = router;
