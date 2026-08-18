const express = require('express');
const router = express.Router();
const genealogyController = require('./genealogy.controller');
const { authGuard } = require('../../middlewares/authGuard');
const { roleGuard } = require('../../middlewares/roleGuard');

// Public routes
router.get('/', genealogyController.getAllClans);
router.get('/:slug', genealogyController.getClanDetail);

// Protected routes (Admin / Moderator)
router.post('/:clanId/members', authGuard, roleGuard(['admin', 'moderator']), genealogyController.addMember);
router.put('/members/:id', authGuard, roleGuard(['admin', 'moderator']), genealogyController.updateMember);
router.delete('/members/:id', authGuard, roleGuard(['admin', 'moderator']), genealogyController.deleteMember);
router.put('/:id', authGuard, roleGuard(['admin', 'moderator']), genealogyController.updateClanInfo);

module.exports = router;
