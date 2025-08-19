import React, { useImperativeHandle, forwardRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ImageUploadField, ImageGallery } from '@/components';
import { superheroApi } from '@/services/api';
import { useImageHandler, useSuperheroImages } from './hooks';

const ImageUploaderComponent = forwardRef(({ id, superhero }, ref) => {
  const location = useLocation();
  const isVisible = ['edit', 'create'].some((word) => location.pathname.includes(word));
  const { addImage, removeImage } = useSuperheroImages(id);

  const {
    handleUpload,
    handleRemove,
    localImages,
    pendingFiles,
    pendingRemovals,
    setPendingFiles,
    setLocalImages,
    setPendingRemovals,
    hero,
  } = useImageHandler({ id, hero: superhero });

  useImperativeHandle(ref, () => ({
    uploadPendingFiles: async (heroId) => {
      await Promise.all(pendingRemovals.map((fileId) => superheroApi.removeImage(heroId, fileId)));

      await Promise.all(pendingFiles.map((file) => superheroApi.addImage(heroId, file)));

      setPendingFiles([]);
      setLocalImages([]);
      setPendingRemovals([]);
    },
  }));

  const displayImages = [
    ...(hero?.images || []).filter((img) => !pendingRemovals.includes(img.fileId)),
    ...localImages.map((localImg) => ({
      fileId: localImg.id,
      filename: localImg.file.name,
      previewUrl: localImg.previewUrl,
      isLocal: true,
    })),
  ];

  return (
    <div className="form-group">
      <label className="form-label">
        Images
        {(pendingFiles.length > 0 || pendingRemovals.length > 0) && (
          <span className="pending-count">
            {' '}
            ({pendingFiles.length} to add
            {pendingRemovals.length > 0 && `, ${pendingRemovals.length} to remove`})
          </span>
        )}
      </label>

      <ImageUploadField onUpload={handleUpload} isLoading={addImage.isLoading} />

      <ImageGallery
        images={displayImages}
        nickname={hero?.nickname || 'Superhero'}
        id={id}
        onRemove={handleRemove}
        isRemoving={removeImage.isLoading}
        isVisible={isVisible}
      />
    </div>
  );
});

ImageUploaderComponent.displayName = 'ImageUploader';

export const ImageUploader = ImageUploaderComponent;
