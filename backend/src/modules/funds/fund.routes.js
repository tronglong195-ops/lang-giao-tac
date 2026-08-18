const express = require('express');
const router = express.Router();
const fundController = require('./fund.controller');
const { authGuard } = require('../../middlewares/authGuard');
const { roleGuard } = require('../../middlewares/roleGuard');

// Public routes
router.get('/', fundController.getAllCampaigns);
router.get('/vietqr', fundController.getVietQR);
router.get('/:slug', fundController.getCampaignDetail);
router.post('/donate', fundController.donate);

// Protected routes (Admin / Moderator)
router.post('/', authGuard, roleGuard(['admin', 'moderator']), fundController.createCampaign);

module.exports = router;
