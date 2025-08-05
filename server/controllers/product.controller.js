//Thực hiện thao tác CRUD với collection products
const productModel = require("../models/product.model.js");
const categoryModel = require("../models/category.model.js");
const brandModel = require("../models/brand.model.js");
const mongoose = require("mongoose");
// import { v2 as cloudinary } from 'cloudinary';

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
  toggleStatus,
  getPro,
  getProductsByBrand,
};

//Lấy tất cả sản phẩm
async function getAllPro() {
  try {
    // Chỉ lấy sản phẩm có status = true
    const result = await productModel.find({ status: true });
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}

// lấy tất cả sản phẩm k dk
async function getPro() {
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
    // Tìm sản phẩm theo ID và status = true
    const product = await productModel.findOne({ _id: id, status: true });
    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    // Tăng lượt xem
    product.view = (product.view || 0) + 1;
    await product.save();

    return product;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy dữ liệu");
  }
}
// thêm dữ liệu
async function addProduct(data) {
  try {
    // Lấy categoryId và brandId trực tiếp từ data
    let categoryId = data.categoryId;
    let brandId = data.brandId;
    let features = data.features;
    let images = data.images;
    let processor = data.processor;
    let graphics = data.graphics;
    let color = data.color;

    // Kiểm tra ObjectId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error("categoryId không hợp lệ");
    }
    if (!mongoose.Types.ObjectId.isValid(brandId)) {
      throw new Error("brandId không hợp lệ");
    }

    // Parse nếu cần
    if (typeof processor === "string") {
      try {
        processor = JSON.parse(processor);
      } catch (e) {
        throw new Error("processor không đúng định dạng JSON");
      }
    }
    if (typeof graphics === "string") {
      try {
        graphics = JSON.parse(graphics);
      } catch (e) {
        throw new Error("graphics không đúng định dạng JSON");
      }
    }
    if (typeof color === "string") {
      try {
        color = JSON.parse(color);
      } catch (e) {
        throw new Error("color không đúng định dạng JSON");
      }
    }
    if (typeof features === "string") {
      try {
        features = JSON.parse(features);
      } catch (e) {
        throw new Error("features không đúng định dạng JSON");
      }
    }
    if (typeof images === "string") {
      try {
        images = JSON.parse(images);
      } catch (e) {
        throw new Error("images không đúng định dạng JSON");
      }
    }

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
      status,
    } = data;

    // Kiểm tra category & brand có tồn tại không
    const categoryFind = await categoryModel.findById(categoryId);
    if (!categoryFind) throw new Error("Không tìm thấy loại sản phẩm");

    const brandFind = await brandModel.findById(brandId);
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
      images: Array.isArray(images) ? images : [],
      price,
      originalprice,
      stock,
      new: isNewBoolean,
      view: Number(view) || 0,
      hot: isHotBoolean,
      inStock: isInStockBoolean,
      rating: Number(rating) || 0,
      processor: Array.isArray(processor) ? processor : [],
      ram,
      storage,
      display,
      graphics: Array.isArray(graphics) ? graphics : [],
      features: Array.isArray(features) ? features : [],
      color: Array.isArray(color) ? color : [],
      category: {
        categoryId: categoryFind._id,
        categoryName: categoryFind.name,
      },
      brand: {
        brandId: brandFind._id,
        brandName: brandFind.name,
      },
      status: status !== undefined ? Boolean(status) : true,
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
      images,
      price,
      originalprice,
      stock,
      category,
      brand,
     
      storage,
      display,
      processor,
      graphics,
      color,
      attributes,
    } = data;

    // Xử lý cập nhật category
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

    // Xử lý cập nhật mảng
    const updatedProcessor = Array.isArray(processor) ? processor : pro.processor || [];
    const updatedGraphics = Array.isArray(graphics) ? graphics : pro.graphics || [];
    const updatedColor = Array.isArray(color) ? color : pro.color || [];
    const updatedImages = Array.isArray(images) ? images : pro.images || [];

    const result = await productModel.findByIdAndUpdate(
      id,
      {
        name: name || pro.name,
        description: description || pro.description,
        image: image || pro.image,
        images: updatedImages,
        price: Number(price) || pro.price,
        originalprice: Number(originalprice) || pro.originalprice,
        stock: Number(stock) || pro.stock,
        category: categoryObj,
        brand: brandObj,
        storage: storage || pro.storage,
        display: display || pro.display,
        processor: updatedProcessor,
        graphics: updatedGraphics,
        color: updatedColor,
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
    console.error("Lỗi cập nhật sản phẩm:", error);
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
//lấy sản phẩm theo brand
async function getProductsByBrand(brandId) {
  try {
    const products = await productModel.find({
      "brand.brandId": brandId,
    });
    return products;
  } catch (error) {
    console.log(error);
    throw new Error("Lỗi lấy sản phẩm theo thương hiệu");
  }
}
// Đảo ngược trạng thái sản phẩm
async function toggleStatus(productId) {
  const product = await productModel.findById(productId);
  if (!product) throw new Error("Không tìm thấy sản phẩm");

  product.status = !product.status; // Đảo ngược trạng thái
  await product.save();

  return product;
}
