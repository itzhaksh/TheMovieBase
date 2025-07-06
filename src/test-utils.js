import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import movieReducer from './store/movieSlice';

// Create a test store
export const createTestStore = (initialState = {}) => {
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

// Test wrapper component with router
export const TestWrapper = ({ children, initialState = {} }) => {
  const store = createTestStore(initialState);
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

// Test wrapper component without router
export const TestWrapperWithoutRouter = ({ children, initialState = {} }) => {
  const store = createTestStore(initialState);
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}; 