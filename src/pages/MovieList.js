import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { fetchMovies, setCurrentPage } from '../store/movieSlice';
import { useDispatch, useSelector } from 'react-redux';
import MovieCard from '../components/MovieCard';

const MovieList = ({ title = "Movies", apiPath, isSearchPage = false }) => {
  const [searchParams] = useSearchParams();
  const [pageInput, setPageInput] = useState('');
  const dispatch = useDispatch();
  const { movies, loading, error, currentPage, totalPages } = useSelector((state) => state.movies);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentQuery = params.get('query');

    if (isSearchPage) {
      document.title = `Search Results${currentQuery ? ` for ${currentQuery}` : ''} - MovieBase`;
    } else if (apiPath === "movie/popular") {
      document.title = "MovieBase";
    } else if (title) {
      document.title = `${title} - MovieBase`;
    } else {
      document.title = "MovieBase";
    }
  }, [isSearchPage, title, apiPath, searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryForFetch = params.get('query');
    dispatch(fetchMovies({ apiPath, query: queryForFetch, page: currentPage, perPage: 12 }));
  }, [dispatch, apiPath, currentPage, searchParams]);

  const handlePageChange = (newPage) => {
    // TMDB API has a limit of 500 pages
    const maxPages = Math.min(totalPages, 500);
    if (newPage >= 1 && newPage <= maxPages) {
      dispatch(setCurrentPage(newPage));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const page = parseInt(pageInput);
    // TMDB API has a limit of 500 pages
    const maxPages = Math.min(totalPages, 500);
    if (page && page >= 1 && page <= maxPages) {
      handlePageChange(page);
      setPageInput('');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500" role="status" aria-label="Loading"></div>
    </div>
  );
  
  if (error) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="text-red-500 text-xl" data-testid="error-message">Error: {error}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {isSearchPage && movies.length === 0 && (
        <div className="text-center text-3xl font-bold text-black dark:text-white mb-8">
          Movie not found
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-4">
        {movies.map((movie, index) => (
          <div 
            key={movie.id} 
            className={`w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]`}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center mt-8 space-y-4">
          <div className="flex flex-wrap justify-center items-center gap-2 px-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-1.5 py-1 text-xs md:px-3 md:py-1 md:text-sm rounded bg-gray-800 text-white disabled:opacity-50"
            >
              Prev
            </button>
            
            {/* First page */}
            <button
              onClick={() => handlePageChange(1)}
              className={`px-2 py-1 text-sm md:px-3 md:py-1 md:text-base rounded ${
                currentPage === 1 ? 'bg-blue-600' : 'bg-gray-800'
              } text-white`}
            >
              1
            </button>

            {/* Show ellipsis if current page is far from start */}
            {currentPage > 3 && (
              <span className="text-white text-sm md:text-base">...</span>
            )}

            {/* Previous page */}
            {currentPage > 2 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-2 py-1 text-sm md:px-3 md:py-1 md:text-base rounded bg-gray-800 text-white"
              >
                {currentPage - 1}
              </button>
            )}

            {/* Current page */}
            {currentPage !== 1 && currentPage !== totalPages && (
              <button
                onClick={() => handlePageChange(currentPage)}
                className="px-2 py-1 text-sm md:px-3 md:py-1 md:text-base rounded bg-blue-600 text-white"
              >
                {currentPage}
              </button>
            )}

            {/* Next page */}
            {currentPage < totalPages - 1 && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-2 py-1 text-sm md:px-3 md:py-1 md:text-base rounded bg-gray-800 text-white"
              >
                {currentPage + 1}
              </button>
            )}

            {/* Show ellipsis if current page is far from end */}
            {currentPage < totalPages - 2 && (
              <span className="text-white text-sm md:text-base">...</span>
            )}

            {/* Last page */}
            {totalPages > 1 && (
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`px-2 py-1 text-sm md:px-3 md:py-1 md:text-base rounded ${
                  currentPage === totalPages ? 'bg-blue-600' : 'bg-gray-800'
                } text-white`}
              >
                {totalPages}
              </button>
            )}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-1.5 py-1 text-xs md:px-3 md:py-1 md:text-sm rounded bg-gray-800 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Page Input */}
          <form onSubmit={handlePageInputSubmit} className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder="Go to page"
              className="w-24 px-2 py-1 text-sm md:w-32 md:px-3 md:py-1 md:text-base rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="px-3 py-1 text-sm md:px-4 md:py-1 md:text-base rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Go
            </button>
          </form>

          <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieList; 