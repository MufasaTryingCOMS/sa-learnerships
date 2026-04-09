const express = require('express');
const controller = require('./controller');
const router = express.Router();
router.post('/register', controller.register);
router.post('/registerGoogle', controller.registerGoogle);

module.exports = router;