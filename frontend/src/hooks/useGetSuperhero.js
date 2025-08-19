import { useQuery } from 'react-query';
import { superheroApi } from '@/services/api';

export const useGetSuperhero = (id) =>
  useQuery(['superhero', id], () => superheroApi.getById(id), {
    enabled: !!id,
  });
