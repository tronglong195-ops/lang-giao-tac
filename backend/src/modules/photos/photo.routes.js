const express = require('express');
const router = express.Router();
const photoController = require('./photo.controller');
const { authGuard } = require('../../middlewares/authGuard');

router.get('/featured', (req, res) => photoController.getFeaturedPhotos(req, res));
router.get('/my/photos', authGuard, (req, res) => photoController.getMyPhotos(req, res));

router.post('/', authGuard, (req, res) => photoController.addPhoto(req, res));
router.post('/batch', authGuard, (req, res) => photoController.addPhotosBatch(req, res));
router.put('/:id', authGuard, (req, res) => photoController.updatePhoto(req, res));
router.delete('/:id', authGuard, (req, res) => photoController.deletePhoto(req, res));

module.exports = router;
