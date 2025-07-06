import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import SearchBar from './SearchBar';
import axios from 'axios';
import { TestWrapper, TestWrapperWithoutRouter } from '../test-utils';

// Mock axios
jest.mock('axios');

describe('SearchBar Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search input and button', () => {
    render(
      <TestWrapper>
        <SearchBar />
      </TestWrapper>
    );
    const searchInput = screen.getByPlaceholderText(/Search movies/i);
    const searchButton = screen.getByText(/Search/i);
    
    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test('search functionality works', async () => {
    const mockMovies = [
      { id: 1, title: 'Test Movie 1', poster_path: '/test1.jpg' },
      { id: 2, title: 'Test Movie 2', poster_path: '/test2.jpg' }
    ];

    axios.get.mockResolvedValueOnce({
      data: {
        results: mockMovies,
        total_pages: 1,
        page: 1
      }
    });

    render(
      <TestWrapperWithoutRouter>
        <App />
      </TestWrapperWithoutRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search movies/i);
    const searchButton = screen.getByText(/Search/i);

    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/search/movie'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Bearer')
          })
        })
      );
    });
  });

  test('handles empty search input', () => {
    render(
      <TestWrapper>
        <SearchBar />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/Search movies/i);
    const searchButton = screen.getByText(/Search/i);

    fireEvent.change(searchInput, { target: { value: '' } });
    fireEvent.click(searchButton);

    // Should not make API call for empty search
    expect(axios.get).not.toHaveBeenCalled();
  });
}); 