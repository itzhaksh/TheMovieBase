import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router';
import '@testing-library/jest-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import MovieDetail from './pages/MovieDetail';
import MovieList from './pages/MovieList';
import axios from 'axios';
import { TestWrapper, TestWrapperWithoutRouter, createTestStore } from './test-utils';

// Mock axios
jest.mock('axios');

const TestWrapperWithRouter = ({ children, initialState = {}, initialEntries = ['/'] }) => {
  const store = createTestStore(initialState);
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    </Provider>
  );
};

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders main app structure', () => {
    render(
      <TestWrapperWithoutRouter>
        <App />
      </TestWrapperWithoutRouter>
    );
    
    // Check main app elements
    expect(screen.getByText(/MovieBase/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search movies/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Toggle dark mode/i)).toBeInTheDocument();
  });

  test('shows loading spinner when loading', () => {
    render(
      <TestWrapperWithoutRouter initialState={{ loading: true }}>
        <App />
      </TestWrapperWithoutRouter>
    );
    const loadingSpinner = screen.getByRole('status', { hidden: true });
    expect(loadingSpinner).toBeInTheDocument();
  });

  test('error boundary works correctly', () => {
    render(
      <TestWrapperWithoutRouter>
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      </TestWrapperWithoutRouter>
    );
    
    const errorBoundary = screen.queryByTestId('error-boundary-message');
    expect(errorBoundary).not.toBeInTheDocument();
  });

  test('renders error boundary when component throws error', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <TestWrapperWithoutRouter>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </TestWrapperWithoutRouter>
    );

    expect(screen.getByTestId('error-boundary-message')).toBeInTheDocument();
  });
});

describe('App Routing Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('pagination works correctly', async () => {
    const mockMoviesPage1 = [
      { id: 1, title: 'Movie 1', poster_path: '/movie1.jpg' },
      { id: 2, title: 'Movie 2', poster_path: '/movie2.jpg' }
    ];
    const mockMoviesPage2 = [
      { id: 21, title: 'Movie 21', poster_path: '/movie21.jpg' },
      { id: 22, title: 'Movie 22', poster_path: '/movie22.jpg' }
    ];

    axios.get.mockResolvedValueOnce({
      data: {
        results: mockMoviesPage1,
        total_pages: 5,
        page: 1
      }
    });
    axios.get.mockResolvedValueOnce({
      data: {
        results: mockMoviesPage2,
        total_pages: 5,
        page: 2
      }
    });

    await act(async () => {
      render(
        <TestWrapperWithRouter initialEntries={['/?page=1']}>
          <Routes>
            <Route path="/" element={<MovieList />} />
          </Routes>
        </TestWrapperWithRouter>
      );
    });

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    const nextButton = screen.getByText('Next');
    await act(async () => {
      fireEvent.click(nextButton);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      );
    });
  });

  test('movie details page loads correctly', async () => {
    const mockMovieDetails = {
      id: 123,
      title: 'Test Movie',
      overview: 'Test overview',
      poster_path: '/test-poster.jpg',
      release_date: '2023-01-01',
      vote_average: 8.5
    };

    axios.get.mockResolvedValueOnce({
      data: mockMovieDetails
    });

    await act(async () => {
      render(
        <TestWrapperWithRouter initialEntries={['/movie/123']}>
          <Routes>
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Routes>
        </TestWrapperWithRouter>
      );
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/movie/123'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Bearer')
          })
        })
      );
    });
  });
});

describe('App Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('main app has proper accessibility features', () => {
    render(
      <TestWrapperWithoutRouter>
        <App />
      </TestWrapperWithoutRouter>
    );

    // Check accessibility features
    expect(screen.getByLabelText(/Search movies/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Toggle dark mode/i)).toBeInTheDocument();
  });

  test('loading spinner has proper role', () => {
    render(
      <TestWrapperWithoutRouter initialState={{ loading: true }}>
        <App />
      </TestWrapperWithoutRouter>
    );

    const loadingSpinner = screen.getByRole('status');
    expect(loadingSpinner).toBeInTheDocument();
  });
});
