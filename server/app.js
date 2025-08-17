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
  // Middleware debug để xem API nào bị spam
  app.use((req, res, next) => {
    // Chỉ log các route API, bỏ qua file tĩnh như CSS, JS, ảnh
    if (!req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico)$/)) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    }
    next();
  });
  const rateLimit = require("express-rate-limit");

  const apiLimiter = rateLimit({
    windowMs: 1000, // 1 giây
    max: 5, // tối đa 5 request/giây cho mỗi IP
    message: { error: "Too many requests, please slow down." }
  });

  app.use(express.urlencoded({ extended: true }));

  // TẢI BIẾN MÔI TRƯỜNG TỪ mongo.env
  require("dotenv").config({ path: "mongo.env" });

  const mongoose = require("mongoose");

  // KẾT NỐI ĐẾN MONGODB ATLAS
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Kết nối thành công tới MongoDB Atlas"))
    .catch((err) => console.log("Lỗi kết nối:", err));


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
  app.use('/users', (req, res, next) => {
    console.log('Trước khi vào usersRouter - req.params:', req.params);
    next();
  }, usersRouter);
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
  app.use("/cart", cartRouter );
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
