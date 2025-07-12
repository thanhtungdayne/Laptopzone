const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  items: [
    {
      variantId: {
        type: ObjectId,
        ref: "productVariant",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, // giá tại thời điểm thêm

      // 👇 Snapshot thêm vào:
      productName: { type: String, required: true },
      productImage: { type: String, required: true },
      attributes: [{ name: String, value: String }], // VD: [{name: "RAM", value: "16GB"}]
    },
  ],
  cartTotal: { type: Number, default: 0 },
  
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.cart || mongoose.model("cart", cartSchema);
