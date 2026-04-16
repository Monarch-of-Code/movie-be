1. Search Movies by Name:
https://api.themoviedb.org/3/search/movie?api_key=b9a5b305518c1bdb66af5f4a6fe0cd49&query={{ $json.q }}

2. Get Movie Details:
https://api.themoviedb.org/3/movie/{{ $json.movie_id }}?api_key=b9a5b305518c1bdb66af5f4a6fe0cd49

3. Optional: Append credits for cast info:
https://api.themoviedb.org/3/movie/{{ $json.movie_id }}?api_key=b9a5b305518c1bdb66af5f4a6fe0cd49&append_to_response=credits

4. Popular Movies:
https://api.themoviedb.org/3/movie/popular?api_key=b9a5b305518c1bdb66af5f4a6fe0cd49&language=en-US&page=1

5. Top Rated Movies:
https://api.themoviedb.org/3/movie/top_rated?api_key=b9a5b305518c1bdb66af5f4a6fe0cd49&language=en-US&page=1

6. Upcoming Movies:
https://api.themoviedb.org/3/movie/upcoming?api_key=b9a5b305518c1bdb66af5f4a6fe0cd49&language=en-US&page=1

7. Latest Movie:
https://api.themoviedb.org/3/movie/latest?api_key=b9a5b305518c1bdb66af5f4a6fe0cd49

8. Now Playing in Theaters:
https://api.themoviedb.org/3/movie/now_playing?api_key=b9a5b305518c1bdb66af5f4a6fe0cd49&language=en-US&page=1&region=US

9. Movies by Genre:
  Get all genres:
  https://api.themoviedb.org/3/genre/movie/list?api_key=b9a5b305518c1bdb66af5f4a6fe0cd49&language=en-US
  
  Discover movies by genre ID:
  https://api.themoviedb.org/3/discover/movie?api_key=b9a5b305518c1bdb66af5f4a6fe0cd49&with_genres={{ $json.genre_id }}&sort_by=popularity.desc

10. Movie Recommendations:
https://api.themoviedb.org/3/movie/{{ $json.movie_id }}/recommendations?api_key=b9a5b305518c1bdb66af5f4a6fe0cd49&language=en-US&page=1

11. Discover Movies by Filters:
https://api.themoviedb.org/3/discover/movie?api_key=b9a5b305518c1bdb66af5f4a6fe0cd49&language=en-US&sort_by=release_date.desc&primary_release_date.gte={{ $json.start_date }}&primary_release_date.lte={{ $json.end_date }}
