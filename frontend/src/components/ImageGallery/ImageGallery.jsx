import React from 'react';
import { RemoveImageButton } from '@/ui';

export const ImageGallery = ({
  images,
  nickname,
  id,
  isVisible,
  onRemove = null,
  isRemoving = null,
}) => {
  if (!images?.length) return null;

  const getImageSrc = (image) => {
    const endpoint = `/api/superheroes/${id}/images/${image.fileId}`;
    if (image.isLocal) {
      return image.previewUrl;
    }
    return id ? endpoint : image;
  };

  const handleRemove = (image) => onRemove?.(image?.fileId || image);

  return (
    <div className="image-gallery">
      {images.map((image) => (
        <div key={image?.fileId || image} className="image-item">
          <img src={getImageSrc(image)} alt={nickname} />
          {isVisible && (
            <RemoveImageButton onRemove={() => handleRemove(image)} disabled={isRemoving} />
          )}
        </div>
      ))}
    </div>
  );
};
