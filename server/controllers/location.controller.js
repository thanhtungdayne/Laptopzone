const axios = require("axios");

// Lấy danh sách tỉnh
async function getProvinces(req, res) {
  try {
    const { data } = await axios.get("https://esgoo.net/api-tinhthanh/1/0.htm");
    res.status(200).json(data.data);
  } catch (error) {
    console.error("Lỗi lấy danh sách tỉnh:", error.message);
    res.status(500).json({ message: "Không lấy được danh sách tỉnh" });
  }
}

// Lấy danh sách huyện theo tỉnh
async function getDistricts(req, res) {
  try {
    const { provinceId } = req.params;
    const { data } = await axios.get(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
    res.status(200).json(data.data);
  } catch (error) {
    console.error("Lỗi lấy danh sách huyện:", error.message);
    res.status(500).json({ message: "Không lấy được danh sách huyện" });
  }
}

// Lấy danh sách xã theo huyện
async function getWards(req, res) {
  try {
    const { districtId } = req.params;
    const { data } = await axios.get(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
    res.status(200).json(data.data);
  } catch (error) {
    console.error("Lỗi lấy danh sách xã:", error.message);
    res.status(500).json({ message: "Không lấy được danh sách xã" });
  }
}

module.exports = { getProvinces, getDistricts, getWards };
