import { moviesRepository } from '../repositories/movies.repository';




const getPopularMovies = async (params: { page: number; limit: number }) => {
    return await moviesRepository.getPopularMovies(params);
};




const getTopRatedMovies = async (params: { page: number; limit: number }) => {
    return await moviesRepository.getTopRatedMovies(params);
};




const getUpcomingMovies = async (params: { page: number; limit: number }) => {
    return await moviesRepository.getUpcomingMovies(params);
};




const getLatestMovies = async (params: { page: number; limit: number }) => {
    return await moviesRepository.getLatestMovies(params);
};




const getNowPlayingInTheaterMovies = async (params: { page: number; limit: number }) => {
    return await moviesRepository.getNowPlayingInTheaterMovies(params);
};




const searchMovies = async (params: { searchTerm: string; page?: number; limit?: number }) => {
  return await moviesRepository.searchMovies(params.searchTerm, {
    page: params.page || 1,
    limit: params.limit || 20
  });
};




const getMoviesDetails = async (params: { movieId: string }) => {
    return await moviesRepository.getMoviesDetails(params.movieId);
};




const getGenres = async () => {
    return moviesRepository.getGenres();
};




const getMoviesByGenre = async (genreId: string, params: { page: number; limit: number }) => {
    return moviesRepository.getMoviesByGenre(genreId, params);
};




const getMoviesByDateRange = async (startDate: string, endDate: string) => {
    return moviesRepository.getMoviesByDateRange({ startDate, endDate });
};




export const moviesService = {
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getLatestMovies,
    getNowPlayingInTheaterMovies,
    searchMovies,
    getMoviesDetails,
    getGenres,
    getMoviesByGenre,
    getMoviesByDateRange
};