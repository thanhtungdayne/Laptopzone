const express = require("express");
const { getProvinces, getDistricts, getWards } = require("../controllers/location.controller");

const router = express.Router();

router.get("/provinces", getProvinces);
router.get("/districts/:provinceId", getDistricts);
router.get("/wards/:districtId", getWards);

module.exports = router;
