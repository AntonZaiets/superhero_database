import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useFormSuperhero } from './useFormSuperhero';
import { superheroApi } from '@/services/api';
import { showToast } from '@/ui';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock('@/services/api', () => ({
  superheroApi: {
    getById: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('@/ui', () => ({
  showToast: vi.fn(),
}));

describe('useFormSuperhero', () => {
  const mockNavigate = vi.fn();
  const mockReset = vi.fn();
  const mockQueryClient = {
    invalidateQueries: vi.fn(),
  };
  const mockImageUploaderRef = {
    current: {
      uploadPendingFiles: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useQueryClient.mockReturnValue(mockQueryClient);
  });

  describe('when creating a new superhero', () => {
    beforeEach(() => {
      useParams.mockReturnValue({ id: undefined });
      useQuery.mockReturnValue({
        isLoading: false,
        error: null,
      });
    });

    it('should return isEditing as false', () => {
      const mockMutation = { mutate: vi.fn() };
      useMutation.mockReturnValue(mockMutation);

      const { result } = renderHook(() =>
        useFormSuperhero({
          reset: mockReset,
          imageUploaderRef: mockImageUploaderRef,
        })
      );

      expect(result.current.isEditing).toBe(false);
    });

    it('should create mutation with create API call', () => {
      const mockMutate = vi.fn();
      const mockMutation = { mutate: mockMutate };
      
      useMutation.mockImplementation((mutationFn, options) => {
        // Test the mutation function
        const superheroData = { nickname: 'Test Hero' };
        mutationFn(superheroData);
        expect(superheroApi.create).toHaveBeenCalledWith(superheroData);
        
        return mockMutation;
      });

      renderHook(() =>
        useFormSuperhero({
          reset: mockReset,
          imageUploaderRef: mockImageUploaderRef,
        })
      );

      expect(useMutation).toHaveBeenCalled();
    });

    it('should handle successful creation', async () => {
      const mockMutate = vi.fn();
      const createdSuperhero = { id: 'new-id', nickname: 'Test Hero' };
      
      useMutation.mockImplementation((mutationFn, options) => {
        // Simulate successful creation
        options.onSuccess(createdSuperhero);
        return { mutate: mockMutate };
      });

      mockImageUploaderRef.current.uploadPendingFiles.mockResolvedValue();

      renderHook(() =>
        useFormSuperhero({
          reset: mockReset,
          imageUploaderRef: mockImageUploaderRef,
        })
      );

      await waitFor(() => {
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith(['superheroes']);
        expect(mockImageUploaderRef.current.uploadPendingFiles).toHaveBeenCalledWith('new-id');
        expect(showToast).toHaveBeenCalledWith('superhero', 'createSuccess', 'success');
        expect(mockNavigate).toHaveBeenCalledWith('/superhero/new-id');
      });
    });
  });

  describe('when editing an existing superhero', () => {
    const heroId = 'hero-123';
    const existingHero = { id: heroId, nickname: 'Existing Hero' };

    beforeEach(() => {
      useParams.mockReturnValue({ id: heroId });
    });

    it('should return isEditing as true', () => {
      useQuery.mockReturnValue({
        isLoading: false,
        error: null,
      });

      const mockMutation = { mutate: vi.fn() };
      useMutation.mockReturnValue(mockMutation);

      const { result } = renderHook(() =>
        useFormSuperhero({
          reset: mockReset,
          imageUploaderRef: mockImageUploaderRef,
        })
      );

      expect(result.current.isEditing).toBe(true);
    });

    it('should fetch existing superhero data', () => {
      useQuery.mockReturnValue({
        isLoading: false,
        error: null,
      });

      const mockMutation = { mutate: vi.fn() };
      useMutation.mockReturnValue(mockMutation);

      renderHook(() =>
        useFormSuperhero({
          reset: mockReset,
          imageUploaderRef: mockImageUploaderRef,
        })
      );

      expect(useQuery).toHaveBeenCalledWith(
        ['superhero', heroId],
        expect.any(Function),
        {
          enabled: true,
          onSuccess: expect.any(Function),
        }
      );
    });

    it('should reset form with fetched data on success', () => {
      useQuery.mockImplementation((queryKey, queryFn, options) => {
        // Simulate successful data fetch
        options.onSuccess(existingHero);
        return {
          isLoading: false,
          error: null,
        };
      });

      const mockMutation = { mutate: vi.fn() };
      useMutation.mockReturnValue(mockMutation);

      renderHook(() =>
        useFormSuperhero({
          reset: mockReset,
          imageUploaderRef: mockImageUploaderRef,
        })
      );

      expect(mockReset).toHaveBeenCalledWith(existingHero);
    });

    it('should create mutation with update API call', () => {
      useQuery.mockReturnValue({
        isLoading: false,
        error: null,
      });

      useMutation.mockImplementation((mutationFn, options) => {
        // Test the mutation function
        const updatedData = { nickname: 'Updated Hero' };
        mutationFn(updatedData);
        expect(superheroApi.update).toHaveBeenCalledWith(heroId, updatedData);
        
        return { mutate: vi.fn() };
      });

      renderHook(() =>
        useFormSuperhero({
          reset: mockReset,
          imageUploaderRef: mockImageUploaderRef,
        })
      );

      expect(useMutation).toHaveBeenCalled();
    });

    it('should handle successful update', async () => {
      useQuery.mockReturnValue({
        isLoading: false,
        error: null,
      });

      const updatedSuperhero = { id: heroId, nickname: 'Updated Hero' };
      
      useMutation.mockImplementation((mutationFn, options) => {
        // Simulate successful update
        options.onSuccess(updatedSuperhero);
        return { mutate: vi.fn() };
      });

      mockImageUploaderRef.current.uploadPendingFiles.mockResolvedValue();

      renderHook(() =>
        useFormSuperhero({
          reset: mockReset,
          imageUploaderRef: mockImageUploaderRef,
        })
      );

      await waitFor(() => {
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith(['superheroes']);
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith(['superhero', heroId]);
        expect(mockImageUploaderRef.current.uploadPendingFiles).toHaveBeenCalledWith(heroId);
        expect(showToast).toHaveBeenCalledWith('superhero', 'updateSuccess', 'success');
        expect(mockNavigate).toHaveBeenCalledWith(`/superhero/${heroId}`);
      });
    });

    it('should return loading state', () => {
      useQuery.mockReturnValue({
        isLoading: true,
        error: null,
      });

      const mockMutation = { mutate: vi.fn() };
      useMutation.mockReturnValue(mockMutation);

      const { result } = renderHook(() =>
        useFormSuperhero({
          reset: mockReset,
          imageUploaderRef: mockImageUploaderRef,
        })
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should return error state', () => {
      const error = new Error('Failed to fetch');
      useQuery.mockReturnValue({
        isLoading: false,
        error,
      });

      const mockMutation = { mutate: vi.fn() };
      useMutation.mockReturnValue(mockMutation);

      const { result } = renderHook(() =>
        useFormSuperhero({
          reset: mockReset,
          imageUploaderRef: mockImageUploaderRef,
        })
      );

      expect(result.current.error).toBe(error);
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      useParams.mockReturnValue({ id: undefined });
      useQuery.mockReturnValue({
        isLoading: false,
        error: null,
      });
    });

    it('should handle mutation error', () => {
      useMutation.mockImplementation((mutationFn, options) => {
        // Simulate error
        options.onError();
        return { mutate: vi.fn() };
      });

      renderHook(() =>
        useFormSuperhero({
          reset: mockReset,
          imageUploaderRef: mockImageUploaderRef,
        })
      );

      expect(showToast).toHaveBeenCalledWith('superhero', 'createSuccess', 'error');
    });

    it('should handle image upload error during success', async () => {
      const createdSuperhero = { id: 'new-id', nickname: 'Test Hero' };
      
      useMutation.mockImplementation((mutationFn, options) => {
        options.onSuccess(createdSuperhero);
        return { mutate: vi.fn() };
      });

      mockImageUploaderRef.current.uploadPendingFiles.mockRejectedValue(new Error('Upload failed'));

      renderHook(() =>
        useFormSuperhero({
          reset: mockReset,
          imageUploaderRef: mockImageUploaderRef,
        })
      );

      await waitFor(() => {
        expect(showToast).toHaveBeenCalledWith('superhero', 'createSuccess', 'success');
        expect(mockNavigate).toHaveBeenCalledWith('/superhero/new-id');
      });
    });
  });

  describe('without image uploader ref', () => {
    beforeEach(() => {
      useParams.mockReturnValue({ id: undefined });
      useQuery.mockReturnValue({
        isLoading: false,
        error: null,
      });
    });

    it('should handle success without image uploader', async () => {
      const createdSuperhero = { id: 'new-id', nickname: 'Test Hero' };
      
      useMutation.mockImplementation((mutationFn, options) => {
        options.onSuccess(createdSuperhero);
        return { mutate: vi.fn() };
      });

      renderHook(() =>
        useFormSuperhero({
          reset: mockReset,
          imageUploaderRef: null,
        })
      );

      await waitFor(() => {
        expect(showToast).toHaveBeenCalledWith('superhero', 'createSuccess', 'success');
        expect(mockNavigate).toHaveBeenCalledWith('/superhero/new-id');
      });
    });
  });
});
