import { useState } from "react";

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState("");

  /**
   * Обработчик отправки формы
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    if (query.trim()) {
      onSearch(query);
    }
  };

  /**
   * Обработчик нажатия кнопки поиска
   */
  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Введите название фильма..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          className="search-input"
        />

        <button
          type="button"
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          className="search-button"
        >
          {isLoading ? "⏳" : "🔍"} Найти
        </button>
      </form>
    </div>
  );
}