import axios from 'axios';
import redis from '../../../utils/redis';
import AppError from '../../../utils/AppError';
import {
  MovieDTO,
  MovieDetailDTO,
  GenreDTO,
  MovieQueryParams,
  DateRangeParams,
  SearchResponseDTO
} from '../types/movies.types';

const api_key = process.env.TMDB_API_KEY;
const base_url = 'https://api.themoviedb.org/3';

/* =========================
   HELPER FUNCTIONS
========================= */

const getCacheKey = (prefix: string, ...args: (string | number)[]) =>
  `${prefix}:${args.join(':')}`;

const transformMovie = (movie: any): MovieDTO => ({
  id: movie.id,
  title: movie.title,
  poster_path: movie.poster_path,
  backdrop_path: movie.backdrop_path,
  overview: movie.overview,
  release_date: movie.release_date,
  vote_average: movie.vote_average,
  vote_count: movie.vote_count,
  genre_ids: movie.genre_ids,
  popularity: movie.popularity
});

const fetchMoviesFromTMDB = async (
  endpoint: string,
  page: number,
  limit: number
): Promise<MovieDTO[]> => {
  const response = await axios.get(`${base_url}${endpoint}`, {
    params: {
      api_key,
      language: 'en-US',
      page
    }
  });

  return response.data.results.slice(0, limit).map(transformMovie);
};

/* =========================
   REPOSITORY FUNCTIONS
========================= */

const getPopularMovies = async ({ page, limit }: MovieQueryParams): Promise<MovieDTO[]> => {
  try {
    const cacheKey = getCacheKey('popular_movies', 'page', page, 'limit', limit);

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const movies = await fetchMoviesFromTMDB('/movie/popular', page, limit);

    await redis.set(cacheKey, JSON.stringify(movies), { EX: 3600 });

    return movies;
  } catch (error) {
    throw new AppError('Failed to fetch popular movies', 500);
  }
};

const getTopRatedMovies = async ({ page, limit }: MovieQueryParams): Promise<MovieDTO[]> => {
  try {
    const cacheKey = getCacheKey('top_rated_movies', 'page', page, 'limit', limit);

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const movies = await fetchMoviesFromTMDB('/movie/top_rated', page, limit);

    await redis.set(cacheKey, JSON.stringify(movies), { EX: 3600 });

    return movies;
  } catch (error) {
    throw new AppError('Failed to fetch top rated movies', 500);
  }
};

const getUpcomingMovies = async ({ page, limit }: MovieQueryParams): Promise<MovieDTO[]> => {
  try {
    const cacheKey = getCacheKey('upcoming_movies', 'page', page, 'limit', limit);

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const movies = await fetchMoviesFromTMDB('/movie/upcoming', page, limit);

    await redis.set(cacheKey, JSON.stringify(movies), { EX: 3600 });

    return movies;
  } catch (error) {
    throw new AppError('Failed to fetch upcoming movies', 500);
  }
};

const getLatestMovies = async ({ page, limit }: MovieQueryParams): Promise<MovieDTO[]> => {
  try {
    const cacheKey = getCacheKey('latest_movies', 'page', page, 'limit', limit);

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Note: /movie/latest returns a single movie, not a list
    // Using now_playing instead for "latest" movies
    const movies = await fetchMoviesFromTMDB('/movie/now_playing', page, limit);

    await redis.set(cacheKey, JSON.stringify(movies), { EX: 3600 });

    return movies;
  } catch (error) {
    throw new AppError('Failed to fetch latest movies', 500);
  }
};

const getNowPlayingInTheaterMovies = async ({ page, limit }: MovieQueryParams): Promise<MovieDTO[]> => {
  try {
    const cacheKey = getCacheKey('now_playing_in_theater_movies', 'page', page, 'limit', limit);

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const movies = await fetchMoviesFromTMDB('/movie/now_playing', page, limit);

    await redis.set(cacheKey, JSON.stringify(movies), { EX: 3600 });

    return movies;
  } catch (error) {
    throw new AppError('Failed to fetch now playing movies', 500);
  }
};

