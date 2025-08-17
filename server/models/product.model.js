//kết nối collection products
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

//Import model category
const categoryModel = require("./category.model.js");
const brandModel = require("./brand.model.js");

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }], 
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  new: { type: Boolean, default: false },
  view: { type: Number, default: 0 },
  hot: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  processor: [{ type: String }],
  ram: [{ type: String }],
  storage: [{ type: String }],
  display: { type: String },
  graphics: { type: String },
  color:[{type: String}],
  originalprice: {type:String},
  features: [{ type: String }],

  category: {
    categoryId: { type: ObjectId },
    categoryName: { type: String },
  },
  brand: {
    brandId: { type: ObjectId },
    brandName: { type: String },
  },
  status: {type: Boolean, default: "true"}
}
)
module.exports =
  mongoose.models.Product || mongoose.model("product", productSchema);
