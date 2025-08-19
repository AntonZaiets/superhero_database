import { useMutation, useQueryClient } from 'react-query';
import { superheroApi } from '@/services/api';
import { showToast } from '@/ui/index';

export const useDeleteSuperhero = () => {
  const queryClient = useQueryClient();

  return useMutation((id) => superheroApi.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['superheroes']);
      showToast('superhero', 'deleteSuccess', 'success');
    },
    onError: () => {
      showToast('superhero', 'deleteError', 'error');
    },
  });
};
