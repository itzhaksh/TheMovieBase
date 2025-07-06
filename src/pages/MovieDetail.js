import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetails } from '../store/movieSlice';
import NoImage from '../assets/no_image_available.jpg';

const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedMovie, loading, error } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMovieDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedMovie && selectedMovie.title) {
      document.title = selectedMovie.title + " - MovieBase";
    } else {
      document.title = "MovieBase";
    }
  }, [selectedMovie]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500" role="status" aria-label="Loading"></div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="text-red-500 text-xl" data-testid="error-message">
        {error && error.includes('404') ? 'Movie not found' : `Error: ${error}`}
      </div>
      <Link to="/" className="mt-4 inline-block text-blue-500 hover:text-blue-600">
        Return to Home
      </Link>
    </div>
  );

  if (!selectedMovie) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="text-xl">Movie not found</div>
      <Link to="/" className="mt-4 inline-block text-blue-500 hover:text-blue-600">
        Return to Home
      </Link>
    </div>
  );

  const formatRuntime = (minutes) => {
    if (!minutes || minutes === 0) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatBudget = (budget) => {
    if (!budget || budget === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(budget);
  };

  const backdropUrl = selectedMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`
    : NoImage;

  const posterUrl = selectedMovie.poster_path
    ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
    : NoImage;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Backdrop Image */}
        <div className="relative h-96 md:h-[500px]">
          <img
            src={backdropUrl}
            alt={selectedMovie.title || 'No Image Available'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{selectedMovie.title || 'N/A'}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span>{selectedMovie.release_date ? new Date(selectedMovie.release_date).getFullYear() : 'N/A'}</span>
              <span>•</span>
              <span>{formatRuntime(selectedMovie.runtime)}</span>
              <span>•</span>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{selectedMovie.vote_average ? selectedMovie.vote_average.toFixed(1) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <img
                src={posterUrl}
                alt={selectedMovie.title || 'No Image Available'}
                className="w-full rounded-lg shadow-lg aspect-[2/3] object-cover"
              />
            </div>

            {/* Movie Details */}
            <div className="w-full md:w-2/3">
              {/* Tagline */}
              {selectedMovie.tagline && selectedMovie.tagline.trim() !== '' && (
                <p className="text-xl italic text-gray-600 dark:text-gray-400 mb-4">
                  "{selectedMovie.tagline}"
                </p>
              )}

              {/* Overview */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300">{selectedMovie.overview || 'No overview available.'}</p>
              </div>

              {/* Genres */}
              {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Genres</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Details</h2>
                  <div className="space-y-2">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">Status:</span> {selectedMovie.status || 'N/A'}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">Original Language:</span>{' '}
                      {(selectedMovie.original_language && selectedMovie.original_language.toUpperCase()) || 'N/A'}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">Budget:</span> {formatBudget(selectedMovie.budget)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">Revenue:</span> {formatBudget(selectedMovie.revenue)}
                    </p>
                  </div>
                </div>

                {/* Production Companies */}
                {selectedMovie.production_companies && selectedMovie.production_companies.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                      Production Companies
                    </h2>
                    <div className="space-y-2">
                      {selectedMovie.production_companies.map((company) => (
                        <p key={company.id} className="text-gray-700 dark:text-gray-300">
                          {company.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail; 