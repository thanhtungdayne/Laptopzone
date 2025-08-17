const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");
const userModel = require("../models/users.model.js");
const mongoose = require("mongoose");

module.exports = {
  placeOrder,
  cancelOrderByUser,
    updateOrderStatus,
  getOrdersByUserId,
  getOrderByIdAndUser,
  getAllOrders,
  updateIsPaid,
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
   productVariantId: item.variantId,
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
  console.log("🛒 Cart Items:", cart.items)

  // B4: Tạo mã đơn hàng duy nhất
  const date = new Date();
  const dateString = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 ký tự ngẫu nhiên
  const orderCode = `ORDER-${dateString}-${randomString}`;

  // B5: Tạo đơn hàng mới
  const order = new orderModel({
  userId,
  orderCode, // Thêm mã đơn hàng
  items: orderItems,
  shippingAddress,
  paymentMethod,
  totalAmount,
  status: paymentMethod === "zalo" ? "paid" : "pending", // nếu thanh toán zalo thì coi như đã trả
  isPaid: paymentMethod === "zalo", // ✅ true nếu zalo
  createdAt: new Date(),
  estimatedDelivery: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000),
});

  const savedOrder = await order.save();

  // B6: Xóa giỏ hàng
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
// lấy danh sách đơn hàng theo userId
async function getOrdersByUserId(userId) {
  try {
    console.log("📥 Lấy đơn hàng cho userId:", userId);

    const orders = await orderModel.find({ userId });

    if (!orders || orders.length === 0) {
      return {
        status: false,
        message: "Không tìm thấy đơn hàng nào cho người dùng này",
      };
    }

    console.log("✅ Đơn hàng tìm được:", orders.length);

    return {
      status: true,
      message: "Lấy danh sách đơn hàng thành công",
      result: orders,
    };
  } catch (error) {
    console.error("❌ Lỗi khi lấy đơn hàng:", error.message);
    return {
      status: false,
      message: "Lỗi máy chủ: " + error.message,
    };
  }
}

//lấy đơn hàng cụ thể
async function getOrderByIdAndUser(orderId, userId) {
  try {
    console.log("orderId:", orderId);
console.log("userId:", userId);
    const order = await orderModel.findOne({
      _id: new mongoose.Types.ObjectId(orderId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    return order;
  } catch (error) {
    console.error("Error in getOrderByIdAndUser:", error);
    return null;
  }
}
// lấy tất cả đơn hàng
async function getAllOrders() {
  try {
    const orders = await orderModel.find();
    return orders;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
}
// cập nhật trạng thái thanh toán
async function updateIsPaid(orderId, isPaid) {
  

  if (typeof isPaid !== "boolean") {
    throw { status: 400, message: "`isPaid` phải là kiểu boolean." };
  }

  const updatedOrder = await orderModel.findByIdAndUpdate(
    orderId,
    { isPaid },
    { new: true }
  );

  if (!updatedOrder) {
    throw { status: 404, message: "Không tìm thấy đơn hàng." };
  }

  return updatedOrder;
};


