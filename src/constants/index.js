export const TEXT = {
  NO_MOVIES_FOUND: "No movies found.",
  MOVIE_DETAILS_NOT_FOUND: "Movie details not found.",
  NOT_AVAILABLE: "N/A",
  ERROR: "שגיאה",
  SEARCH_RESULTS: {
    NO_RESULTS: (query) => `No result found for '${query}'`,
    RESULTS: (query) => `Result for '${query}'`
  }
};

export const STYLES = {
  TEXT: {
    CENTERED: "text-center text-lg mt-8 text-gray-700 dark:text-gray-300",
    HEADING: "text-3xl font-bold text-gray-700 dark:text-white",
    SUBHEADING: "text-xl font-semibold text-gray-600 dark:text-gray-300",
    BODY: "text-base text-gray-600 dark:text-gray-400"
  }
};

export const FORMAT = {
  currency: (amount) => {
    if (amount === 0 || !amount) return TEXT.NOT_AVAILABLE;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  },
  
  runtime: (minutes) => {
    if (!minutes) return TEXT.NOT_AVAILABLE;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
}; 