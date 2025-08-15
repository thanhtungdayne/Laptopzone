
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
      redirecturl: 'https://your-website.com/payment-success', // Thay bằng URL thực tế
    };

    const transID = Math.floor(Math.random() * 1000000);
    const appTime = Date.now();
    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;

    const order = {
      app_id: config.app_id,
      app_trans_id,
      app_user: userId,
      app_time: appTime,
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: Math.round(amount),
      callback_url: 'https://your-domain.com/api/payment/zalo/callback', // Thay bằng URL callback thực tế
      description: `YourApp - Payment for order #${transID}`,
      bank_code: '',
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
      data: qs.stringify(order), // Chuyển thành x-www-form-urlencoded
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('ZaloPay response:', result.data);
    if (result.data.return_code !== 1) {
      return res.status(400).json({
        error: 'ZaloPay request failed',
        details: result.data.return_message,
      });
    }

    return res.status(200).json({
      order_url: result.data.order_url,
      orderId: result.data.zp_trans_id || result.data.app_trans_id, // Đảm bảo trả về orderId
    });
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
    console.log('Callback data:', data);
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
    const { orderId } = req.params; // Nhận orderId từ params thay vì body
    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    const postData = {
      app_id: config.app_id,
      app_trans_id: orderId,
    };

    // Tạo chuỗi data để tính mac
    const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
    console.log('Data for mac (status):', data);
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    console.log('Generated mac (status):', postData.mac);

    const postConfig = {
      method: 'post',
      url: config.query_endpoint,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify(postData),
    };

    const result = await axios(postConfig);
    console.log('Status check result:', result.data);

    // Xử lý trạng thái từ ZaloPay
    const { return_code } = result.data;
    if (return_code === 1) {
      return res.status(200).json({ status: 'success' });
    } else if (return_code === 2) {
      return res.status(200).json({ status: 'failed', message: result.data.return_message });
    } else {
      return res.status(200).json({ status: 'pending', message: result.data.return_message });
    }
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
