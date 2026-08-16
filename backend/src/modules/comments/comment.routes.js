const express = require('express');
const router = express.Router();
const commentController = require('./comment.controller');
const { authGuard } = require('../../middlewares/authGuard');

router.post('/', authGuard, (req, res) => commentController.createComment(req, res));
router.delete('/:id', authGuard, (req, res) => commentController.deleteComment(req, res));

module.exports = router;
