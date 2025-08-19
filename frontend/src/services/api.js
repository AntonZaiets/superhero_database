import { SUPERHEROES_LIMIT } from '@/constants/defaults';
import { apiEndpoints } from '@/services/endpoints';
import { api } from './config/axios';

export const superheroApi = {
  getAll: async (page = 1, limit = SUPERHEROES_LIMIT) => {
    const response = await api.get(apiEndpoints.getAllHeroes(page, limit));
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(apiEndpoints.getHeroById(id));
    return response.data;
  },

  create: async (superheroData) => {
    const response = await api.post(apiEndpoints.createHero, superheroData);
    return response.data;
  },

  update: async (id, superheroData) => {
    const response = await api.put(apiEndpoints.updateHero(id), superheroData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(apiEndpoints.deleteHero(id));
    return response.data;
  },

  addImage: async (id, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post(apiEndpoints.addImage(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  removeImage: async (id, imageName) => {
    const response = await api.delete(apiEndpoints.removeImage(id, imageName));
    return response.data;
  },
};

export const healthCheck = async () => {
  const response = await api.get(apiEndpoints.healthCheck);
  return response.data;
};
