const express = require('express');
const router = express.Router();

// Import both middlewares
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const Song = require('../models/Song');
const Playlist = require('../models/Playlist');

const topArtistsPipeline = require('../aggregations/top-artists');
const userActivityPipeline = require('../aggregations/user-activity');

// Route 1: PROTECTED - Only 'admin' role can access this (As per Assignment Task 4)
router.get('/top-artists', 
  authenticate, 
  authorize('admin'), 
  async (req, res) => {
  try {
    const results = await Song.aggregate(topArtistsPipeline);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route 2: PROTECTED - Only 'admin' role can access this
router.get('/most-active-users', 
  authenticate,          // 1. Check if logged in
  authorize('admin'),    // 2. Check if Admin
  async (req, res) => {
    try {
      const results = await Playlist.aggregate(userActivityPipeline);
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

module.exports = router;
