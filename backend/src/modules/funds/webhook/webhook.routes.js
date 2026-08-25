const express = require('express');
const router = express.Router();
const webhookController = require('./webhook.controller');

// Endpoint nhận webhook từ Casso / SePay
router.post('/casso', webhookController.handlePaymentWebhook);
router.post('/sepay', webhookController.handlePaymentWebhook);
router.post('/', webhookController.handlePaymentWebhook);

module.exports = router;
