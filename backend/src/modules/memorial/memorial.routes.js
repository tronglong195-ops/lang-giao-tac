const express = require('express');
const router = express.Router();
const memorialController = require('./memorial.controller');
const { authGuard } = require('../../middlewares/authGuard');
const { roleGuard } = require('../../middlewares/roleGuard');

// Public
router.get('/', memorialController.getAllObituaries);
router.get('/:id', memorialController.getObituaryDetail);
router.post('/:id/condolences', memorialController.addCondolence);

// Protected (Admin / Moderator)
router.post('/', authGuard, roleGuard(['admin', 'moderator']), memorialController.createObituary);
router.delete('/:id', authGuard, roleGuard(['admin', 'moderator']), memorialController.deleteObituary);

module.exports = router;
