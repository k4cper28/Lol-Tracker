import { useEffect, useState, useRef } from 'react';
import GameCard from './GameCard';
import './MatchHistory.css';

interface MatchHistoryProps {
  puuid: string;
  onMatchesLoaded?: () => void;
}

export const MatchHistory = ({ puuid, onMatchesLoaded }: MatchHistoryProps) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);
    setError(null);
    setMatches([]); // Czyścimy poprzednie mecze przy zmianie gracza

    const fetchMatches = async (retryCount = 0) => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/matches/player/${encodeURIComponent(puuid)}?page=0&size=20`
        );
        if (!res.ok) throw new Error(`Błąd HTTP ${res.status}: ${res.statusText}`);

        const data = await res.json();
        const list = data?.content ?? [];

        if (!isSubscribed) return;

        if (list.length < 5 && retryCount < 4) {
          retryTimeoutRef.current = setTimeout(() => {
            if (isSubscribed) fetchMatches(retryCount + 1);
          }, 1500);
          return;
        }

        setMatches(list);
        setLoading(false);
        onMatchesLoaded?.(); 
      } catch (err: any) {
        console.error('Błąd pobierania meczów:', err);
        if (isSubscribed) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchMatches();

    return () => {
      isSubscribed = false;
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [puuid]);

  if (loading) {
    return (
      <div className="matches-loader-container">
        <div className="hextech-spinner"></div>
        <p className="matches-loader-text">Pobieranie i przetwarzanie historii gier...</p>
      </div>
    );
  }

  if (error) {
    return <div className="matches-error">Błąd: {error}</div>;
  }

  if (matches.length === 0) {
    return <div className="matches-empty">Brak historii meczów dla tego gracza.</div>;
  }

  return (
    <div className="match-history-list">
      {matches.map((matchDoc, index) => (
        <GameCard 
          key={matchDoc.matchId ?? matchDoc._id ?? index} 
          match={matchDoc} 
          currentPuuid={puuid} 
        />
      ))}
    </div>
  );
};

export default MatchHistory;