import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { showToast } from '@/ui';

const VALID_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const FILE_SIZE = 5 * 1024 * 1024;

export const ImageUploadField = ({ onUpload, isLoading }) => {
  const fileInputRef = useRef(null);

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !VALID_TYPES.includes(fileExtension)) {
      showToast('image', 'unsupportedFileType', 'error');
      return;
    }

    if (file.size > FILE_SIZE) {
      showToast('image', 'invalidImageSize', 'error');
      return;
    }

    onUpload(file);
  };

  return (
    <div
      className={`file-upload ${isLoading ? 'disabled' : ''}`}
      onClick={() => !isLoading && fileInputRef.current?.click()}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
          e.preventDefault();
          fileInputRef.current?.click();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleChange}
        disabled={isLoading}
        className="hidden"
      />
      {isLoading ? (
        <div>
          <Upload size={24} />
          <p>Uploading...</p>
        </div>
      ) : (
        <div>
          <Upload size={24} />
          <p>Click to upload image</p>
          <p className="upload-hint">Supports: JPEG, PNG, GIF, WebP</p>
        </div>
      )}
    </div>
  );
};
