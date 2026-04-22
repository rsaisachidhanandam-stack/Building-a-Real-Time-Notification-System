const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authenticate = require('../middlewares/authenticate');

module.exports = (io) => {
  // @route   POST /api/posts
  // @desc    Create a new post and emit socket event
  router.post('/', authenticate, async (req, res) => {
    try {
      const { title, content } = req.body;
      
      const newPost = new Post({
        title,
        content,
        author: req.user.id
      });

      const savedPost = await newPost.save();

      // Emit event to all connected clients
      io.emit('newPost', {
        message: `New post created: ${savedPost.title}`,
        post: savedPost,
        username: req.user.username || req.user.email
      });

      res.status(201).json({
        success: true,
        data: savedPost
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  });

  return router;
};
