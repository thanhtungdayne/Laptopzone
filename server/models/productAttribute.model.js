const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const productModel = require('./product.model'); 
const attributeModel = require('./attribute.model'); 
const productAttributeSchema = new Schema(
  {
    name: { type: String, required: true },
    product: 
    {
    productId:{type: ObjectId,required:true},
    productName:{type:String,required:true}
    },
    attribute:     {
      attributeId: { type: ObjectId, required: true },
      attributeName: { type: String, required: true },
      value: { type: String, required: true }, // Giá trị của thuộc tính sản phẩm
    },
    price : { type: Number, required: true }, 
    quantity: { type: Number, required: true }, 
  },
  { timestamps: true } 
);
module.exports = mongoose.models.ProductAttribute ||
  mongoose.model('productAttribute', productAttributeSchema);