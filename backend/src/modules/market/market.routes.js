const express = require('express');
const router = express.Router();
const marketController = require('./market.controller');
const { authGuard } = require('../../middlewares/authGuard');
const { roleGuard } = require('../../middlewares/roleGuard');

// Public
router.get('/', marketController.getAllProducts);
router.get('/:id', marketController.getProductDetail);

// Protected (Admin / Member đăng bài bán nông sản)
router.post('/', authGuard, marketController.createProduct);
router.delete('/:id', authGuard, roleGuard(['admin', 'moderator']), marketController.deleteProduct);

module.exports = router;
