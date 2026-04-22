import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/posts', {
        title,
        content
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Post created successfully!');
        setTitle('');
        setContent('');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <div className="content-header">
        <h1>Create New Post</h1>
        <p>Share your latest beats and visuals with the community.</p>
      </div>
      
      <div className="form-section">
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder="Enter post title"
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              required 
              placeholder="What's on your mind?"
            ></textarea>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
      
      <footer className="footer">
        <p>© 2026 BeatHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CreatePost;

