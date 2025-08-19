import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { superheroSchema } from '@/schemes';

export const useHookFormSuperhero = () =>
  useForm({
    resolver: yupResolver(superheroSchema),
    defaultValues: {
      nickname: '',
      real_name: '',
      origin_description: '',
      superpowers: '',
      catch_phrase: '',
    },
  });
