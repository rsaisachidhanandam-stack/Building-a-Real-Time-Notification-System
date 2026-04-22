const Song = require('../models/Song');

// @route   GET /api/songs
// @access  Public (or protected)
const getAllSongs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const songs = await Song.find().skip(skip).limit(limit);
    const total = await Song.countDocuments();

    res.status(200).json({
      success: true,
      count: songs.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: songs
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  getAllSongs
};
