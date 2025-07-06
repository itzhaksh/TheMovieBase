import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk for fetching movies
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ apiPath, query, page = 1, perPage = 18 }, { rejectWithValue }) => {
    try {
      // Ensure page is not greater than 500 (TMDB API limit)
      const validPage = Math.min(page, 500);
      const url = query
        ? `https://api.themoviedb.org/3/${apiPath}?query=${encodeURIComponent(query)}&page=${validPage}`
        : `https://api.themoviedb.org/3/${apiPath}?page=${validPage}`;
      let token = process.env.REACT_APP_TMDB_TOKEN;
      if (!token) {
        console.warn('REACT_APP_TMDB_TOKEN is missing or undefined!');
        token = '';
      }
      token = token.trim();
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json'
      };
      const tokenPreview = token ? token.slice(0, 6) + '...' + token.slice(-6) : 'undefined';
      console.log('[TMDB axios]', { url, tokenPreview, headers });
      const response = await axios.get(url, { headers });
      const data = response.data;
      // Limit the number of results per page
      const limitedResults = data.results.slice(0, perPage);
      return {
        results: limitedResults,
        totalPages: Math.min(data.total_pages, 500), // Limit total pages to 500
        currentPage: data.page
      };
    } catch (error) {
      if (error.response) {
        return rejectWithValue(`HTTP error! status: ${error.response.status}`);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk for fetching movie details
export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (id, { rejectWithValue }) => {
    try {
      let token = process.env.REACT_APP_TMDB_TOKEN;
      if (!token) {
        console.warn('REACT_APP_TMDB_TOKEN is missing or undefined!');
        token = '';
      }
      token = token.trim();
      const headers = {
        Authorization: `Bearer ${token}`,
        accept: 'application/json'
      };
      const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=credits`;
      const tokenPreview = token ? token.slice(0, 6) + '...' + token.slice(-6) : 'undefined';
      console.log('[TMDB axios]', { url, tokenPreview, headers });
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(`HTTP error! status: ${error.response.status}`);
      }
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  movies: [],
  selectedMovie: null,
  searchResults: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  genres: [],
  darkMode: localStorage.getItem('darkMode') === 'true'
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setMovies: (state, action) => {
      state.movies = action.payload;
      state.error = null;
    },
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
      state.error = null;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setGenres: (state, action) => {
      state.genres = action.payload;
      state.error = null;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.results;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.movies = [];
      })
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedMovie = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedMovie = null;
      });
  },
});

export const {
  setMovies,
  setSelectedMovie,
  setSearchResults,
  setLoading,
  setError,
  setCurrentPage,
  setTotalPages,
  setGenres,
  toggleDarkMode,
  clearError
} = movieSlice.actions;

export default movieSlice.reducer; 
