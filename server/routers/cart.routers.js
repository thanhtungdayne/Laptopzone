var express = require("express");
var router = express.Router();
const cartController = require("../controllers/cart.controller.js");
const { addToCart } = require("../controllers/cart.controller");
const { getCartByUser } = require("../controllers/cart.controller");
const { updateCartItemQuantity } = require("../controllers/cart.controller");

// Thêm sản phẩm vào giỏ hàng
// POST http://localhost:3000/cart/add
router.post("/add", async (req, res) => {
  const { userId, variantId, quantity } = req.body;
  console.log("📦 Nhận request thêm vào giỏ hàng:", { userId, variantId, quantity });

  const result = await addToCart({ userId, variantId, quantity });

  // ❗ NHỚ: phải return để kết thúc response
  return res.status(result.code).json({
    status: result.status,
    message: result.message,
    ...(result.data && { data: result.data }),
  });
});



// Lấy giỏ hàng theo userId
// GET http://localhost:3000/cart/:userId
// Lấy giỏ hàng theo userId
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const result = await getCartByUser(userId);

  if (!result.success) {
    return res.status(500).json({
      status: false,
      message: result.message || "Lỗi khi lấy giỏ hàng",
    });
  }

  return res.status(200).json({
    status: true,
    result: result.data,
  });
});

//cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/update", async (req, res) => {
  console.log("🟨 Body nhận được:", req.body); // 👈 Thêm dòng này để kiểm tra
  const { userId, variantId, quantity } = req.body;

  const parsedQuantity = parseInt(quantity);

  if (!userId || !variantId || isNaN(parsedQuantity)) {
    return res.status(400).json({ message: "Thiếu hoặc sai dữ liệu đầu vào" });
  }

  try {
    const result = await updateCartItemQuantity(userId, variantId, parsedQuantity);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật:", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
});

// xóa 1 sản phẩm khỏi giỏ hàng
router.delete("/remove", async (req, res) => {
  try {
    const { userId, variantId } = req.body;

    // Kiểm tra đầu vào
    if (!userId || !variantId) {
      return res.status(400).json({ message: "Thiếu userId hoặc variantId" });
    }

    const result = await cartController.removeItem(userId, variantId);
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Lỗi khi xoá item:", error);
    res.status(500).json({ message: error.message || "Lỗi server" });
  }
});
//xóa toàn bộ giỏ hàng
router.delete("/clear/:userId", async (req, res) => {
  try {
    const result = await cartController.clearCart(req.params.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
