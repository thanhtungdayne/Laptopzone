const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const wishlistSchema = new Schema({
  userId: { type: ObjectId, ref: "user", required: true, unique: true },
  products: [{ type: ObjectId, ref: "product" }],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.wishlist || mongoose.model("wishlist", wishlistSchema);
