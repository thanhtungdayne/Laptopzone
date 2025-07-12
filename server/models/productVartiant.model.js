const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId

const attributeModel = require("./attribute.model.js");
const productModel = require("./product.model.js");

const productVariantSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'product', required: true },
  variants: [
    
    {
      attributes: [
        {
          attributeId: { type: Schema.Types.ObjectId },
          attributeName: { type: String },
          value: { type: String }
        }
      ],
      price: { type: Number, required: true },
      originalprice: {type: Number, required: true},
      sku: { type: String, required: true },
      stock: { type: Number, required: true }
    }
  ]
});
module.exports = mongoose.models.productVariant ||
  mongoose.model('productVariant', productVariantSchema);
