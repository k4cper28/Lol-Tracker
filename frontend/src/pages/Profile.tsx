import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RankCard from '../components/RankCard';
import SearchBar from '../components/SearchBar';
import ProfileCard from '../components/ProfileCard';
import './Profile.css';

interface PuuidResponse {
  puuid: string;
}

export interface RankInfo {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

export const Profile = () => {
  const navigate = useNavigate();
  const { playerName, tagLine, region } = useParams<{
    playerName: string;
    tagLine: string;
    region: string;
  }>();

  const [puuid, setPuuid] = useState<string | null>(null);
  const [soloRank, setSoloRank] = useState<RankInfo | null>(null);
  const [flexRank, setFlexRank] = useState<RankInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearchError = (msg: string) => {
    setSearchError(msg);
    setTimeout(() => setSearchError(null), 4000);
  };

  useEffect(() => {
    if (!playerName || !tagLine) return;

    let isSubscribed = true;
    setLoading(true);

    const fetchPlayerData = async () => {
      try {
        // 1. Pobranie PUUID
        const puuidRes = await fetch(
          `http://localhost:8080/api/players/${encodeURIComponent(playerName)}/${encodeURIComponent(tagLine)}`
        );
        if (!puuidRes.ok) throw new Error('Player not found');
        const puuidData = (await puuidRes.json()) as PuuidResponse;

        // 2. Równoległe pobranie rang
        const [soloRes, flexRes] = await Promise.all([
          fetch(`http://localhost:8080/api/players/${puuidData.puuid}/solo/rank`),
          fetch(`http://localhost:8080/api/players/${puuidData.puuid}/flex/rank`)
        ]);

        if (!isSubscribed) return;

        setPuuid(puuidData.puuid);
        setSoloRank(soloRes.ok ? await soloRes.json() : null);
        setFlexRank(flexRes.ok ? await flexRes.json() : null);
      } catch (err) {
        console.error('Fetch error:', err);
        if (isSubscribed) {
          navigate('/', {
            replace: true,
            state: { errorMessage: `Nie znaleziono gracza ${playerName}#${tagLine}` }
          });
        }
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };

    fetchPlayerData();

    return () => {
      isSubscribed = false;
    };
  }, [playerName, tagLine, region, navigate]);

  return (
    <div className="profile-page-wrapper">
      {searchError && (
        <div className="toast-notification">
          <span className="toast-icon">⚠️</span>
          <span className="toast-text">{searchError}</span>
          <button type="button" className="toast-close-btn" onClick={() => setSearchError(null)}>
            ✕
          </button>
        </div>
      )}

      <header className="profile-navbar">
        <div className="profile-navbar-left">
          <Link to="/" className="logo-link">
            <img src="/logo.svg" alt="Riftly" className="logo-img" />
          </Link>
        </div>

        <div className="profile-navbar-center">
          <SearchBar onError={handleSearchError} />
        </div>

        <div className="profile-navbar-right" />
      </header>

      <main className="profile-main-content">
        <ProfileCard />

        <h2>Profil: {playerName}#{tagLine} ({region})</h2>

        <div style={{ background: '#1e1e1e', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
          <small style={{ color: '#aaa' }}>PUUID:</small>
          <p style={{ fontFamily: '"Intel One Mono", monospace', color: '#d1a868', margin: '4px 0 0 0', wordBreak: 'break-all' }}>
            {loading ? 'Ładowanie...' : puuid}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <RankCard title="Ranked Solo" rankData={soloRank} />
          <RankCard title="Ranked Flex" rankData={flexRank} />
        </div>
      </main>
    </div>
  );
};

export default Profile;