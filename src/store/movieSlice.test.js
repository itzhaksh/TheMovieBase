import { configureStore } from '@reduxjs/toolkit';
import movieReducer, { 
  setCurrentPage, 
  toggleDarkMode, 
  fetchMovies, 
  fetchMovieDetails 
} from './movieSlice';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn()
}));

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      movies: movieReducer
    },
    preloadedState: {
      movies: {
        movies: [],
        selectedMovie: null,
        searchResults: [],
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 0,
        genres: [],
        darkMode: false,
        ...initialState
      }
    }
  });
};

describe('Movie Slice Tests', () => {
  test('initial state is correct', () => {
    const store = createTestStore();
    const state = store.getState();
    
    expect(state.movies.movies).toEqual([]);
    expect(state.movies.loading).toBe(false);
    expect(state.movies.error).toBeNull();
    expect(state.movies.currentPage).toBe(1);
    expect(state.movies.darkMode).toBe(false);
  });

  test('setCurrentPage action works', () => {
    const store = createTestStore();
    
    store.dispatch(setCurrentPage(3));
    
    const state = store.getState();
    expect(state.movies.currentPage).toBe(3);
  });

  test('toggleDarkMode action works', () => {
    const store = createTestStore();
    
    store.dispatch(toggleDarkMode());
    
    const state = store.getState();
    expect(state.movies.darkMode).toBe(true);
  });

  test('toggleDarkMode toggles correctly', () => {
    const store = createTestStore({ darkMode: true });
    
    store.dispatch(toggleDarkMode());
    
    const state = store.getState();
    expect(state.movies.darkMode).toBe(false);
  });
});

describe('Movie Slice Async Tests', () => {
  test('fetchMovies thunk works correctly', async () => {
    const mockMovies = [
      { id: 1, title: 'Movie 1' },
      { id: 2, title: 'Movie 2' }
    ];

    const { get } = require('axios');
    get.mockResolvedValueOnce({
      data: {
        results: mockMovies,
        total_pages: 1,
        page: 1
      }
    });

    const store = createTestStore();
    
    await store.dispatch(fetchMovies({ 
      apiPath: 'movie/popular', 
      page: 1, 
      perPage: 12 
    }));

    const state = store.getState();
    expect(state.movies.movies).toEqual(mockMovies);
    expect(state.movies.loading).toBe(false);
    expect(state.movies.error).toBeNull();
  });

  test('fetchMovieDetails thunk works correctly', async () => {
    const mockMovieDetails = {
      id: 123,
      title: 'Test Movie',
      overview: 'Test overview'
    };

    const { get } = require('axios');
    get.mockResolvedValueOnce({
      data: mockMovieDetails
    });

    const store = createTestStore();
    
    await store.dispatch(fetchMovieDetails(123));

    const state = store.getState();
    expect(state.movies.selectedMovie).toEqual(mockMovieDetails);
    expect(state.movies.loading).toBe(false);
    expect(state.movies.error).toBeNull();
  });

  test('API error handling works', async () => {
    const { get } = require('axios');
    get.mockRejectedValueOnce({
      response: { status: 401 }
    });

    const store = createTestStore();
    
    await store.dispatch(fetchMovies({ 
      apiPath: 'movie/popular', 
      page: 1, 
      perPage: 12 
    }));

    const state = store.getState();
    expect(state.movies.error).toBe('HTTP error! status: 401');
    expect(state.movies.loading).toBe(false);
    expect(state.movies.movies).toEqual([]);
  });

  test('loading state is set correctly during API calls', async () => {
    const { get } = require('axios');
    get.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    const store = createTestStore();
    
    const fetchPromise = store.dispatch(fetchMovies({ 
      apiPath: 'movie/popular', 
      page: 1, 
      perPage: 12 
    }));

    // Check loading state during the call
    let state = store.getState();
    expect(state.movies.loading).toBe(true);

    await fetchPromise;
    
    // Check loading state after the call
    state = store.getState();
    expect(state.movies.loading).toBe(false);
  });
}); 