const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const orderSchema = new Schema({
  userId: { type: ObjectId, ref: "user", required: true },

  items: [
    {
      productVariantId: { type: ObjectId, ref: "productVariant", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },

      
      productName: { type: String, required: true },
      productImage: { type: String, required: true },
      attributes: [{ name: String, value: String }]
    }
  ],

  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "shipping", "delivered", "cancelled", "returned"],
    default: "pending"
  },

  paymentMethod: {
    type: String,
    enum: ["cash", "momo" , "zalopay"],
    default: "cash"
  },
  orderCode: { type: String, unique: true, required: true },

  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },

  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});
 module.exports = mongoose.models.order ||
 mongoose.model('order',orderSchema)