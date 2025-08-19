import { useState } from 'react';

export const useImageHandler = ({ id, hero }) => {
  const [pendingFiles, setPendingFiles] = useState([]);
  const [localImages, setLocalImages] = useState([]);
  const [pendingRemovals, setPendingRemovals] = useState([]);

  const handleUpload = (file) => {
    setPendingFiles((prev) => [...prev, file]);
    const previewUrl = URL.createObjectURL(file);
    setLocalImages((prev) => [...prev, { file, previewUrl, id: Math.random().toString(36) }]);
  };

  const handleRemove = (fileId) => {
    if (id && hero?.images?.some((img) => img.fileId === fileId)) {
      setPendingRemovals((prev) => [...prev, fileId]);
    } else {
      const localImg = localImages.find((img) => img.id === fileId);
      if (localImg) {
        URL.revokeObjectURL(localImg.previewUrl);
        setLocalImages((prev) => prev.filter((img) => img.id !== fileId));
        setPendingFiles((prev) => prev.filter((file) => file !== localImg.file));
      }
    }
  };

  return {
    handleUpload,
    handleRemove,
    pendingFiles,
    localImages,
    pendingRemovals,
    setLocalImages,
    setPendingFiles,
    setPendingRemovals,
    hero,
  };
};
