import { useQuery } from 'react-query';
import { superheroApi } from '@/services/api';
import { SUPERHEROES_LIMIT } from '@/constants/defaults';

export const useGetSuperheroes = ({ page, limit = SUPERHEROES_LIMIT }) =>
  useQuery({
    queryKey: ['superheroes', { page, limit }],
    queryFn: () => superheroApi.getAll(page, limit),
    keepPreviousData: true,
  });
