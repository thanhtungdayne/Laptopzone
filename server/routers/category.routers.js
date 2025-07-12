var express = require('express');
var router = express.Router();
const categoryController = require('../controllers/category.controller.js');

//http://localhost:3000/category
router.get('/', async (req,res)=>{
    try{
        const result = await categoryController.getAllCate()
        return res.status(200).json({status:true,result})
    }catch(error){
        console.log(error);
        return res.status(500).json({stratus:false,message:'Lỗi lấy dữ liệu'});
        
    }
})

//thêm danh mục
//http://localhost:3000/category/addcate
//thêm danh mục
//http://localhost:3000/category/addcate
router.post('/addcate', async (req, res) => {
  try {
    console.log('Dữ liệu nhận được:', req.body); // Kiểm tra dữ liệu nhận được
    const newCate = await categoryController.addCate(req.body);
    return res.status(200).json({ status: true, newCate });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Lỗi thêm dữ liệu' });
  }
});
//Lấy chi tiết danh mục
//http://localhost:3000/category/.....
router.get('/:id',async(req,res)=>{
    try{
        const{id}=req.params
        const result = await categoryController.getDetailCate(id)
        return res.status(200).json({status:true,result})
    }catch(error){
        console.log(error);
        return res.status(500).json({stratus:false,message:'Lỗi lấy dữ liệu'});
        
    }
})
//Cập nhật danh mục
router.put('/updatecate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await categoryController.updateCate(id, data);
    return res.status(200).json({ status: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Lỗi cập nhật dữ liệu' });
  }
});
//Xóa danh mục
router.delete('/deletecate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryController.deleteCate(id);
    return res.status(200).json({ status: true, message: 'Xóa danh mục thành công' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Lỗi xóa danh mục' });
  }
});

module.exports = router;