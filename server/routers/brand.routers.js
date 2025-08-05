var express = require('express');
var router = express.Router();
const brandController = require('../controllers/brand.controller.js');



// Get all brands
router.get('/', async (req, res) => {
    try {
        const result = await brandController.getAllBrands();
        return res.status(200).json({ status: true, result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: 'Error fetching data' });
    }
});
// get brand
router.get('/getbrand', async (req, res) => {
    try {
        const result = await brandController.getBrands();
        return res.status(200).json({ status: true, result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: 'Error fetching data' });
    }
});
// Get brand details by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await brandController.getBrandDetails(id);
        return res.status(200).json({ status: true, result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: 'Error fetching data' });
    }
});
// http://localhost:3000/brand/addbrand
router.post("/addbrand", async (req, res) => {
  try {
    const data = req.body;
    const newBrand = await brandController.addBrand(data);
    return res.status(200).json({ status: true, newBrand });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Lỗi thêm dữ liệu" });
  }
});
// Update an existing brand
router.put('/updatebrand/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await brandController.updateBrand(id, data);
        return res.status(200).json({ status: true, result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: 'Error updating data' });
    }
});
// Delete a brand
router.delete('/deletebrand/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await brandController.deleteBrand(id);
        return res.status(200).json({ status: true, result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: 'Error deleting data' });
    }
});
// Toggle brand status
router.put('/toggle-status/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await brandController.toggleStatus(id);
        return res.status(200).json({ status: true, result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: 'Error toggling status' });
    }
});
module.exports = router;