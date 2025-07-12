//Thực hiện thao tác CRUD với collection products
const productModel = require("../models/product.model.js");
const categoryModel = require("../models/category.model.js");
const brandModel = require("../models/brand.model.js");

module.exports = {
  getAllPro,
  getDetailPro,
  addProduct,
  updateProduct,
  deleteProduct,
  newProduct,
  hotProduct,
  mostviewProduct,
  getProductsByCategory,
};

//Lấy tất cả sản phẩm
async function getAllPro() {
  try {
    // Lấy tất cả sản phẩm từ database
    const result = await productModel.find();
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}

//lấy chi tiết sản phẩm
async function getDetailPro(id) {
  try {
    // Tìm sản phẩm theo ID
    const product = await productModel.findById(id);
    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
      return null;
    }

    // Tăng lượt xem lên 1
    product.view = (product.view || 0) + 1;
    await product.save(); // Lưu lại vào DB

    return product;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
    return null;
  }
}
async function addProduct(data) {
  try {
    // Parse category và brand nếu là string (từ form-data)
    let category = data.category;
    let brand = data.brand;
    let features = data.features;
    let images = data.images;
    let processor = data.processor;
    let graphics = data.graphics;
    let color = data.color;

    if (typeof processor === "string") processor = JSON.parse(processor);
    if (typeof graphics === "string") graphics = JSON.parse(graphics);
    if (typeof color === "string") color = JSON.parse(color);

    if (typeof category === "string") category = JSON.parse(category);
    if (typeof brand === "string") brand = JSON.parse(brand);
    if (typeof features === "string") features = JSON.parse(features); // chuỗi dạng '["a", "b"]'
    if (typeof images === "string") images = JSON.parse(images); // nếu gửi qua form-data

    const {
      name,
      description,
      image,
      price,
      stock,
      new: isNew,
      hot: isHot,
      view,
      inStock,
      rating,
      originalprice,
      ram,
      storage,
      display,
    } = data;

    // Kiểm tra category & brand có tồn tại không
    const categoryFind = await categoryModel.findById(category.categoryId);
    if (!categoryFind) throw new Error("Không tìm thấy loại sản phẩm");

    const brandFind = await brandModel.findById(brand.brandId);
    if (!brandFind) throw new Error("Không tìm thấy thương hiệu");

    // Chuyển đổi Boolean nếu cần
    const isNewBoolean = isNew && isNew.toString().toLowerCase() !== "false";
    const isHotBoolean = isHot && isHot.toString().toLowerCase() !== "false";
    const isInStockBoolean =
      inStock == null ? true : inStock.toString().toLowerCase() !== "false";

    const newPro = new productModel({
      name,
      description,
      image,
      images: Array.isArray(images) ? images : [], // Mảng ảnh phụ
      price,
      originalprice,
      stock,
      new: isNewBoolean,
      view: Number(view) || 0,
      hot: isHotBoolean,
      inStock: isInStockBoolean,
      rating: Number(rating) || 0,
      processor,
      ram,
      storage,
      display,
      graphics,
      features: Array.isArray(features) ? features : [],
      processor: Array.isArray(processor) ? processor : [],
      graphics: Array.isArray(graphics) ? graphics : [],
      color: Array.isArray(color) ? color : [],
      category: {
        categoryId: categoryFind._id,
        categoryName: categoryFind.name,
      },
      brand: {
        brandId: brandFind._id,
        brandName: brandFind.name,
      },
    });

    const result = await newPro.save();
    return result;
  } catch (error) {
    console.error("Lỗi thêm dữ liệu:", error);
    throw new Error("Lỗi thêm dữ liệu");
  }
}
// cập nhật dữ liệu
async function updateProduct(data, id) {
  try {
    const isNewBoolean = data.new === "true" || data.new === true;
    const isHotBoolean = data.hot === "true" || data.hot === true;
    const viewNumber = Number(data.view) || 0;

    const pro = await productModel.findById(id);
    if (!pro) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    const {
      name,
      description,
      image,
      price,
      stock,
      category,
      brand,
      attributes,
    } = data;

    let categoryObj = pro.category;
    if (category?.categoryId) {
      const categoryFind = await categoryModel.findById(category.categoryId);
      if (categoryFind) {
        categoryObj = {
          categoryId: categoryFind._id,
          categoryName: categoryFind.name,
        };
      }
    }

    // Xử lý cập nhật brand
    let brandObj = pro.brand;
    if (brand?.brandId) {
      const brandFind = await brandModel.findById(brand.brandId);
      if (brandFind) {
        brandObj = {
          brandId: brandFind._id,
          brandName: brandFind.name,
        };
      }
    }

    const result = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        image,
        price,
        stock,
        category: categoryObj,
        brand: brandObj,
        new: isNewBoolean,
        hot: isHotBoolean,
        view: viewNumber,
      },
      { new: true }
    );

    if (!result) {
      throw new Error("Cập nhật thất bại!");
    }

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi cập nhật dữ liệu");
  }
}

//xóa dữ liệu
async function deleteProduct(id) {
  try {
    const result = await productModel.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi xóa dữ liệu");
  }
}
//Lấy sản phẩm mới
async function newProduct() {
  try {
    const result = await productModel.find({ new: true }).limit(10);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}
//Lấy sản phẩm hot
async function hotProduct() {
  try {
    const result = await productModel.find({ hot: true }).limit(10);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}
//Lấy sản phẩn xem nhiều
async function mostviewProduct() {
  try {
    const result = await productModel.find().sort({ view: -1 }).limit(10);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}
//Lấy sản phẩm theo category
async function getProductsByCategory(categoryId) {
  try {
    const products = await productModel.find({
      "category.categoryId": categoryId,
    });
    return products;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy sản phẩm theo danh mục");
  }
}
