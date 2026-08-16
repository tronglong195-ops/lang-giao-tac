const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controller');
const { authGuard } = require('../../middlewares/authGuard');

router.use(authGuard);

router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/mark-all-read', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
