import { useEffect, useState, useRef } from 'react';
import GameCard from './GameCard';
import './MatchHistory.css';
import { ArenaGameCard } from './ArenaGameCard';

interface MatchHistoryProps {
  puuid: string;
  filter?: 'ALL' | 'RANKED_SOLO' | 'RANKED_FLEX' | 'ARENA';
  onMatchesLoaded?: () => void;
}

export const MatchHistory = ({ puuid, filter = 'ALL', onMatchesLoaded }: MatchHistoryProps) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);
    setError(null);
    setMatches([]); // Clear matches on player change

    const fetchMatches = async (retryCount = 0) => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/matches/player/${encodeURIComponent(puuid)}?page=0&size=20`
        );
        if (!res.ok) throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);

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
        console.error('Failed to fetch matches:', err);
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

  // Filtering matches based on selected tab:
  const filteredMatches = matches.filter((m) => {
    const qId = m.queueId ?? m.info?.queueId;
    if (filter === 'RANKED_SOLO') return qId === 420;
    if (filter === 'RANKED_FLEX') return qId === 440;
    if (filter === 'ARENA') return [1700, 1710, 1740, 1750].includes(qId);
    return true; // 'ALL'
  });

  if (loading) {
    return (
      <div className="matches-loader-container">
        <div className="hextech-spinner"></div>
        <p className="matches-loader-text">Loading match history...</p>
      </div>
    );
  }

  if (error) {
    return <div className="matches-error">Error: {error}</div>;
  }

  if (matches.length === 0) {
    return <div className="matches-empty">No match history found for this summoner.</div>;
  }

  return (
    <div className="match-history-list">
      {filteredMatches.length === 0 ? (
        <div className="matches-empty">No matches found for the selected mode.</div>
      ) : (
        filteredMatches.map((matchDoc, index) => {
          const queueId = matchDoc.queueId ?? matchDoc.info?.queueId;
          const isArena = [1700, 1710, 1740, 1750].includes(queueId);

          return isArena ? (
            <ArenaGameCard
              key={matchDoc.matchId ?? matchDoc._id ?? index}
              match={matchDoc}
              currentPuuid={puuid}
            />
          ) : (
            <GameCard
              key={matchDoc.matchId ?? matchDoc._id ?? index}
              match={matchDoc}
              currentPuuid={puuid}
            />
          );
        })
      )}
    </div>
  );
};

export default MatchHistory;