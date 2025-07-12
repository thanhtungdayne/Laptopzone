const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");
const userModel = require("../models/users.model.js");

module.exports = {
  placeOrder,
  cancelOrderByUser,
    updateOrderStatus
};

async function placeOrder(req) {
  const userId = req.body.userId;
  const { shippingAddress, paymentMethod } = req.body;

  // B1: Tìm giỏ hàng
  const cart = await cartModel.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new Error("Giỏ hàng trống, không thể đặt hàng");
  }

  // B2: Kiểm tra shippingAddress
  if (
    !shippingAddress ||
    !shippingAddress.address ||
    !shippingAddress.phone ||
    !shippingAddress.fullName
  ) {
    throw new Error("Thiếu thông tin địa chỉ giao hàng");
  }

  // B3: Chuẩn bị dữ liệu đơn hàng
  const orderItems = cart.items.map((item) => ({
    productVariantId: item.productVariantId,
    productName: item.productName,
    productImage: item.productImage,
    attributes: item.attributes,
    quantity: item.quantity,
    price: item.price,
  }));

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // B4: Tạo đơn hàng mới
  const order = new orderModel({
    userId,
    items: orderItems,
    shippingAddress, // lấy từ người dùng nhập
    paymentMethod,
    totalAmount,
    status: "pending",
    isPaid: false,
  });

  const savedOrder = await order.save();

  // B5: Xóa giỏ hàng
  await cartModel.deleteOne({ userId });

  return savedOrder;
}

//hủy đơn hàng
async function cancelOrderByUser(req) {
  try {
    const { id } = req.params;
    const userId = req.body.userId;
    
    const order = await orderModel.findById(id);
    if (!order) throw new Error("Không tìm thấy đơn hàng");

    if (order.userId.toString() !== userId) {
      throw new Error("Bạn không có quyền hủy đơn hàng này");
    }

    if (order.status.trim() !== "pending") {
      throw new Error("Chỉ có thể hủy đơn hàng đang chờ xử lý. Trạng thái hiện tại: " + order.status);
    }
    order.status = "cancelled";
    await order.save();

    return order;
  } catch (error) {
    console.error("Lỗi hủy đơn:", error.message);
    throw error; // 🔁 ném lại để router xử lý
  }
}
//cập nhật trạng thái đơn hàng
async function updateOrderStatus(req) {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "confirmed", "shipping", "delivered", "cancelled", "returned"];

  console.log("Trạng thái nhận được:", status); // ✅ Log giá trị nhập vào

  if (!validStatuses.includes(status)) {
    throw new Error(`Trạng thái không hợp lệ: ${status}`);
  }

  const order = await orderModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!order) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  console.log("Đơn hàng sau khi cập nhật:", order.status); // ✅ Log kết quả

  return order;
}