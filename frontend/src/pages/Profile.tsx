import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RankCard from '../components/RankCard';

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
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [playerName, tagLine]);

  if (loading) {
    return <div style={{ color: '#fff', padding: '20px' }}>Ładowanie profilu i rang...</div>;
  }

  if (error) {
    return <div style={{ color: '#ff4d4f', padding: '20px' }}>Błąd: {error}</div>;
  }

  return (
    <div style={{ color: '#fff', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Profil: {playerName}#{tagLine} ({region})</h2>
      
      <div style={{ background: '#1e1e1e', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
        <small style={{ color: '#aaa' }}>PUUID:</small>
        <p style={{ fontFamily: 'monospace', color: '#d1a868', margin: '4px 0 0 0', wordBreak: 'break-all' }}>
          {puuid}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {/* Wywołanie komponentu RankCard dla obu kolejek */}
        <RankCard title="Ranked Solo" rankData={soloRank} />
        <RankCard title="Ranked Flex" rankData={flexRank} />
      </div>
    </div>
  );
};

export default Profile;