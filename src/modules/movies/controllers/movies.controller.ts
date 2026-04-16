import { Request, Response, NextFunction } from 'express';
import { moviesRepository } from '../repositories/movies.repository';
import AppError from '../../../utils/AppError';

const handleSuccess = (res: Response, data: any, message: string = 'Success') => {
res.status(200).json({
    success: true,
    message,
    data
});
};

export const getPopularMovies = async (
req: Request,
res: Response,
next: NextFunction
) => {
try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const movies = await moviesRepository.getPopularMovies({ page, limit });
    handleSuccess(res, { movies }, 'Popular movies fetched successfully');
} catch (error) {
    next(error);
}
};

export const getTopRatedMovies = async (
req: Request,
res: Response,
next: NextFunction
) => {
try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const movies = await moviesRepository.getTopRatedMovies({ page, limit });
    handleSuccess(res, { movies }, 'Top rated movies fetched successfully');
} catch (error) {
    next(error);
}
};

export const getUpcomingMovies = async (
req: Request,
res: Response,
next: NextFunction
) => {
try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const movies = await moviesRepository.getUpcomingMovies({ page, limit });
    handleSuccess(res, { movies }, 'Upcoming movies fetched successfully');
} catch (error) {
    next(error);
}
};

export const getLatestMovies = async (
req: Request,
res: Response,
next: NextFunction
) => {
try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const movies = await moviesRepository.getLatestMovies({ page, limit });
    handleSuccess(res, { movies }, 'Latest movies fetched successfully');
} catch (error) {
    next(error);
}
};

export const getNowPlayingMovies = async (
req: Request,
res: Response,
next: NextFunction
) => {
try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const movies = await moviesRepository.getNowPlayingInTheaterMovies({ page, limit });
    handleSuccess(res, { movies }, 'Now playing movies fetched successfully');
} catch (error) {
    next(error);
}
};

export const searchMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!query) {
      throw new AppError('Search query is required', 400);
    }

    const result = await moviesRepository.searchMovies(query, { page, limit });
    handleSuccess(res, result, 'Movies search completed successfully');
  } catch (error) {
    next(error);
  }
};

export const getMovieDetails = async (
req: Request,
res: Response,
next: NextFunction
) => {
try {
    const  id  = req.params.id as string;

    const movie = await moviesRepository.getMoviesDetails(id);
    handleSuccess(res, movie, 'Movie details fetched successfully');
} catch (error) {
    next(error);
}
};

export const getGenres = async (
req: Request,
res: Response,
next: NextFunction
) => {
try {
    const genres = await moviesRepository.getGenres();
    handleSuccess(res, { genres }, 'Genres fetched successfully');
} catch (error) {
    next(error);
}
};

export const getMoviesByGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const genreId = Array.isArray(req.params.genreId) ? req.params.genreId[0] : req.params.genreId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const movies = await moviesRepository.getMoviesByGenre(genreId, { page, limit });
    handleSuccess(res, { movies }, 'Movies by genre fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const getMoviesByDateRange = async (
req: Request,
res: Response,
next: NextFunction
) => {
try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
    throw new AppError('startDate and endDate are required', 400);
    }

    const movies = await moviesRepository.getMoviesByDateRange({
    startDate: startDate as string,
    endDate: endDate as string
    });

    handleSuccess(res, { movies }, 'Movies by date range fetched successfully');
} catch (error) {
    next(error);
}
};