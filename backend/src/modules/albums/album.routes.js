const express = require('express');
const router = express.Router();
const albumController = require('./album.controller');
const { authGuard, optionalAuthGuard } = require('../../middlewares/authGuard');
const { roleGuard } = require('../../middlewares/roleGuard');

router.get('/', (req, res) => albumController.getAlbums(req, res));
router.get('/:id', optionalAuthGuard, (req, res) => albumController.getAlbumById(req, res));

// Admin & Moderator routes
router.post('/', authGuard, roleGuard(['admin', 'moderator']), (req, res) =>
  albumController.createAlbum(req, res)
);
router.put('/:id', authGuard, roleGuard(['admin', 'moderator']), (req, res) =>
  albumController.updateAlbum(req, res)
);
router.delete('/:id', authGuard, roleGuard(['admin', 'moderator']), (req, res) =>
  albumController.deleteAlbum(req, res)
);

module.exports = router;
