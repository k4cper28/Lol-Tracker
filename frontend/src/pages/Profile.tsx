import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RankCard from '../components/RankCard';
import SearchBar from '../components/SearchBar';
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
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!playerName || !tagLine) return;

        setLoading(true);
        setError(null);

        // KROK 1: Pobranie PUUID
        fetch(`http://localhost:8080/api/players/${encodeURIComponent(playerName)}/${encodeURIComponent(tagLine)}`)
            .then((res) => {
                if (!res.ok) throw new Error(`Błąd HTTP: ${res.status}`);
                return res.json() as Promise<PuuidResponse>;
            })
            .then(async (data) => {
                setPuuid(data.puuid);

                // KROK 2: Równoległe pobranie rang SoloQ i Flex dla odebranego PUUID
                const [soloRes, flexRes] = await Promise.all([
                    fetch(`http://localhost:8080/api/players/${data.puuid}/solo/rank`),
                    fetch(`http://localhost:8080/api/players/${data.puuid}/flex/rank`)
                ]);

                if (soloRes.ok) {
                    const soloData = (await soloRes.json()) as RankInfo;
                    setSoloRank(soloData);
                }

                if (flexRes.ok) {
                    const flexData = (await flexRes.json()) as RankInfo;
                    setFlexRank(flexData);
                }
            })
            .catch((err: Error) => {
                console.error('Fetch error:', err);

                navigate('/', {
                    replace: true,
                    state: { errorMessage: `Nie znaleziono gracza ${playerName}#${tagLine}` }
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [playerName, tagLine]);

    return (
  <div className="profile-page-wrapper">
    <header className="profile-navbar">
      <div className="profile-navbar-left">
        <Link to="/" className="logo-link">
          <img src="/logo.svg" alt="Riftly" className="logo-img" />
        </Link>
      </div>

      <div className="profile-navbar-center">
        <SearchBar />
      </div>

      <div className="profile-navbar-right" />
    </header>

    <main className="profile-main-content">
      <h2>Profil: {playerName}#{tagLine} ({region})</h2>

      <div style={{ background: '#1e1e1e', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
        <small style={{ color: '#aaa' }}>PUUID:</small>
        <p style={{ fontFamily: '"Intel One Mono", monospace', color: '#d1a868', margin: '4px 0 0 0', wordBreak: 'break-all' }}>
          {puuid}
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