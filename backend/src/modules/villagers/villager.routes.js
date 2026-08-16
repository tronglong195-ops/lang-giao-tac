const express = require('express');
const router = express.Router();
const villagerController = require('./villager.controller');
const { authGuard, optionalAuthGuard } = require('../../middlewares/authGuard');

router.get('/', (req, res) => villagerController.getVillagers(req, res));
router.get('/stats', (req, res) => villagerController.getStats(req, res));

router.post('/', optionalAuthGuard, (req, res) => villagerController.createVillager(req, res));
router.put('/:id', authGuard, (req, res) => villagerController.updateVillager(req, res));
router.delete('/:id', authGuard, (req, res) => villagerController.deleteVillager(req, res));

module.exports = router;
