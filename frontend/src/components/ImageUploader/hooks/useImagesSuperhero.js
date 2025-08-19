import { useMutation, useQueryClient } from 'react-query';
import { superheroApi } from '@/services/api';
import { showToast } from '@/ui';

export const useSuperheroImages = (id) => {
  const queryClient = useQueryClient();

  const addImage = useMutation(
    (file) => {
      if (!id) {
        throw new Error('Cannot upload image without hero ID');
      }
      return superheroApi.addImage(id, file);
    },
    {
      onSuccess: () => {
        if (id) {
          queryClient.invalidateQueries(['superhero', id]);
        }
      },
      onError: () => {
        showToast('image', 'uploadError', 'error');
      },
    },
  );

  const removeImage = useMutation((imageName) => superheroApi.removeImage(id, imageName), {
    onSuccess: () => {
      queryClient.invalidateQueries(['superhero', id]);
    },
    onError: () => {
      showToast('image', 'deleteError', 'error');
    },
  });

  return { addImage, removeImage };
};
