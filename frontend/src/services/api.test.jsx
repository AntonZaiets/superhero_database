import { describe, it, expect, vi, beforeEach } from 'vitest';
import { superheroApi, healthCheck } from './api';
import { api } from './config/axios';

vi.mock('./config/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('superheroApi.getAll', () => {
    it('should fetch superheroes with pagination', async () => {
      const mockResponse = {
        data: {
          superheroes: [],
          total: 0,
          page: 1,
          limit: 5,
          totalPages: 0,
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await superheroApi.getAll(1, 5);

      expect(api.get).toHaveBeenCalledWith('/superheroes?page=1&limit=5');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('superheroApi.getById', () => {
    it('should fetch superhero by id', async () => {
      const mockSuperhero = {
        id: '1',
        nickname: 'Superman',
        real_name: 'Clark Kent',
      };

      const mockResponse = { data: mockSuperhero };
      api.get.mockResolvedValue(mockResponse);

      const result = await superheroApi.getById('1');

      expect(api.get).toHaveBeenCalledWith('/superheroes/1');
      expect(result).toEqual(mockSuperhero);
    });
  });

  describe('superheroApi.create', () => {
    it('should create new superhero', async () => {
      const superheroData = {
        nickname: 'Superman',
        real_name: 'Clark Kent',
        origin_description: 'He was born Kal-El...',
        superpowers: 'Flight, heat vision',
        catch_phrase: 'Look, up in the sky...',
      };

      const mockResponse = { data: { id: '1', ...superheroData } };
      api.post.mockResolvedValue(mockResponse);

      const result = await superheroApi.create(superheroData);

      expect(api.post).toHaveBeenCalledWith('/superheroes', superheroData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('superheroApi.update', () => {
    it('should update superhero', async () => {
      const updateData = {
        nickname: 'Updated Superman',
      };

      const mockResponse = { data: { id: '1', ...updateData } };
      api.put.mockResolvedValue(mockResponse);

      const result = await superheroApi.update('1', updateData);

      expect(api.put).toHaveBeenCalledWith('/superheroes/1', updateData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('superheroApi.delete', () => {
    it('should delete superhero', async () => {
      const mockResponse = {
        data: { message: 'Superhero deleted successfully' },
      };
      api.delete.mockResolvedValue(mockResponse);

      const result = await superheroApi.delete('1');

      expect(api.delete).toHaveBeenCalledWith('/superheroes/1');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('superheroApi.addImage', () => {
    it('should add image to superhero', async () => {
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse = { data: { id: '1', images: ['test.jpg'] } };
      api.post.mockResolvedValue(mockResponse);

      const result = await superheroApi.addImage('1', mockFile);

      expect(api.post).toHaveBeenCalledWith('/superheroes/1/images', expect.any(FormData), {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('superheroApi.removeImage', () => {
    it('should remove image from superhero', async () => {
      const mockResponse = { data: { id: '1', images: [] } };
      api.delete.mockResolvedValue(mockResponse);

      const result = await superheroApi.removeImage('1', 'test.jpg');

      expect(api.delete).toHaveBeenCalledWith('/superheroes/1/images/test.jpg');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('healthCheck', () => {
    it('should check API health', async () => {
      const mockResponse = {
        data: { status: 'OK', message: 'Superhero API is running' },
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await healthCheck();

      expect(api.get).toHaveBeenCalledWith('/health');
      expect(result).toEqual(mockResponse.data);
    });
  });
});
