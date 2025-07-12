// routes/wishlist.route.js
var express = require("express");
var router = express.Router();
const wishlistController = require("../controllers/wishlist.controllers.js");
//https:local:3000/wishlist/add
router.post("/add", async (req, res) => {
  try {
    const result = await wishlistController.addToWishlist(req.body);
    res.status(200).json({ message: "Đã thêm vào wishlist", data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// https:local:3000/wishlist/:userId
router.get("/:userId", async (req, res) => {
  try {
    const result = await wishlistController.getWishlist(req.params.userId);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/remove", async (req, res) => {
  try {
    const result = await wishlistController.removeFromWishlist(req.body);
    res.status(200).json({ message: "Đã xóa khỏi wishlist", data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
