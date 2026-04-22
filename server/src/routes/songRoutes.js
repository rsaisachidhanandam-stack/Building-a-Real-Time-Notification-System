const express = require('express');
const router = express.Router();
const { getAllSongs } = require('../controllers/songController');
const authenticate = require('../middlewares/authenticate');

// GET /api/songs?page=1&limit=5
router.get('/', authenticate, getAllSongs);

module.exports = router;
