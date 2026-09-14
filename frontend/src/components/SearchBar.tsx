import { useState, type ChangeEvent } from 'react';
import './SearchBar.css';

export const SearchBar = () => {
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
    console.log(`Szukam: ${playerName} #${tagLine} na serwerze ${region}`);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input name-input"
        placeholder="Game Name"
        value={playerName}
        onChange={handleNameChange}
      />
      
      <h1 style={{ color: '#d1a868', margin: 0 }}>#</h1>

      <input
        type="text"
        className="search-input tag-input"
        placeholder="TAG"
        value={tagLine}
        onChange={handleTagChange}
        maxLength={5}
      />

      {/* Zastąpiony select wersją z ramką menu */}
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
        <button type="button" className="search-submit-btn" onClick={handleSearch}>
        🔍
      </button>
    </div>
  );
};

export default SearchBar;