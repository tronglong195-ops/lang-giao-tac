const express = require('express');
const router = express.Router();
const fundController = require('./fund.controller');
const { authGuard } = require('../../middlewares/authGuard');
const { roleGuard } = require('../../middlewares/roleGuard');

// Public routes
router.use('/webhook', require('./webhook/webhook.routes'));
router.get('/', fundController.getAllCampaigns);
router.get('/vietqr', fundController.getVietQR);
router.get('/:slug', fundController.getCampaignDetail);
router.post('/donate', fundController.donate);

// Protected routes (Admin / Moderator)
router.post('/', authGuard, roleGuard(['admin', 'moderator']), fundController.createCampaign);
router.patch('/donations/:id/verify', authGuard, roleGuard(['admin', 'moderator']), fundController.verifyDonation);

module.exports = router;
