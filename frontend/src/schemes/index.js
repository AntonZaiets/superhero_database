import * as yup from 'yup';

export const superheroSchema = yup.object().shape({
  nickname: yup
    .string()
    .required('Nickname is required')
    .transform((value) => value?.trim()),
  real_name: yup
    .string()
    .required('Real name is required')
    .transform((value) => value?.trim()),
  origin_description: yup
    .string()
    .required('Origin description is required')
    .transform((value) => value?.trim()),
  superpowers: yup
    .string()
    .required('Superpowers are required')
    .transform((value) => value?.trim()),
  catch_phrase: yup
    .string()
    .required('Catch phrase is required')
    .transform((value) => value?.trim()),
});
