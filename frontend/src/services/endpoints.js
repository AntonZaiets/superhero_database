const BASE = '/superheroes';

export const apiEndpoints = {
  getAllHeroes: (page, limit) => `${BASE}?page=${page}&limit=${limit}`,
  getHeroById: (id) => `${BASE}/${id}`,
  createHero: `${BASE}`,
  updateHero: (id) => `${BASE}/${id}`,
  deleteHero: (id) => `${BASE}/${id}`,
  addImage: (id) => `${BASE}/${id}/images`,
  removeImage: (id, imageName) => `${BASE}/${id}/images/${imageName}`,
  healthCheck: '/health',
};
