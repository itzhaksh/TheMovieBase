import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import NoImage from '../assets/no_image_available.jpg';
import { GENRES } from '../constants/genres';

const MovieCard = ({ movie }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : NoImage;

  const getGenreName = (genreId) => GENRES[genreId] || 'Unknown';

  return (
    <Link to={`/movie/${movie.id}`} className="w-full min-w-0">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 flex flex-col h-full">
        <div className="relative aspect-[2/3]">
          <img
            src={imageUrl}
            alt={movie.title || 'No Image Available'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = NoImage;
            }}
          />
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            {movie.vote_average ? movie.vote_average.toFixed(1) + ' ★' : 'N/A'}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-900 dark:text-white">
            {movie.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
          </p>
          {movie.genre_ids && movie.genre_ids.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {movie.genre_ids.slice(0, 2).map((genreId) => (
                <span
                  key={genreId}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                >
                  {getGenreName(genreId)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    vote_average: PropTypes.number,
    release_date: PropTypes.string,
    genre_ids: PropTypes.arrayOf(PropTypes.number)
  }).isRequired
};

export default MovieCard; 