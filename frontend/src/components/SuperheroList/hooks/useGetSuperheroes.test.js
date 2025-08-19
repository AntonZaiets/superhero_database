import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useQuery } from 'react-query';
import { useGetSuperheroes } from './useGetSuperheroes';
import { superheroApi } from '@/services/api';
import { SUPERHEROES_LIMIT } from '@/constants/defaults';

// Mock dependencies
vi.mock('react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('@/services/api', () => ({
  superheroApi: {
    getAll: vi.fn(),
  },
}));

vi.mock('@/constants/defaults', () => ({
  SUPERHEROES_LIMIT: 5,
}));

describe('useGetSuperheroes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call useQuery with correct parameters when page and limit are provided', () => {
    const page = 2;
    const limit = 10;
    const mockQueryResult = {
      data: null,
      isLoading: false,
      error: null,
    };

    useQuery.mockReturnValue(mockQueryResult);

    const { result } = renderHook(() =>
      useGetSuperheroes({ page, limit })
    );

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['superheroes', { page: 2, limit: 10 }],
      queryFn: expect.any(Function),
      keepPreviousData: true,
    });
  });

  it('should use default limit when limit is not provided', () => {
    const page = 1;
    const mockQueryResult = {
      data: null,
      isLoading: false,
      error: null,
    };

    useQuery.mockReturnValue(mockQueryResult);

    renderHook(() =>
      useGetSuperheroes({ page })
    );

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['superheroes', { page: 1, limit: SUPERHEROES_LIMIT }],
      queryFn: expect.any(Function),
      keepPreviousData: true,
    });
  });

  it('should call superheroApi.getAll with correct parameters in queryFn', () => {
    const page = 3;
    const limit = 8;

    useQuery.mockImplementation(({ queryFn }) => {
      // Execute the queryFn to test it
      queryFn();
      return {
        data: null,
        isLoading: false,
        error: null,
      };
    });

    renderHook(() =>
      useGetSuperheroes({ page, limit })
    );

    expect(superheroApi.getAll).toHaveBeenCalledWith(page, limit);
  });

  it('should return the query result from useQuery', () => {
    const page = 1;
    const limit = 5;
    const mockQueryResult = {
      data: {
        superheroes: [
          { id: '1', nickname: 'Superman' },
          { id: '2', nickname: 'Batman' },
        ],
        total: 10,
        page: 1,
        limit: 5,
        totalPages: 2,
      },
      isLoading: false,
      error: null,
      isFetching: false,
      isSuccess: true,
    };

    useQuery.mockReturnValue(mockQueryResult);

    const { result } = renderHook(() =>
      useGetSuperheroes({ page, limit })
    );

    expect(result.current).toEqual(mockQueryResult);
  });

  it('should handle loading state', () => {
    const page = 1;
    const mockQueryResult = {
      data: null,
      isLoading: true,
      error: null,
      isFetching: true,
      isSuccess: false,
    };

    useQuery.mockReturnValue(mockQueryResult);

    const { result } = renderHook(() =>
      useGetSuperheroes({ page })
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it('should handle error state', () => {
    const page = 1;
    const error = new Error('Failed to fetch superheroes');
    const mockQueryResult = {
      data: null,
      isLoading: false,
      error,
      isFetching: false,
      isSuccess: false,
      isError: true,
    };

    useQuery.mockReturnValue(mockQueryResult);

    const { result } = renderHook(() =>
      useGetSuperheroes({ page })
    );

    expect(result.current.error).toEqual(error);
    expect(result.current.isError).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should maintain keepPreviousData configuration', () => {
    const page = 1;

    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    renderHook(() =>
      useGetSuperheroes({ page })
    );

    const useQueryCall = useQuery.mock.calls[0][0];
    expect(useQueryCall.keepPreviousData).toBe(true);
  });

  it('should create unique query keys for different page/limit combinations', () => {
    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    // First render with page 1, limit 5
    const { rerender } = renderHook(
      ({ page, limit }) => useGetSuperheroes({ page, limit }),
      { initialProps: { page: 1, limit: 5 } }
    );

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['superheroes', { page: 1, limit: 5 }],
      queryFn: expect.any(Function),
      keepPreviousData: true,
    });

    // Rerender with different parameters
    rerender({ page: 2, limit: 10 });

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['superheroes', { page: 2, limit: 10 }],
      queryFn: expect.any(Function),
      keepPreviousData: true,
    });
  });

  it('should handle missing page parameter gracefully', () => {
    const mockQueryResult = {
      data: null,
      isLoading: false,
      error: null,
    };

    useQuery.mockReturnValue(mockQueryResult);

    // Test with undefined page
    renderHook(() =>
      useGetSuperheroes({ page: undefined })
    );

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['superheroes', { page: undefined, limit: SUPERHEROES_LIMIT }],
      queryFn: expect.any(Function),
      keepPreviousData: true,
    });
  });

  it('should properly pass async function to queryFn', async () => {
    const page = 1;
    const limit = 5;
    const mockSuperheroesData = {
      superheroes: [{ id: '1', nickname: 'Test Hero' }],
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    };

    superheroApi.getAll.mockResolvedValue(mockSuperheroesData);

    let capturedQueryFn;
    useQuery.mockImplementation(({ queryFn }) => {
      capturedQueryFn = queryFn;
      return {
        data: null,
        isLoading: false,
        error: null,
      };
    });

    renderHook(() =>
      useGetSuperheroes({ page, limit })
    );

    // Test that the queryFn is async and returns the API result
    const result = await capturedQueryFn();
    expect(result).toEqual(mockSuperheroesData);
    expect(superheroApi.getAll).toHaveBeenCalledWith(page, limit);
  });
});
