const express = require('express');
const router = express.Router();
const postController = require('./post.controller');
const { authGuard, optionalAuthGuard } = require('../../middlewares/authGuard');

router.get('/', (req, res) => postController.getPosts(req, res));
router.get('/my/posts', authGuard, (req, res) => postController.getMyPosts(req, res));
router.get('/:slug', optionalAuthGuard, (req, res) => postController.getPostBySlug(req, res));

router.post('/', authGuard, (req, res) => postController.createPost(req, res));
router.put('/:id', authGuard, (req, res) => postController.updatePost(req, res));
router.delete('/:id', authGuard, (req, res) => postController.deletePost(req, res));

module.exports = router;
