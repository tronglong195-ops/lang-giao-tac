const express = require('express');
const router = express.Router();
const eventController = require('./event.controller');
const { authGuard } = require('../../middlewares/authGuard');
const { roleGuard } = require('../../middlewares/roleGuard');

router.get('/', (req, res) => eventController.getEvents(req, res));
router.get('/:id', (req, res) => eventController.getEventById(req, res));

// Admin & Moderator routes
router.post('/', authGuard, roleGuard(['admin', 'moderator']), (req, res) =>
  eventController.createEvent(req, res)
);
router.put('/:id', authGuard, roleGuard(['admin', 'moderator']), (req, res) =>
  eventController.updateEvent(req, res)
);
router.delete('/:id', authGuard, roleGuard(['admin', 'moderator']), (req, res) =>
  eventController.deleteEvent(req, res)
);

module.exports = router;
