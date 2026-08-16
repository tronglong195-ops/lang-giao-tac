const express = require('express');
const router = express.Router();
const newsController = require('./news.controller');
const { authGuard } = require('../../middlewares/authGuard');
const { roleGuard } = require('../../middlewares/roleGuard');

router.get('/', (req, res) => newsController.getNews(req, res));
router.get('/:slug', (req, res) => newsController.getNewsBySlug(req, res));

// Admin & Moderator routes
router.post('/', authGuard, roleGuard(['admin', 'moderator']), (req, res) =>
  newsController.createNews(req, res)
);
router.put('/:id', authGuard, roleGuard(['admin', 'moderator']), (req, res) =>
  newsController.updateNews(req, res)
);
router.delete('/:id', authGuard, roleGuard(['admin', 'moderator']), (req, res) =>
  newsController.deleteNews(req, res)
);

module.exports = router;
