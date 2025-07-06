import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import Header from "./components/Header";
import MovieList from "./pages/MovieList";
import MovieDetail from "./pages/MovieDetail";
import PageNotFound from "./pages/PageNotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <div className="App bg-white dark:bg-gray-900 min-h-screen">
      <Router>
        <ScrollToTop />
        <ErrorBoundary>
          <Header />

          {/* Removed Search bar for larger screens (below header) */}
          {/* 
          <div className="hidden md:flex justify-center my-6">
            <div className="w-full max-w-xl">
              <SearchBar />
            </div>
          </div>
           */}

          <Routes>
            <Route path="/" element={<MovieList apiPath="movie/popular" />} />
            <Route path="movie/:id" element={<MovieDetail />} />
            <Route path="/search" element={<MovieList apiPath="search/movie" isSearchPage={true} />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </div>
  );
}

export default App;
