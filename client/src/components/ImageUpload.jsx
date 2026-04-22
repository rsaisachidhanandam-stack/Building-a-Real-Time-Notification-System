import React, { useState, useEffect } from 'react';

const ImageUpload = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please select an image file (jpeg, png, webp, gif)';
    }

    if (file.size > maxSize) {
      return `File is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Max size is 5MB`;
    }

    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      
      // Revoke old URL if it exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      return;
    }

    // Clean up previous URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    if (onUpload) {
      onUpload(formData);
    }
  };

  return (
    <div className="upload-container">
      <form onSubmit={handleSubmit} className="upload-form">
        <label className="file-input-wrapper">
          <span className="file-input-label">
            {selectedFile ? 'Change Image' : 'Choose an Image'}
          </span>
          <input 
            id="file-input"
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="hidden-input"
          />
        </label>

        {error && <p className="error-message" id="error-message">{error}</p>}

        {previewUrl && (
          <div className="preview-container">
            <p className="preview-title">Preview:</p>
            <div className="preview-card">
              <img 
                src={previewUrl} 
                alt="Selected file preview" 
                className="preview-img"
                id="preview-img"
              />
            </div>
            <p className="file-name">{selectedFile.name}</p>
          </div>
        )}

        <button 
          id="upload-button"
          type="submit" 
          className="submit-button"
          disabled={!selectedFile || !!error}
        >
          Upload Image
        </button>
      </form>
    </div>
  );
};

export default ImageUpload;
