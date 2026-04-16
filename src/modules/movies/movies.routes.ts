import express from 'express';
import * as moviesController from './controllers/movies.controller';

const router = express.Router();

router.get('/popular', moviesController.getPopularMovies);
router.get('/top-rated', moviesController.getTopRatedMovies);
router.get('/upcoming', moviesController.getUpcomingMovies);
router.get('/latest', moviesController.getLatestMovies);
router.get('/now-playing', moviesController.getNowPlayingMovies);
router.get('/search', moviesController.searchMovies);
router.get('/genres', moviesController.getGenres);
router.get('/genre/:genreId', moviesController.getMoviesByGenre);
router.get('/date-range', moviesController.getMoviesByDateRange);
router.get('/:id', moviesController.getMovieDetails);

export default router;