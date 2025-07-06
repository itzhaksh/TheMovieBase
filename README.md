# MovieBase - Movie Catalog Application

MovieBase is a modern Single Page Application (SPA) for browsing and managing a catalog of movies. Built with React and Redux, it provides a seamless experience for movie enthusiasts to discover and explore films.

## Live Demo

Check out the live application at: [MovieBase](https://moviebasetmdb.netlify.app/)

## Features

- 🎬 Browse movies with detailed information
- 🔍 Search functionality with autocomplete
- 🌙 Dark mode support
- 📱 Fully responsive design
- 🎯 Advanced pagination
- 🎨 Modern UI with smooth animations
- 🔄 Real-time search suggestions
- 📊 Detailed movie information
- 🌐 Global state management with Redux

## Tech Stack

- React
- Redux
- React Router
- Tailwind CSS
- TMDB API
- Axios
- npm or yarn
- TMDB API key

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/itzhaksh/TheMovieBase.git
   cd moviebase
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your TMDB API key:
   ```
   REACT_APP_TMDB_TOKEN=your_tmdb_token
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Project Structure

```
moviebase/
├── public/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── store/         # Redux store configuration
│   ├── hooks/         # Custom hooks
│   ├── utils/         # Utility functions
│   ├── constans/     # Application constants
│   ├── routes/        # Route configurations
│   └── App.js         # Main application component
├── .env              # Environment variables
├── package.json      # Project dependencies
└── README.md         # Project documentation
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the API
- [Create React App](https://create-react-app.dev/) for the project setup
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework

