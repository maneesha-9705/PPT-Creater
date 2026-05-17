const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getHint, validate } = require('../controllers/aiController');

router.post('/hint', protect, getHint);
router.post('/validate', protect, validate);

module.exports = router;
