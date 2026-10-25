const express = require('express');
const router = express.Router();
const {
  shortenUrl,
  redirectUrl,
  getUrlStats,
} = require('../controllers/urlController');

router.post('/shorten', shortenUrl);
router.get('/:shortId', redirectUrl);
router.get('/stats/:shortId', getUrlStats);

module.exports = router;