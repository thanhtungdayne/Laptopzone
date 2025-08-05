// routes/upload.route.js
const express = require("express");
const upload = require("../middleware/upload.middleware.js");
const cloudinary = require("../utils/cloudinary.js");

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("req.file:", req.file);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const buffer = req.file.buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${buffer}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "products",
    });

    return res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
});


module.exports = router;
