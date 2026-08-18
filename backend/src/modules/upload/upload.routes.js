const express = require('express');
const router = express.Router();
const uploadController = require('./upload.controller');
const { authGuard } = require('../../middlewares/authGuard');

router.post('/image', authGuard, uploadController.uploadSingleImage);
router.post('/images-batch', authGuard, uploadController.uploadBatchImages);

module.exports = router;
