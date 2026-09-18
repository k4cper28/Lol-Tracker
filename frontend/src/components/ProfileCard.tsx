import { useState, useEffect } from 'react';
import './ProfileCard.css';
import type { Mastery, ProfilInfo } from '../pages/Profile';

interface ProfileCardProps {
  masteries?: Mastery[];
  profileInfo?: ProfilInfo | null;
}

interface RecentStats {
  winRate: number;
  kda: number;
}

export const ProfileCard = ({ masteries = [], profileInfo }: ProfileCardProps) => {
  const [recentStats, setRecentStats] = useState<RecentStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false);

  useEffect(() => {
    if (!profileInfo?.puuid) {
      setRecentStats(null);
      return;
    }

    setIsLoadingStats(true);
    fetch(`http://localhost:8080/api/matches/${profileInfo.puuid}/recent-stats`)
      .then((res) => {
        if (!res.ok) throw new Error('Błąd podczas pobierania statystyk');
        return res.json();
      })
      .then((data: RecentStats) => {
        setRecentStats(data);
      })
      .catch((err) => {
        console.error('Nie udało się pobrać statystyk ostatnich 20 gier:', err);
        setRecentStats(null);
      })
      .finally(() => {
        setIsLoadingStats(false);
      });
  }, [profileInfo?.puuid]);

  const kda = recentStats?.kda ?? 0;
  const winRate = recentStats?.winRate ?? 0;

  const top20KdaClass =
    kda < 1.0
    ? 'low-kda'
    : kda <= 2.5
    ? 'normal-kda'
    : 'high-kda';

    const top20WinRateClass =
    winRate < 40
    ? 'low-winRate'
    : winRate <= 60
    ? 'normal-winRate'
    : 'high-winRate';

    
        
  return (
    <div className="profile-card">
      <div className="profile-mastery-block">
        <span className="mastery-title">Top champion mastery points</span>
        <div className="mastery-ranking">
          {masteries.length === 0 ? (
            <span style={{ color: '#888', fontSize: '12px' }}>Brak danych</span>
          ) : (
            masteries.map((m) => (
              <div className="mastery-rank" key={m.championId}>
                <div className="mastery-rank-img">
                  <img
                    src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${m.championId}.png`}
                    alt={`Champion ${m.championId}`}
                    className="mastery-awatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/Kaisa.png';
                    }}
                  />
                </div>
                <span className="mastery-lvl">{m.championLevel} lvl</span>
                <span className="mastery-points">{m.championPoints.toLocaleString()}</span>
                <span className="mastery-points">points</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="profile-summoner-block">
        <div className="profile-icon-wrapper">
          <div className="profile-icon-frame">
            <img 
              src={
                profileInfo?.profileIcon
                  ? `https://ddragon.leagueoflegends.com/cdn/16.18.1/img/profileicon/${profileInfo.profileIcon}.png`
                  : `https://ddragon.leagueoflegends.com/cdn/16.18.1/img/profileicon/1.png`
              }
              alt="Summoner Icon"
              className="profile-avatar" 
            />
          </div>
          <span className="profile-level-badge">{profileInfo?.summonerLevel ?? '...'}</span>
        </div>
        <div className="profile-details">
          <span className="profile-name">{profileInfo?.gameName ?? '...'}</span>
          <span className="profile-tag">#{profileInfo?.tagLine ?? '...'}</span>
        </div>
      </div>

      <div className="profile-top-rank-block">
        <span className="profile-highest-rank">Highest rank: </span>
        <div className="profile-highest-rank-info">
          <img 
            src={`/ranks/${profileInfo?.topRank?.tier ? profileInfo.topRank.tier.toLowerCase() : 'unranked'}.png`} 
            alt={`${profileInfo?.topRank?.tier ?? 'Unranked'} badge`} 
            className="highest-rank" 
          />
          <div className="profile-highest-rank-details">
            <span className="profile-rank">
              {profileInfo?.topRank?.tier ?? 'UNRANKED'} {profileInfo?.topRank?.rank ?? ''}
            </span>
            <span className="profile-points">
              {profileInfo?.topRank?.leaguePoints !== undefined ? `${profileInfo.topRank.leaguePoints} LP` : '-'}
            </span>
          </div>
        </div>

        <span className="profile-20-games">last 20 games:</span>
        <div className="profile-20-games-details">
          {isLoadingStats ? (
            <span style={{ color: '#A09B8B', fontSize: '11px' }}>Ładowanie...</span>
          ) : recentStats ? (
            <>
              <span className={`profile-20-games-kd ${top20KdaClass}`}>{recentStats.kda.toFixed(2)} KDA</span>
              <span className={`profile-20-games-wr ${top20WinRateClass}`}>{recentStats.winRate}%</span>
            </>
          ) : (
            <span style={{ color: '#A09B8B', fontSize: '11px' }}>Brak danych</span>
          )}
        </div>
      </div>

      <div className="reload-button-container">
        <button className="profile-reload-button" aria-label="zaktualizuj dane">
          <img src="/refresh.svg" alt="refresh icon" className="refresh-icon" />
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;