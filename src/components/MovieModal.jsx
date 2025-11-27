import { useEffect, useState } from "react";

const API_KEY = "63a51ad0";
const API_URL = "https://www.omdbapi.com/";

export default function MovieModal({ movieId, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * ВАЖНО: useEffect НЕ МОЖЕТ быть async функцией!
   * 
   * Почему?
   * - useEffect ожидает возврат либо undefined, либо cleanup-функции
   * - async функция всегда возвращает Promise
   * - Это нарушает контракт useEffect
   * 
   * Правильный подход:
   * 1. Создать async функцию ВНУТРИ useEffect
   * 2. Вызвать её сразу же
   * 3. Опционально вернуть cleanup-функцию
   */
  useEffect(() => {
    // Создаём AbortController для отмены запроса
    const abortController = new AbortController();

    /**
     * Асинхронная функция загрузки данных
     */
    async function loadMovieDetails() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_URL}?apikey=${API_KEY}&i=${movieId}&plot=full`,
          { signal: abortController.signal } // Добавляем возможность отмены
        );

        // Проверка статуса ответа
        if (!res.ok) {
          throw new Error(`HTTP ошибка: ${res.status}`);
        }

        const data = await res.json();

        // Проверка ответа от API
        if (data.Response === "False") {
          throw new Error(data.Error || "Данные не найдены");
        }

        setDetails(data);
      } catch (err) {
        // Игнорируем ошибку отмены запроса
        if (err.name !== "AbortError") {
          setError(err.message || "Ошибка загрузки данных");
          console.error("Ошибка загрузки деталей:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    // Запускаем загрузку
    loadMovieDetails();

    // Cleanup функция - выполнится при размонтировании
    return () => {
      abortController.abort(); // Отменяем запрос если компонент размонтирован
    };
  }, [movieId]); // Перезапускаем при изменении movieId

  /**
   * Обработчик клика по overlay (фону)
   */
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        {/* Кнопка закрытия */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* Состояние загрузки */}
        {loading && (
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Загрузка информации...</p>
          </div>
        )}

        {/* Состояние ошибки */}
        {error && !loading && (
          <div className="modal-error">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button onClick={onClose} className="button-primary">
              Закрыть
            </button>
          </div>
        )}

        {/* Отображение данных */}
        {details && !loading && !error && (
          <div className="modal-body">
            {/* Постер */}
            <div className="modal-poster">
              <img
                src={
                  details.Poster !== "N/A"
                    ? details.Poster
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={details.Title}
              />
            </div>

            {/* Информация */}
            <div className="modal-info">
              <h2>{details.Title}</h2>

              {/* Рейтинг и основные данные */}
              <div className="modal-meta">
                <span className="meta-item">⭐ {details.imdbRating}/10</span>
                <span className="meta-item">📅 {details.Year}</span>
                <span className="meta-item">⏱️ {details.Runtime}</span>
              </div>

              {/* Жанр и рейтинг */}
              <div className="modal-tags">
                <span className="tag tag-genre">{details.Genre}</span>
                <span className="tag tag-rated">{details.Rated}</span>
              </div>

              {/* Сюжет */}
              <div className="modal-section">
                <h3>📖 Сюжет</h3>
                <p>{details.Plot}</p>
              </div>

              {/* Дополнительная информация */}
              <div className="modal-details">
                <div className="detail-item">
                  <strong>Режиссёр:</strong>
                  <span>{details.Director}</span>
                </div>
                <div className="detail-item">
                  <strong>Актёры:</strong>
                  <span>{details.Actors}</span>
                </div>
                <div className="detail-item">
                  <strong>Страна:</strong>
                  <span>{details.Country}</span>
                </div>
                <div className="detail-item">
                  <strong>Язык:</strong>
                  <span>{details.Language}</span>
                </div>
                {details.Awards !== "N/A" && (
                  <div className="detail-item">
                    <strong>Награды:</strong>
                    <span>{details.Awards}</span>
                  </div>
                )}
                {details.BoxOffice && details.BoxOffice !== "N/A" && (
                  <div className="detail-item">
                    <strong>Кассовые сборы:</strong>
                    <span>{details.BoxOffice}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}