// controllers/wishlist.controller.js
const wishlistModel = require("../models/wishlist.model");

async function addToWishlist({ userId, productId }) {
  try {
    // 👇 Log dữ liệu đầu vào
    console.log("Dữ liệu nhận được:", { userId, productId });

    let wishlist = await wishlistModel.findOne({ userId });

    if (!wishlist) {
      wishlist = new wishlistModel({
        userId,
        products: [productId],
      });
    } else {
      const alreadyExists = wishlist.products.some(
        (id) => id.toString() === productId
      );
      if (!alreadyExists) {
        wishlist.products.push(productId);
      }
    }

    wishlist.updatedAt = new Date();
    const result = await wishlist.save();
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi khi thêm vào wishlist");
  }
}






async function getWishlist(userId) {
  try {
    const wishlist = await wishlistModel
      .findOne({ userId })
      .populate("products", "name image price");

    return wishlist;
  } catch (error) {
    console.error(error);
    throw new Error("Lỗi khi lấy danh sách yêu thích");
  }
}

const Wishlist = require("../models/wishlist.model");

async function removeFromWishlist({ userId, productId }) {
  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      throw new Error("Không tìm thấy wishlist cho user này.");
    }

    const beforeCount = wishlist.products.length;

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId.toString()
    );

    if (wishlist.products.length === beforeCount) {
      throw new Error("Sản phẩm không tồn tại trong wishlist.");
    }

    wishlist.updatedAt = new Date();
    const result = await wishlist.save();

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi khi xóa sản phẩm khỏi wishlist");
  }
}
module.exports = { addToWishlist, getWishlist, removeFromWishlist };
