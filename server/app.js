var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();
var cors = require("cors");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.urlencoded({ extended: true }));

// TẢI BIẾN MÔI TRƯỜNG TỪ mongo.env
require("dotenv").config({ path: "mongo.env" });

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// KẾT NỐI ĐẾN MONGODB ATLAS
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Kết nối thành công tới MongoDB Atlas"))
  .catch((err) => console.log("Lỗi kết nối:", err));
// Khi tạo token
const token = jwt.sign(
  { userId: "12345" },                // payload
  process.env.JWT_SECRET,             // secret key từ .env
  { expiresIn: "1h" }                 // thời gian hết hạn
);
jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  if (err) {
    console.log("Token không hợp lệ:", err.message);
  } else {
    console.log("Giải mã token:", decoded);
  }
});

console.log("Token:", token);

var indexRouter = require("./routers/index");
var usersRouter = require("./routers/users.routers.js");
var brandRouter = require("./routers/brand.routers.js");
var productRouter = require("./routers/products.routers.js");
var categoryRouter = require("./routers/category.routers.js");
var attributeRouter = require("./routers/attribute.routers.js");
var productAttributeRouter = require("./routers/productAttribute.routers.js");
var productVariantRouter = require("./routers/productVariant.routers.js");
var cartRouter = require("./routers/cart.routers.js");
var orderRouter = require("./routers/order.routers.js");
var wishlistRouter = require("./routers/wishlist.routers.js");
var uploadRoute = require("./routers/upload.route.js");
var zaloRouter = require("./routers/zalo.routers.js");
var locationRouter = require("./routers/location.routers.js");
//định nghĩa route
//http://localhost:3000/
app.use("/", indexRouter);
//http://localhost:3000/users
app.use("/users", usersRouter);
//http://localhost:3000/category
app.use("/category", categoryRouter);
//http://localhost:3000/product
app.use("/product", productRouter);
//
app.use("/brand", brandRouter);
//http://localhost:3000/attribute
app.use("/attribute", attributeRouter);
//http://localhost:3000/attribute/product-attributes
app.use("/product-attribute", productAttributeRouter);
//http://localhost:3000/product-variant
app.use("/product-variant", productVariantRouter);
//http://localhost:3000/cart
app.use("/cart", cartRouter);
//http://localhost:3000/order
app.use("/order", orderRouter);
// http://localhost:3000/wishlist
app.use("/wishlist", wishlistRouter);

app.use("/upload", uploadRoute);

app.use("/payment/zalo", zaloRouter);

app.use("/location", locationRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
