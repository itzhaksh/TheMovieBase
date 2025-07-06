import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode, setCurrentPage } from '../store/movieSlice';
import SearchBar from './SearchBar';

const Header = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.movies.darkMode);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const handleMovieBaseClick = () => {
    if (showMobileSearch) {
      setShowMobileSearch(false);
    }
    dispatch(setCurrentPage(1));
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400" onClick={handleMovieBaseClick}>
            MovieBase
          </Link>

          {/* Search bar for larger screens (centered) */}
          <div className="hidden md:flex flex-grow justify-center">
            <div className="w-1/2 lg:w-1/3">
              <SearchBar />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search button for mobile (always in header) */}
            <button
              onClick={toggleSearch}
              className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              aria-label="Toggle search bar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        
        {/* Mobile search bar, visible when toggled */}
        {showMobileSearch && (
          <div className="md:hidden mt-4">
            <SearchBar />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
