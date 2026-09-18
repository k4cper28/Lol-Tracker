import { useState, useEffect, useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

interface SearchBarProps {
  onError?: (msg: string) => void;
}

interface PlayerSuggestion {
  gameName: string;
  tagLine: string;
  profileIcon?: number;
  summonerLevel?: number;
}

export const SearchBar = ({ onError }: SearchBarProps) => {
  const navigate = useNavigate();

  const [region, setRegion] = useState<string>('EUNE');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>('');
  const [tagLine, setTagLine] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Stan dla podpowiedzi z bazy
  const [suggestions, setSuggestions] = useState<PlayerSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const isSelectingRef = useRef<boolean>(false);

  const regions = ['EUNE', 'EUW', 'NA', 'KR'];

  // Pobieranie podpowiedzi z backendu (debounce 250ms)
  useEffect(() => {
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    const query = playerName.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`http://localhost:8080/api/players/search?query=${encodeURIComponent(query)}`)
        .then((res) => {
          if (!res.ok) throw new Error('Błąd wyszukiwania');
          return res.json();
        })
        .then((data: PlayerSuggestion[]) => {
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        })
        .catch(() => {
          setSuggestions([]);
          setShowSuggestions(false);
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [playerName]);

  // Zamykanie listy po kliknięciu poza SearchBar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagLine(e.target.value);
  };

  const handleSelectSuggestion = (player: PlayerSuggestion) => {
    isSelectingRef.current = true;
    setPlayerName(player.gameName);
    setTagLine(player.tagLine);
    setSuggestions([]);
    setShowSuggestions(false);

    nameInputRef.current?.blur();

    navigate(
      `/${encodeURIComponent(player.gameName)}/${encodeURIComponent(player.tagLine)}/${region}`
    );
  };

  const handleSearch = async () => {
    if (isLoading) return;

    setShowSuggestions(false);
    const trimmedPlayerName = playerName.trim();
    const trimmedTagLine = tagLine.trim().replace(/^#/, '');

    if (!trimmedPlayerName || !trimmedTagLine) {
      onError?.('Wprowadź Game Name oraz TAG');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8080/api/players/${encodeURIComponent(trimmedPlayerName)}/${encodeURIComponent(trimmedTagLine)}`
      );

      if (!res.ok) {
        throw new Error('Gracz nie istnieje');
      }

      navigate(
        `/${encodeURIComponent(trimmedPlayerName)}/${encodeURIComponent(trimmedTagLine)}/${region}`
      );
    } catch {
      onError?.(`Nie znaleziono gracza ${trimmedPlayerName}#${trimmedTagLine}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      handleSearch();
    }
  };

  return (
    <div className="search-bar-wrapper" ref={searchContainerRef}>
      <div className="search-bar">
        <input
          ref={nameInputRef}
          type="text"
          className="search-input name-input"
          placeholder="Game Name"
          value={playerName}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          disabled={isLoading}
          autoComplete="off"
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
          autoComplete="off"
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

      {/* Lista podpowiedzi z MongoDB */}
      {showSuggestions && (
        <ul className="search-suggestions-list">
          {suggestions.map((player) => (
            <li
              key={`${player.gameName}-${player.tagLine}`}
              className="search-suggestion-item"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectSuggestion(player);
              }}
            >
              <div className="suggestion-info">
                <img 
                  src={
                    player?.profileIcon
                      ? `https://ddragon.leagueoflegends.com/cdn/16.18.1/img/profileicon/${player.profileIcon}.png`
                      : `https://ddragon.leagueoflegends.com/cdn/16.18.1/img/profileicon/1.png`
                  }
                  alt="Summoner Icon"
                  className="profile-avatar-searchBar"
                />
                <span className="suggestion-name">{player.gameName}</span>
                <span className="suggestion-tag">#{player.tagLine}</span>
              </div>
              {player.summonerLevel !== undefined && (
                <span className="suggestion-level">Lvl {player.summonerLevel}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;