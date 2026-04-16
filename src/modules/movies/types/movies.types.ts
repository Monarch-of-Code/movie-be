export interface MovieDTO {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
  release_date: string;
  vote_average: number;
  vote_count?: number;
  genre_ids?: number[];
  genre?: number[];
  popularity?: number;
}

export interface GenreDTO {
  id: number;
  name: string;
}

export interface CastMemberDTO {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  gender: number;
}

export interface MovieDetailDTO {
  id: number;
  imdb_id: string;
  title: string;
  tagline: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  runtime: number;
  status: string;
  adult: boolean;
  vote_average: number;
  vote_count?: number;
  release_date: string;
  genres: GenreDTO[];
  budget?: number;
  revenue?: number;
  popularity?: number;
  credits: {
    cast: CastMemberDTO[];
  };
}

export interface MovieQueryParams {
  page: number;
  limit: number;
}

export interface DateRangeParams {
  startDate: string;
  endDate: string;
}


export interface SearchResponseDTO {
  movies: MovieDTO[];
  page: number;
  total_pages: number;
  total_results: number;
}