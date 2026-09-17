import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RankCard from '../components/RankCard';
import SearchBar from '../components/SearchBar';
import ProfileCard from '../components/ProfileCard';
import './Profile.css';

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

export interface Mastery {
  championId: number;
  championLevel: number;
  championPoints: number;
}

export interface ProfilInfo {
  puuid: string;
  gameName: string;
  tagLine: string;
  summonerLevel: number;
  profileIcon: number;
  iconUrl: string;
  ranks?: Record<string, RankInfo>;
  updatedAt?: string;
}

export const Profile = () => {
  const navigate = useNavigate();
  const { playerName, tagLine, region } = useParams<{
    playerName: string;
    tagLine: string;
    region: string;
  }>();

  const [profileInfo, setProfileInfo] = useState<ProfilInfo | null>(null);
  const [topMasteries, setTopMasteries] = useState<Mastery[]>([]);
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
        // 1. Pobranie całego profilu (zawiera PUUID, dane gracza i mapę rang)
        const profileRes = await fetch(
          `http://localhost:8080/api/players/${encodeURIComponent(playerName)}/${encodeURIComponent(tagLine)}`
        );
        if (!profileRes.ok) throw new Error('Player not found');
        const profileData = (await profileRes.json()) as ProfilInfo;
        
        if (!isSubscribed) return;
        setProfileInfo(profileData);

        // 2. Pobranie top 3 maestrii na podstawie PUUID z pobranego profilu
        const masteryRes = await fetch(
          `http://localhost:8080/api/player/mastery/top3/${profileData.puuid}`
        );
        
        if (masteryRes.ok && isSubscribed) {
          const masteryData = (await masteryRes.json()) as Mastery[];
          setTopMasteries(masteryData);
        }
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

  const soloRank = profileInfo?.ranks?.['RANKED_SOLO_5x5'] ?? null;
  const flexRank = profileInfo?.ranks?.['RANKED_FLEX_SR'] ?? null;

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
        <ProfileCard masteries={topMasteries} profileInfo={profileInfo} />
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <RankCard title="Ranked Solo" rankData={soloRank} />
          <RankCard title="Ranked Flex" rankData={flexRank} />
        </div>
      </main>
    </div>
  );
};

export default Profile;