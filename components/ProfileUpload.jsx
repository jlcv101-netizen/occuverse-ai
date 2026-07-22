import React, { useState } from 'react';
import axios from 'axios';

export default function ProfileUpload({ userEmail, onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    setFile(selectedFile);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select a file'); return; }
    if (!userEmail) { setError('User email is required'); return; }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      formData.append('email', userEmail);
      const response = await axios.post('/api/profile/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (response.data.success) {
        setFile(null);
        setPreview(null);
        onSuccess?.(response.data.profilePicture);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-upload">
      <div className="upload-container">
        <div className="preview-section">
          {preview ? (
            <img src={preview} alt="Preview" className="preview-image" />
          ) : (
            <div className="placeholder">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p>Click to upload profile picture</p>
            </div>
          )}
        </div>
        <form onSubmit={handleUpload}>
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} required className="file-input" />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={!file || loading} className="upload-button">{loading ? 'Uploading...' : 'Upload Profile Picture'}</button>
        </form>
      </div>
      <style jsx>{`
        .profile-upload { padding: 20px; border-radius: 8px; background: #f5f5f5; }
        .upload-container { max-width: 400px; margin: 0 auto; }
        .preview-section { width: 200px; height: 200px; margin: 0 auto 20px; border-radius: 8px; background: white; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px dashed #ddd; overflow: hidden; }
        .preview-image { width: 100%; height: 100%; object-fit: cover; }
        .placeholder { text-align: center; color: #999; }
        .icon { width: 48px; height: 48px; margin-bottom: 10px; }
        .file-input { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .upload-button { width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        .upload-button:hover:not(:disabled) { background: #0056b3; }
        .upload-button:disabled { background: #ccc; cursor: not-allowed; }
        .error-message { color: #d32f2f; margin-bottom: 10px; padding: 10px; background: #ffebee; border-radius: 4px; }
      `}</style>
    </div>
  );
}
