import { useState } from "react";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import MovieModal from "./components/MovieModal";
import "./App.css";

const API_KEY = "63a51ad0"; // Ваш API ключ
const API_URL = "https://www.omdbapi.com/";

export default function App() {
  // Состояния приложения
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Функция поиска фильмов
   * @param {string} query - поисковый запрос
   */
  async function searchMovies(query) {
    // Валидация пустого запроса
    if (!query.trim()) {
      setError("Введите название фильма");
      return;
    }

    // Сброс предыдущих результатов
    setLoading(true);
    setError("");
    setMovies([]);

    try {
      const res = await fetch(`${API_URL}?apikey=${API_KEY}&s=${query}`);

      // Проверка статуса ответа
      if (!res.ok) {
        throw new Error(`HTTP ошибка: ${res.status}`);
      }

      const data = await res.json();

      // Обработка ответа от API
      if (data.Response === "False") {
        setError(data.Error || "Фильмы не найдены");
        setMovies([]);
      } else {
        setMovies(data.Search || []);
      }
    } catch (err) {
      setError(err.message || "Ошибка загрузки данных");
      console.error("Ошибка поиска:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      {/* Заголовок приложения */}
      <header className="app-header">
        <h1>🎬 Поиск фильмов</h1>
        <p>Найдите любой фильм из базы OMDB</p>
      </header>

      {/* Поисковая строка */}
      <SearchBar onSearch={searchMovies} isLoading={loading} />

      {/* Индикатор загрузки */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Загрузка фильмов...</p>
        </div>
      )}

      {/* Отображение ошибки */}
      {error && !loading && (
        <div className="error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Список найденных фильмов */}
      {!loading && !error && movies.length > 0 && (
        <>
          <div className="results-count">
            Найдено фильмов: <strong>{movies.length}</strong>
          </div>
          <MovieList movies={movies} onSelect={setSelectedMovie} />
        </>
      )}

      {/* Пустое состояние */}
      {!loading && !error && movies.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🎥</span>
          <h2>Начните поиск</h2>
          <p>Введите название фильма в поисковую строку</p>
        </div>
      )}

      {/* Модальное окно с деталями */}
      {selectedMovie && (
        <MovieModal
          movieId={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}