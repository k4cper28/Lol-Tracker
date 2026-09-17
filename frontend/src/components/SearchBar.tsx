import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

interface SearchBarProps {
  onError?: (msg: string) => void;
}

export const SearchBar = ({ onError }: SearchBarProps) => {
  const navigate = useNavigate();

  const [region, setRegion] = useState<string>('EUNE');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>('');
  const [tagLine, setTagLine] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const regions = ['EUNE', 'EUW', 'NA', 'KR'];

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagLine(e.target.value);
  };

  const handleSearch = async () => {
    if (isLoading) return;

    const trimmedPlayerName = playerName.trim();
    const trimmedTagLine = tagLine.trim().replace(/^#/, '');

    if (!trimmedPlayerName || !trimmedTagLine) {
      onError?.('Wprowadź Game Name oraz TAG');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Sprawdzamy, czy gracz faktycznie istnieje w API
      const res = await fetch(
        `http://localhost:8080/api/players/${encodeURIComponent(trimmedPlayerName)}/${encodeURIComponent(trimmedTagLine)}`
      );

      if (!res.ok) {
        throw new Error('Gracz nie istnieje');
      }

      // 2. Gracz znaleziony -> dopiero teraz przekierowujemy
      navigate(
        `/${encodeURIComponent(trimmedPlayerName)}/${encodeURIComponent(trimmedTagLine)}/${region}`
      );
    } catch {
      // 3. W razie błędu zostajemy na stronie głównej i wywołujemy toast
      onError?.(`Nie znaleziono gracza ${trimmedPlayerName}#${trimmedTagLine}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input name-input"
        placeholder="Game Name"
        value={playerName}
        onChange={handleNameChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />

      <h1 style={{ color: '#d1a868', margin: 0 }}>#</h1>

      <input
        type="text"
        className="search-input tag-input"
        placeholder="TAG"
        value={tagLine}
        onChange={handleTagChange}
        onKeyDown={handleKeyDown}
        maxLength={5}
        disabled={isLoading}
      />

      <div className="region-dropdown">
        <button
          type="button"
          className="region-select-btn"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
        >
          {region}
        </button>

        {isOpen && (
          <ul className="region-menu">
            {regions.map((reg) => (
              <li
                key={reg}
                className="region-option"
                onClick={() => {
                  setRegion(reg);
                  setIsOpen(false);
                }}
              >
                {reg}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        className="search-submit-btn"
        onClick={handleSearch}
        disabled={isLoading}
      >
        {isLoading ? '⏳' : '🔍'}
      </button>
    </div>
  );
};

export default SearchBar;