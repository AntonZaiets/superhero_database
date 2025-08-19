import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMutation, useQueryClient } from 'react-query';
import { useSuperheroImages } from './useImagesSuperhero';
import { superheroApi } from '@/services/api';
import { showToast } from '@/ui';

// Mock dependencies
vi.mock('react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock('@/services/api', () => ({
  superheroApi: {
    addImage: vi.fn(),
    removeImage: vi.fn(),
  },
}));

vi.mock('@/ui', () => ({
  showToast: vi.fn(),
}));

describe('useSuperheroImages', () => {
  const mockQueryClient = {
    invalidateQueries: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useQueryClient.mockReturnValue(mockQueryClient);
  });

  describe('addImage mutation', () => {
    it('should return addImage and removeImage mutations', () => {
      const heroId = 'hero-123';
      const mockAddMutation = {
        mutate: vi.fn(),
        isLoading: false,
        error: null,
        data: null,
      };
      const mockRemoveMutation = {
        mutate: vi.fn(),
        isLoading: false,
        error: null,
        data: null,
      };

      useMutation
        .mockReturnValueOnce(mockAddMutation)
        .mockReturnValueOnce(mockRemoveMutation);

      const { result } = renderHook(() => useSuperheroImages(heroId));

      expect(result.current.addImage).toEqual(mockAddMutation);
      expect(result.current.removeImage).toEqual(mockRemoveMutation);
    });

    it('should call superheroApi.addImage with correct parameters when hero ID exists', () => {
      const heroId = 'hero-123';
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      
      useMutation.mockImplementation((mutationFn, options) => {
        // Test the mutation function for addImage (first call)
        if (useMutation.mock.calls.length === 1) {
          mutationFn(mockFile);
          expect(superheroApi.addImage).toHaveBeenCalledWith(heroId, mockFile);
        }
        
        return {
          mutate: vi.fn(),
          isLoading: false,
          error: null,
          data: null,
        };
      });

      renderHook(() => useSuperheroImages(heroId));

      expect(useMutation).toHaveBeenCalledTimes(2); // Both addImage and removeImage
    });

    it('should throw error when trying to add image without hero ID', () => {
      const heroId = null;
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      
      useMutation.mockImplementation((mutationFn, options) => {
        // Test the mutation function for addImage
        if (useMutation.mock.calls.length === 1) {
          expect(() => mutationFn(mockFile)).toThrow('Cannot upload image without hero ID');
        }
        
        return {
          mutate: vi.fn(),
          isLoading: false,
          error: null,
          data: null,
        };
      });

      renderHook(() => useSuperheroImages(heroId));
    });

    it('should handle successful image addition', async () => {
      const heroId = 'hero-123';
      
      useMutation.mockImplementation((mutationFn, options) => {
        // Handle addImage mutation (first call)
        if (useMutation.mock.calls.length === 1) {
          options.onSuccess();
        }
        
        return {
          mutate: vi.fn(),
          isLoading: false,
          error: null,
          data: { id: heroId, images: ['new-image.jpg'] },
        };
      });

      renderHook(() => useSuperheroImages(heroId));

      await waitFor(() => {
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith(['superhero', heroId]);
      });
    });

    it('should handle image addition error', async () => {
      const heroId = 'hero-123';
      
      useMutation.mockImplementation((mutationFn, options) => {
        // Handle addImage mutation error (first call)
        if (useMutation.mock.calls.length === 1) {
          options.onError(new Error('Upload failed'));
        }
        
        return {
          mutate: vi.fn(),
          isLoading: false,
          error: new Error('Upload failed'),
          data: null,
        };
      });

      renderHook(() => useSuperheroImages(heroId));

      await waitFor(() => {
        expect(showToast).toHaveBeenCalledWith('image', 'uploadError', 'error');
        expect(mockQueryClient.invalidateQueries).not.toHaveBeenCalled();
      });
    });

    it('should not invalidate queries when hero ID is null on success', async () => {
      const heroId = null;
      
      useMutation.mockImplementation((mutationFn, options) => {
        // Handle addImage mutation (first call)
        if (useMutation.mock.calls.length === 1) {
          options.onSuccess();
        }
        
        return {
          mutate: vi.fn(),
          isLoading: false,
          error: null,
          data: null,
        };
      });

      renderHook(() => useSuperheroImages(heroId));

      await waitFor(() => {
        expect(mockQueryClient.invalidateQueries).not.toHaveBeenCalled();
      });
    });
  });

  describe('removeImage mutation', () => {
    it('should call superheroApi.removeImage with correct parameters', () => {
      const heroId = 'hero-123';
      const imageName = 'test-image.jpg';
      
      useMutation.mockImplementation((mutationFn, options) => {
        // Test the mutation function for removeImage (second call)
        if (useMutation.mock.calls.length === 2) {
          mutationFn(imageName);
          expect(superheroApi.removeImage).toHaveBeenCalledWith(heroId, imageName);
        }
        
        return {
          mutate: vi.fn(),
          isLoading: false,
          error: null,
          data: null,
        };
      });

      renderHook(() => useSuperheroImages(heroId));
    });

    it('should handle successful image removal', async () => {
      const heroId = 'hero-123';
      
      let removeImageOnSuccess;
      
      useMutation.mockImplementation((mutationFn, options) => {
        // Handle removeImage mutation (second call)
        if (useMutation.mock.calls.length === 2) {
          removeImageOnSuccess = options.onSuccess;
        }
        
        return {
          mutate: vi.fn(),
          isLoading: false,
          error: null,
          data: { id: heroId, images: [] },
        };
      });

      renderHook(() => useSuperheroImages(heroId));

      // Trigger success callback for removeImage
      removeImageOnSuccess();

      await waitFor(() => {
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith(['superhero', heroId]);
      });
    });

    it('should handle image removal error', async () => {
      const heroId = 'hero-123';
      
      let removeImageOnError;
      
      useMutation.mockImplementation((mutationFn, options) => {
        // Handle removeImage mutation (second call)
        if (useMutation.mock.calls.length === 2) {
          removeImageOnError = options.onError;
        }
        
        return {
          mutate: vi.fn(),
          isLoading: false,
          error: null,
          data: null,
        };
      });

      renderHook(() => useSuperheroImages(heroId));

      // Trigger error callback for removeImage
      removeImageOnError(new Error('Delete failed'));

      await waitFor(() => {
        expect(showToast).toHaveBeenCalledWith('image', 'deleteError', 'error');
      });
    });
  });

  describe('with undefined hero ID', () => {
    it('should handle undefined hero ID', () => {
      const heroId = undefined;
      
      const mockAddMutation = {
        mutate: vi.fn(),
        isLoading: false,
        error: null,
        data: null,
      };
      const mockRemoveMutation = {
        mutate: vi.fn(),
        isLoading: false,
        error: null,
        data: null,
      };

      useMutation
        .mockReturnValueOnce(mockAddMutation)
        .mockReturnValueOnce(mockRemoveMutation);

      const { result } = renderHook(() => useSuperheroImages(heroId));

      expect(result.current.addImage).toEqual(mockAddMutation);
      expect(result.current.removeImage).toEqual(mockRemoveMutation);
    });

    it('should throw error when trying to add image with undefined hero ID', () => {
      const heroId = undefined;
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      
      useMutation.mockImplementation((mutationFn, options) => {
        // Test the mutation function for addImage
        if (useMutation.mock.calls.length === 1) {
          expect(() => mutationFn(mockFile)).toThrow('Cannot upload image without hero ID');
        }
        
        return {
          mutate: vi.fn(),
          isLoading: false,
          error: null,
          data: null,
        };
      });

      renderHook(() => useSuperheroImages(heroId));
    });
  });

  describe('mutation states', () => {
    it('should handle loading states', () => {
      const heroId = 'hero-123';
      
      const mockAddMutation = {
        mutate: vi.fn(),
        isLoading: true,
        error: null,
        data: null,
      };
      const mockRemoveMutation = {
        mutate: vi.fn(),
        isLoading: false,
        error: null,
        data: null,
      };

      useMutation
        .mockReturnValueOnce(mockAddMutation)
        .mockReturnValueOnce(mockRemoveMutation);

      const { result } = renderHook(() => useSuperheroImages(heroId));

      expect(result.current.addImage.isLoading).toBe(true);
      expect(result.current.removeImage.isLoading).toBe(false);
    });

    it('should handle error states', () => {
      const heroId = 'hero-123';
      const addError = new Error('Add image failed');
      const removeError = new Error('Remove image failed');
      
      const mockAddMutation = {
        mutate: vi.fn(),
        isLoading: false,
        error: addError,
        data: null,
        isError: true,
      };
      const mockRemoveMutation = {
        mutate: vi.fn(),
        isLoading: false,
        error: removeError,
        data: null,
        isError: true,
      };

      useMutation
        .mockReturnValueOnce(mockAddMutation)
        .mockReturnValueOnce(mockRemoveMutation);

      const { result } = renderHook(() => useSuperheroImages(heroId));

      expect(result.current.addImage.error).toEqual(addError);
      expect(result.current.addImage.isError).toBe(true);
      expect(result.current.removeImage.error).toEqual(removeError);
      expect(result.current.removeImage.isError).toBe(true);
    });

    it('should handle success states', () => {
      const heroId = 'hero-123';
      const addData = { id: heroId, images: ['new-image.jpg'] };
      const removeData = { id: heroId, images: [] };
      
      const mockAddMutation = {
        mutate: vi.fn(),
        isLoading: false,
        error: null,
        data: addData,
        isSuccess: true,
      };
      const mockRemoveMutation = {
        mutate: vi.fn(),
        isLoading: false,
        error: null,
        data: removeData,
        isSuccess: true,
      };

      useMutation
        .mockReturnValueOnce(mockAddMutation)
        .mockReturnValueOnce(mockRemoveMutation);

      const { result } = renderHook(() => useSuperheroImages(heroId));

      expect(result.current.addImage.data).toEqual(addData);
      expect(result.current.addImage.isSuccess).toBe(true);
      expect(result.current.removeImage.data).toEqual(removeData);
      expect(result.current.removeImage.isSuccess).toBe(true);
    });
  });

  it('should use useQueryClient hook', () => {
    const heroId = 'hero-123';
    
    useMutation.mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
      error: null,
      data: null,
    });

    renderHook(() => useSuperheroImages(heroId));

    expect(useQueryClient).toHaveBeenCalled();
  });
});
