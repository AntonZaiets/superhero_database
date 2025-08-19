import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMutation, useQueryClient } from 'react-query';
import { useDeleteSuperhero } from './useDeleteSuperhero';
import { superheroApi } from '@/services/api';
import { showToast } from '@/ui/index';

// Mock dependencies
vi.mock('react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock('@/services/api', () => ({
  superheroApi: {
    delete: vi.fn(),
  },
}));

vi.mock('@/ui/index', () => ({
  showToast: vi.fn(),
}));

describe('useDeleteSuperhero', () => {
  const mockQueryClient = {
    invalidateQueries: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useQueryClient.mockReturnValue(mockQueryClient);
  });

  it('should return mutation object from useMutation', () => {
    const mockMutation = {
      mutate: vi.fn(),
      isLoading: false,
      error: null,
      data: null,
    };

    useMutation.mockReturnValue(mockMutation);

    const { result } = renderHook(() => useDeleteSuperhero());

    expect(result.current).toEqual(mockMutation);
  });

  it('should configure useMutation with superheroApi.delete', () => {
    const mockMutation = {
      mutate: vi.fn(),
      isLoading: false,
      error: null,
      data: null,
    };

    useMutation.mockImplementation((mutationFn, options) => {
      // Test the mutation function
      const heroId = 'hero-123';
      mutationFn(heroId);
      expect(superheroApi.delete).toHaveBeenCalledWith(heroId);
      
      return mockMutation;
    });

    renderHook(() => useDeleteSuperhero());

    expect(useMutation).toHaveBeenCalled();
  });

  it('should handle successful deletion', async () => {
    useMutation.mockImplementation((mutationFn, options) => {
      // Simulate successful deletion
      options.onSuccess();
      
      return {
        mutate: vi.fn(),
        isLoading: false,
        error: null,
        data: { message: 'Superhero deleted successfully' },
      };
    });

    renderHook(() => useDeleteSuperhero());

    await waitFor(() => {
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith(['superheroes']);
      expect(showToast).toHaveBeenCalledWith('superhero', 'deleteSuccess', 'success');
    });
  });

  it('should handle deletion error', async () => {
    const error = new Error('Failed to delete superhero');

    useMutation.mockImplementation((mutationFn, options) => {
      // Simulate error
      options.onError(error);
      
      return {
        mutate: vi.fn(),
        isLoading: false,
        error,
        data: null,
      };
    });

    renderHook(() => useDeleteSuperhero());

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith('superhero', 'deleteError', 'error');
      expect(mockQueryClient.invalidateQueries).not.toHaveBeenCalled();
    });
  });

  it('should call mutationFn with correct superhero id', () => {
    const heroId = 'test-hero-id';
    let capturedMutationFn;

    useMutation.mockImplementation((mutationFn, options) => {
      capturedMutationFn = mutationFn;
      return {
        mutate: vi.fn(),
        isLoading: false,
        error: null,
        data: null,
      };
    });

    renderHook(() => useDeleteSuperhero());

    // Execute the captured mutation function
    capturedMutationFn(heroId);

    expect(superheroApi.delete).toHaveBeenCalledWith(heroId);
  });

  it('should return mutation with correct properties and methods', () => {
    const mockMutation = {
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isLoading: false,
      isError: false,
      isSuccess: false,
      isIdle: true,
      error: null,
      data: null,
      reset: vi.fn(),
    };

    useMutation.mockReturnValue(mockMutation);

    const { result } = renderHook(() => useDeleteSuperhero());

    expect(result.current).toHaveBeenMutationObject();
    expect(typeof result.current.mutate).toBe('function');
    expect(typeof result.current.mutateAsync).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });

  it('should handle loading state', () => {
    const mockMutation = {
      mutate: vi.fn(),
      isLoading: true,
      isError: false,
      isSuccess: false,
      error: null,
      data: null,
    };

    useMutation.mockReturnValue(mockMutation);

    const { result } = renderHook(() => useDeleteSuperhero());

    expect(result.current.isLoading).toBe(true);
  });

  it('should handle error state in mutation object', () => {
    const error = new Error('Network error');
    const mockMutation = {
      mutate: vi.fn(),
      isLoading: false,
      isError: true,
      isSuccess: false,
      error,
      data: null,
    };

    useMutation.mockReturnValue(mockMutation);

    const { result } = renderHook(() => useDeleteSuperhero());

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(error);
  });

  it('should handle success state in mutation object', () => {
    const successData = { message: 'Superhero deleted successfully' };
    const mockMutation = {
      mutate: vi.fn(),
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      data: successData,
    };

    useMutation.mockReturnValue(mockMutation);

    const { result } = renderHook(() => useDeleteSuperhero());

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toEqual(successData);
  });

  it('should use useQueryClient hook', () => {
    const mockMutation = {
      mutate: vi.fn(),
      isLoading: false,
      error: null,
      data: null,
    };

    useMutation.mockReturnValue(mockMutation);

    renderHook(() => useDeleteSuperhero());

    expect(useQueryClient).toHaveBeenCalled();
  });

  it('should not call invalidateQueries or showToast when hook is just initialized', () => {
    const mockMutation = {
      mutate: vi.fn(),
      isLoading: false,
      error: null,
      data: null,
    };

    useMutation.mockImplementation((mutationFn, options) => {
      // Don't call any callbacks initially
      return mockMutation;
    });

    renderHook(() => useDeleteSuperhero());

    expect(mockQueryClient.invalidateQueries).not.toHaveBeenCalled();
    expect(showToast).not.toHaveBeenCalled();
  });

  it('should handle multiple delete operations independently', async () => {
    let onSuccessCallback;
    let onErrorCallback;

    useMutation.mockImplementation((mutationFn, options) => {
      onSuccessCallback = options.onSuccess;
      onErrorCallback = options.onError;
      
      return {
        mutate: vi.fn(),
        isLoading: false,
        error: null,
        data: null,
      };
    });

    renderHook(() => useDeleteSuperhero());

    // Simulate first successful deletion
    onSuccessCallback();
    
    await waitFor(() => {
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledTimes(1);
      expect(showToast).toHaveBeenCalledTimes(1);
      expect(showToast).toHaveBeenCalledWith('superhero', 'deleteSuccess', 'success');
    });

    // Clear mocks for second operation
    vi.clearAllMocks();

    // Simulate second operation with error
    onErrorCallback(new Error('Second deletion failed'));
    
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledTimes(1);
      expect(showToast).toHaveBeenCalledWith('superhero', 'deleteError', 'error');
      expect(mockQueryClient.invalidateQueries).not.toHaveBeenCalled();
    });
  });
});

// Custom matcher for checking if an object has mutation-like properties
expect.extend({
  toHaveBeenMutationObject(received) {
    const pass = 
      received &&
      typeof received === 'object' &&
      'mutate' in received &&
      'isLoading' in received &&
      'error' in received &&
      'data' in received;

    if (pass) {
      return {
        message: () => `expected ${received} not to be a mutation object`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a mutation object with mutate, isLoading, error, and data properties`,
        pass: false,
      };
    }
  },
});
