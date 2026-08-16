const express = require('express');
const router = express.Router();
const heroSlideController = require('./heroSlide.controller');

router.get('/', (req, res) => heroSlideController.getHeroSlides(req, res));

module.exports = router;
