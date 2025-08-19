import { X } from 'lucide-react';
import React from 'react';

export const RemoveImageButton = ({ onRemove, disabled }) => (
  <button
    type="button"
    className="image-remove"
    onClick={onRemove}
    title="Remove image"
    disabled={disabled}
  >
    <X size={16} />
  </button>
);
