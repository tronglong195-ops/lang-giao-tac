const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { authGuard } = require('../../middlewares/authGuard');

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/google', (req, res) => authController.googleAuth(req, res));
router.post('/facebook', (req, res) => authController.facebookAuth(req, res));
router.post('/refresh-token', (req, res) => authController.refreshToken(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

// Protected routes
router.get('/me', authGuard, (req, res) => authController.getMe(req, res));
router.put('/profile', authGuard, (req, res) => authController.updateProfile(req, res));
router.put('/change-password', authGuard, (req, res) => authController.changePassword(req, res));

module.exports = router;