const searchMovies = async (
  searchTerm: string,
  { page = 1, limit = 20 }: MovieQueryParams
): Promise<SearchResponseDTO> => {
  try {
    const normalizedTerm = searchTerm.toLowerCase().trim();
    const cacheKey = getCacheKey('search_movies', normalizedTerm, 'page', page, 'limit', limit);

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const response = await axios.get(`${base_url}/search/movie`, {
      params: {
        api_key,
        language: 'en-US',
        query: normalizedTerm,
        page
      }
    });

    const movies = response.data.results.slice(0, limit).map(transformMovie);
    
    const result: SearchResponseDTO = {
      movies,
      page: response.data.page,
      total_pages: response.data.total_pages,
      total_results: response.data.total_results
    };

    // Cache for 1 hour
    await redis.set(cacheKey, JSON.stringify(result), { EX: 3600 });

    return result;
  } catch (error) {
    throw new AppError('Failed to search movies', 500);
  }
};


const getMoviesDetails = async (movieId: string | number): Promise<MovieDetailDTO> => {
  try {
    const cacheKey = getCacheKey('movie_details', movieId);

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const response = await axios.get(`${base_url}/movie/${movieId}`, {
      params: {
        api_key,
        append_to_response: 'credits'
      }
    });

    const data = response.data;

    const movie: MovieDetailDTO = {
      id: data.id,
      imdb_id: data.imdb_id,
      title: data.title,
      tagline: data.tagline || '',
      overview: data.overview || '',
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      runtime: data.runtime || 0,
      status: data.status,
      adult: data.adult,
      vote_average: data.vote_average,
      vote_count: data.vote_count,
      release_date: data.release_date,
      budget: data.budget,
      revenue: data.revenue,
      popularity: data.popularity,
      genres: data.genres || [],
      credits: {
        cast: data.credits?.cast?.slice(0, 20).map((cast: any) => ({
          id: cast.id,
          name: cast.name,
          character: cast.character,
          profile_path: cast.profile_path,
          gender: cast.gender
        })) || []
      }
    };

    await redis.set(cacheKey, JSON.stringify(movie), { EX: 3600 });

    return movie;
  } catch (error) {
    throw new AppError('Failed to fetch movie details', 500);
  }
};

const getGenres = async (): Promise<GenreDTO[]> => {
  try {
    const cacheKey = 'genres_list';

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const response = await axios.get(`${base_url}/genre/movie/list`, {
      params: {
        api_key,
        language: 'en-US'
      }
    });

    const genres: GenreDTO[] = response.data.genres;

    await redis.set(cacheKey, JSON.stringify(genres), { EX: 86400 });

    return genres;
  } catch (error) {
    throw new AppError('Failed to fetch genres', 500);
  }
};

const getMoviesByGenre = async (
  genreId: string | number,
  { page = 1, limit = 20 }: MovieQueryParams
): Promise<MovieDTO[]> => {
  try {
    const cacheKey = getCacheKey('movies_genre', genreId, 'page', page, 'limit', limit);

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const response = await axios.get(`${base_url}/discover/movie`, {
      params: {
        api_key,
        with_genres: genreId,
        sort_by: 'popularity.desc',
        language: 'en-US',
        page
      }
    });

    const movies = response.data.results.slice(0, limit).map(transformMovie);

    await redis.set(cacheKey, JSON.stringify(movies), { EX: 3600 });

    return movies;
  } catch (error) {
    throw new AppError('Failed to fetch movies by genre', 500);
  }
};

const getMoviesByDateRange = async ({ startDate, endDate }: DateRangeParams): Promise<MovieDTO[]> => {
  try {
    const cacheKey = getCacheKey('movies_date', startDate, endDate);

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const response = await axios.get(`${base_url}/discover/movie`, {
      params: {
        api_key,
        language: 'en-US',
        sort_by: 'release_date.desc',
        'primary_release_date.gte': startDate,
        'primary_release_date.lte': endDate
      }
    });

    const movies = response.data.results.map(transformMovie);

    await redis.set(cacheKey, JSON.stringify(movies), { EX: 3600 });

    return movies;
  } catch (error) {
    throw new AppError('Failed to fetch movies by date range', 500);
  }
};

export const moviesRepository = {
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