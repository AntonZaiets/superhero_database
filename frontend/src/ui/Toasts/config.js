export const toastMessages = {
  superhero: {
    deleteSuccess: 'Hero deleted successfully',
    deleteError: 'Failed to delete hero',
    createSuccess: 'Created successfully',
    createError: 'Failed to create',
    updateSuccess: 'Updated successfully',
    updateError: 'Failed to update',
  },
  image: {
    deleteError: 'Failed to delete image',
    uploadError: 'Failed to upload image',
    unsupportedFileType: 'Unsupported file type',
    invalidImageSize: 'Image size must be less than 5MB',
  },
  general: {
    networkError: 'Network error',
    unexpectedError: 'Unexpected error',
  },
};

export const toastOptions = {
  default: {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    theme: 'light',
  },
};
