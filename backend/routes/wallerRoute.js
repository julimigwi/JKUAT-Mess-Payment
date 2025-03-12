const express = require('express');
const { getWalletBalance } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', protect, getWalletBalance);

module.exports = router;
