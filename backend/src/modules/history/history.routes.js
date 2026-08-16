const express = require('express');
const router = express.Router();
const historyController = require('./history.controller');
const { authGuard } = require('../../middlewares/authGuard');
const { roleGuard } = require('../../middlewares/roleGuard');

router.get('/', (req, res) => historyController.getHistoryTimelines(req, res));

// Admin & Moderator routes
router.post('/', authGuard, roleGuard(['admin', 'moderator']), (req, res) =>
  historyController.createTimeline(req, res)
);
router.put('/:id', authGuard, roleGuard(['admin', 'moderator']), (req, res) =>
  historyController.updateTimeline(req, res)
);
router.delete('/:id', authGuard, roleGuard(['admin', 'moderator']), (req, res) =>
  historyController.deleteTimeline(req, res)
);

module.exports = router;
