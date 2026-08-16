const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('./auth.controller');
const { authGuard } = require('../../middlewares/authGuard');

// Giới hạn 10 requests / 15 phút theo IP cho các endpoint xác thực
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Bạn đã thực hiện quá nhiều yêu cầu xác thực. Vui lòng thử lại sau 15 phút.',
  },
});

router.post('/register', authLimiter, (req, res) => authController.register(req, res));
router.post('/login', authLimiter, (req, res) => authController.login(req, res));
router.post('/google', authLimiter, (req, res) => authController.googleAuth(req, res));
router.post('/facebook', authLimiter, (req, res) => authController.facebookAuth(req, res));
router.post('/refresh-token', (req, res) => authController.refreshToken(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

// Protected routes
router.get('/me', authGuard, (req, res) => authController.getMe(req, res));
router.put('/profile', authGuard, (req, res) => authController.updateProfile(req, res));
router.put('/change-password', authGuard, (req, res) => authController.changePassword(req, res));

module.exports = router;
