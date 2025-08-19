import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { superheroApi } from '@/services/api';
import { showToast } from '@/ui';

export const useFormSuperhero = ({ reset, imageUploaderRef }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const { isLoading, error } = useQuery(['superhero', id], () => superheroApi.getById(id), {
    enabled: isEditing,
    onSuccess: (data) => reset(data),
  });

  const toastManager = (type) => {
    if (isEditing) {
      showToast('superhero', 'updateSuccess', type);
    } else {
      showToast('superhero', 'createSuccess', type);
    }
  };

  const mutation = useMutation(
    (data) => (isEditing ? superheroApi.update(id, data) : superheroApi.create(data)),
    {
      onSuccess: async (data) => {
        queryClient.invalidateQueries(['superheroes']);
        queryClient.invalidateQueries(['superhero', id]);

        if (imageUploaderRef?.current) {
          try {
            await imageUploaderRef.current.uploadPendingFiles(data.id || id);
          } catch (imageError) {
            toastManager('warning', 'Images could not be uploaded');
          }
        }
        toastManager('success');
        navigate(`/superhero/${data.id || id}`);
      },
      onError: () => {
        toastManager('error');
      },
    },
  );

  return {
    isEditing,
    isLoading,
    error,
    mutation,
  };
};
