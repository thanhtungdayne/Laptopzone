const cartModel = require("../models/cart.model");
const productVariantModel = require("../models/productVartiant.model");
const productModel = require("../models/product.model");
const mongoose = require("mongoose");

module.exports = {
  addToCart,
  // cancelOrderByUser,
  getCartByUser,
  updateCartItemQuantity,
  removeItem,
  clearCart,
};
// Thêm giỏ hàng
async function addToCart({ userId, variantId, quantity }) {
  console.log('addToCart - Input:', { userId, variantId, quantity });
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('addToCart - Invalid userId:', userId);
      return { status: false, code: 400, message: "userId không hợp lệ" };
    }

    if (!mongoose.Types.ObjectId.isValid(variantId)) {
      console.log('addToCart - Invalid variantId:', variantId);
      return { status: false, code: 400, message: "variantId không hợp lệ" };
    }

    console.log('addToCart - Querying productVariantModel for variantId:', variantId);
    const variantDoc = await productVariantModel.findOne({ "variants._id": variantId });
    if (!variantDoc) {
      console.log('addToCart - Variant not found for variantId:', variantId);
      return { status: false, code: 404, message: "Không tìm thấy biến thể sản phẩm" };
    }

    const variant = variantDoc.variants.find(v => v._id.toString() === variantId);
    if (!variant) {
      console.log('addToCart - Sub-variant not found for variantId:', variantId);
      return { status: false, code: 404, message: "Không tìm thấy biến thể con" };
    }
    console.log('addToCart - Found variant:', variant);

    console.log('addToCart - Querying productModel for productId:', variantDoc.productId);
    const product = await productModel.findById(variantDoc.productId);
    if (!product) {
      console.log('addToCart - Product not found for productId:', variantDoc.productId);
      return { status: false, code: 404, message: "Không tìm thấy sản phẩm gốc" };
    }
    console.log('addToCart - Found product:', product);

    const attributesSnapshot = variant.attributes.map(attr => ({
      name: attr.attributeName,
      value: attr.value,
    }));
    console.log('addToCart - Attributes snapshot:', attributesSnapshot);

    console.log('addToCart - Querying cartModel for userId:', userId);
    let cart = await cartModel.findOne({ userId });
    console.log('addToCart - Current cart:', cart);

    if (!cart) {
      console.log('addToCart - Creating new cart for userId:', userId);
      cart = new cartModel({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.variantId.toString() === variantId);
    if (existingItem) {
      console.log('addToCart - Updating existing item quantity:', { variantId, newQuantity: existingItem.quantity + quantity });
      existingItem.quantity += quantity;
    } else {
      console.log('addToCart - Adding new item:', { variantId, quantity });
      cart.items.push({
        variantId,
        quantity,
        price: variant.price,
        productName: product.name,
        productImage: product.image,
        attributes: attributesSnapshot,
      });
    }

    cart.updatedAt = new Date();
    cart.cartTotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    console.log('addToCart - Cart before save:', cart);

    const savedCart = await cart.save();
    console.log('addToCart - Cart after save:', savedCart);

    return {
      status: true,
      code: 200,
      message: "Đã thêm vào giỏ hàng",
      data: savedCart,
    };
  } catch (error) {
    console.error("addToCart - Lỗi trong addToCart:", error);
    return { status: false, code: 500, message: "Lỗi server khi thêm vào giỏ hàng", error: error.message };
  }
}

// Lấy giỏ hàng theo userId
async function getCartByUser(userId) {
  console.log('getCartByUser - Starting', { userId });
  try {
    const cart = await cartModel.findOne({ userId });
    console.log('getCartByUser - Found cart:', cart);

    if (!cart) {
      console.log('getCartByUser - No cart found, returning empty cart');
      return { success: true, data: { items: [], cartTotal: 0 } };
    }

    return { success: true, data: cart };
  } catch (error) {
    console.error('getCartByUser - Lỗi khi lấy giỏ hàng:', error);
    return { success: false, message: "Lỗi khi lấy giỏ hàng", error: error.message };
  }
}
//cập nhật số lượng sản phẩm trong giỏ hàng
async function updateCartItemQuantity(userId, variantId, quantity) {
  console.log("⚙️ Đang update:", { userId, variantId, quantity });

  const cart = await cartModel.findOne({ userId });
  if (!cart) {
    console.error("🚫 Không tìm thấy giỏ hàng");
    throw new Error("Không tìm thấy giỏ hàng");
  }

  const item = cart.items.find((i) => i.variantId?.toString() === variantId);
  if (!item) {
    console.error("🚫 Không tìm thấy sản phẩm trong giỏ hàng:", variantId);
    throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.variantId.toString() !== variantId);
  } else {
    item.quantity = quantity;
  }

  cart.cartTotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cart.updatedAt = new Date();
  await cart.save();

  console.log("✅ Cập nhật giỏ hàng xong");
  return { message: "Cập nhật số lượng thành công" };
}


//Xoá 1 sản phẩm khỏi giỏ hàng
async function removeItem(userId, variantId) {
  const cart = await cartModel.findOne({ userId });
  if (!cart) throw new Error("Không tìm thấy giỏ hàng");

  const newItems = cart.items.filter(
    (i) => i.variantId.toString() !== variantId
  );

  cart.items = newItems;
  cart.cartTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cart.updatedAt = new Date();

  await cart.save();

  return { message: "Đã xoá sản phẩm khỏi giỏ hàng" };
}
//  Xoá toàn bộ giỏ hàng
async function clearCart(userId) {
  const cart = await cartModel.findOne({ userId });
  if (!cart) throw new Error("Không tìm thấy giỏ hàng");

  cart.items = [];
  cart.cartTotal = 0;
  cart.updatedAt = new Date();
  await cart.save();

  return { message: "Đã xoá toàn bộ giỏ hàng" };
}