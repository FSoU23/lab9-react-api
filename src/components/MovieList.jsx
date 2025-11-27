import MovieCard from "./MovieCard";

export default function MovieList({ movies, onSelect }) {
  // Проверка на пустой массив
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}