export default function MovieCard({ movie, onSelect }) {
  /**
   * Обработчик клика по карточке
   */
  const handleClick = () => {
    onSelect(movie.imdbID);
  };

  /**
   * Обработчик ошибки загрузки изображения
   */
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      {/* Постер фильма */}
      <div className="movie-poster">
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}
          alt={movie.Title}
          onError={handleImageError}
        />
        {/* Тип контента (фильм/сериал) */}
        <span className="movie-type">{movie.Type}</span>
      </div>

      {/* Информация о фильме */}
      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        <p className="movie-year">📅 {movie.Year}</p>
      </div>
    </div>
  );
}