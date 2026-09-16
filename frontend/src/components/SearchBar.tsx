import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

export const SearchBar = () => {
  const navigate = useNavigate();

  const [region, setRegion] = useState<string>('EUNE');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>('');
  const [tagLine, setTagLine] = useState<string>('');

  const regions = ['EUNE', 'EUW', 'NA', 'KR'];

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagLine(e.target.value);
  };

  const handleSearch = () => {
    const trimmedPlayerName = playerName.trim();
    const trimmedTagLine = tagLine.trim();

    if (!trimmedPlayerName || !trimmedTagLine) return;

    navigate(
      `/${encodeURIComponent(trimmedPlayerName)}/${encodeURIComponent(trimmedTagLine)}/${region}`
    );
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
      />

      <div className="region-dropdown">
        <button
          type="button"
          className="region-select-btn"
          onClick={() => setIsOpen(!isOpen)}
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
      >
        🔍
      </button>
    </div>
  );
};

export default SearchBar;