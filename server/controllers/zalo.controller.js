// backend: payment.js
const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');
const config = require('../config/zalopayConfig');

const createPayment = async (req, res) => {
  try {
    const { userId, items, amount } = req.body; // Lấy dữ liệu từ frontend
    if (!userId || !items || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const embed_data = {
      redirecturl: 'https://your-website.com/payment-success', // Thay bằng URL của bạn
    };

    const transID = Math.floor(Math.random() * 1000000);
    const appTime = Date.now();

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: userId, // Sử dụng userId từ frontend
      app_time: appTime,
      item: JSON.stringify(items), // Dữ liệu items từ giỏ hàng
      embed_data: JSON.stringify(embed_data),
      amount: Math.round(amount), // Đảm bảo amount là số nguyên
      callback_url: 'https://your-domain.com/api/callback', // Thay bằng URL callback
      description: `YourApp - Payment for order #${transID}`,
      bank_code: '', // Để trống nếu không cần
    };

    // Tạo chuỗi data để tính mac
    const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    console.log('Data for mac:', data);
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    console.log('Generated mac:', order.mac);

    // Gửi request tới ZaloPay
    const result = await axios({
      method: 'post',
      url: config.endpoint,
      params: order,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('ZaloPay response:', result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    console.error('Error creating payment:', error.response?.data || error.message);
    return res.status(500).json({
      error: 'Payment creation failed',
      details: error.response?.data || error.message,
    });
  }
};

const handleCallback = (req, res) => {
  let result = {};
  try {
    const { data, mac: reqMac } = req.body;
    console.log('Callback data:', data); // Log dữ liệu nhận được
    console.log('Callback mac:', reqMac);

    const calculatedMac = CryptoJS.HmacSHA256(data, config.key2).toString();
    console.log('Calculated mac:', calculatedMac);

    if (reqMac !== calculatedMac) {
      result.return_code = -1;
      result.return_message = 'mac not equal';
      console.log('Mac verification failed');
    } else {
      const dataJson = JSON.parse(data);
      console.log('Parsed callback data:', dataJson);
      console.log("Update order's status = success where app_trans_id =", dataJson.app_trans_id);
      result.return_code = 1;
      result.return_message = 'success';
    }
  } catch (ex) {
    console.error('Callback error:', ex.message);
    result.return_code = 0;
    result.return_message = ex.message;
  }

  return res.json(result);
};

const checkStatusOrder = async (req, res) => {
  try {
    const { app_trans_id } = req.body;
    if (!app_trans_id) {
      return res.status(400).json({ error: 'app_trans_id is required' });
    }

    const postData = {
      app_id: config.app_id,
      app_trans_id,
    };

    // Tạo chuỗi data để tính mac
    const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
    console.log('Data for mac (status):', data); // Log để kiểm tra
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    console.log('Generated mac (status):', postData.mac);

    const postConfig = {
      method: 'post',
      url: config.query_endpoint,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify(postData), // Chuyển thành x-www-form-urlencoded
    };

    const result = await axios(postConfig);
    console.log('Status check result:', result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    console.error('Error checking status:', error.response?.data || error.message);
    return res.status(500).json({
      error: 'Status check failed',
      details: error.response?.data || error.message,
    });
  }
};

module.exports = {
  createPayment,
  handleCallback,
  checkStatusOrder,
};