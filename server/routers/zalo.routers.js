const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/zalo.controller');

router.post('/payment', paymentController.createPayment);
router.post('/callback', paymentController.handleCallback);
router.post('/check-status-order', paymentController.checkStatusOrder);

module.exports = router;