import './GameCard.css';
import { Link } from 'react-router-dom';

interface GameCardProps {
  match?: any;
  currentPuuid?: string;
}

const DDRAGON_VERSION = '16.18.1';

export const GameCard = ({ match, currentPuuid }: GameCardProps) => {
  if (!match) return null;

  const region = match.platformId ?? 'EUNE';

  const formatRelativeTime = (timestamp?: number): string => {
  if (!timestamp) return 'Brak daty';

  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return 'Przed chwilą';
  if (diffMin < 60) return `${diffMin} min temu`;
  if (diffHours < 24) return `${diffHours} godz. temu`;
  if (diffDays === 1) return 'Wczoraj';
  if (diffDays < 30) return `${diffDays} dni temu`;
  
  return new Date(timestamp).toLocaleDateString('pl-PL');
};

  // 1. Obsługa danych gracza – z listy participants
  const participantsList = match.info?.participants || match.participants;
  const isMatchSummary = Array.isArray(participantsList);

  const me = isMatchSummary
    ? participantsList.find((p: any) => p.puuid?.toLowerCase() === currentPuuid?.toLowerCase()) || participantsList[0]
    : match;

  if (!me) return null;

  // 2. Formatowanie czasu trwania
  const durationSec = match.gameDuration ?? match.info?.gameDuration ?? me.gameDuration ?? 0;
  const durationCleanSec = durationSec > 10000 ? Math.floor(durationSec / 1000) : durationSec;
  const min = Math.floor(durationCleanSec / 60);
  const sec = Math.floor(durationCleanSec % 60);
  const formattedDuration = `${min}:${sec < 10 ? '0' : ''}${sec}`;

  // 3. Typ kolejki
  const queueId = match.queueId ?? match.info?.queueId ?? 420;
  const queueNames: Record<number, string> = {
    420: 'Ranked Solo',
    440: 'Ranked Flex',
    450: 'ARAM',
    400: 'Normal Draft',
    430: 'Normal Blind',
  };
  const queueName = queueNames[queueId] || 'Custom / Other';

  // 4. Statystyki bojowe
  const kills = me.kills ?? 0;
  const deaths = me.deaths ?? 0;
  const assists = me.assists ?? 0;
  const kdaRatio = deaths === 0 ? 'Perfect' : ((kills + assists) / deaths).toFixed(2);
  const cs = (me.cs ?? 0) + (me.totalMinionsKilled ?? 0) + (me.naturalMinionsKilled ?? 0);
  const vision = me.visionScore ?? 0;
  const isWin = Boolean(me.win);

  const numericKda = deaths === 0 ? 999 : (kills + assists) / deaths;

const kdaClass =
  numericKda < 1.0
    ? 'low'
    : numericKda <= 2.5
    ? 'normal'
    : 'high';

  // 5. Przedmioty w kolejności: 0, 1, 2, questId, 3, 4, 5, 6
  const rawItems: number[] = Array.isArray(me.items) ? me.items : [];
  const items: number[] = [
    rawItems[0] ?? me.item0 ?? 0,
    rawItems[1] ?? me.item1 ?? 0,
    rawItems[2] ?? me.item2 ?? 0,
    me.questId ?? 0,
    rawItems[3] ?? me.item3 ?? 0,
    rawItems[4] ?? me.item4 ?? 0,
    rawItems[5] ?? me.item5 ?? 0,
    rawItems[6] ?? me.item6 ?? 0,
  ];

  // 6. Drużyny 5v5
  const allParticipants = isMatchSummary ? participantsList : [];
  const team100 = allParticipants.filter((p: any) => p.teamId === 100);
  const team200 = allParticipants.filter((p: any) => p.teamId === 200);

  return (
    <div className={`game-card ${isWin ? 'win' : 'loss'}`}>
      <div className="game-card-left">
        <div className="game-card-top-info">
          <p className="game-card-type-game">{queueName}</p>
          <p className="game-card-time">{formatRelativeTime(match.gameEndTimestamp)}</p>
        </div>

        <div className="game-card-champion">
          <div className="game-card-champion-icon">
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${me.championName}.png`}
              alt={me.championName}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${me.championId || 1}.png`;
              }}
            />
          </div>

          <div className="game-card-summoner-spells">
            <div className="game-card-summoner-spell">
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/SummonerFlash.png`}
                alt="Summoner Spell 1"
              />
            </div>
            <div className="game-card-summoner-spell">
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/SummonerDot.png`}
                alt="Summoner Spell 2"
              />
            </div>
          </div>

          <div className="game-card-champion-runes">
            <div className="game-card-rune">
              <img
                src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7201_Precision.png"
                alt="Primary Rune"
              />
            </div>
            <div className="game-card-rune">
              <img
                src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7200_Domination.png"
                alt="Sub Rune"
              />
            </div>
          </div>
        </div>

        <div className="game-card-bottom-info">
          <p className={`game-card-champion-resault ${isWin ? 'win-text' : 'loss-text'}`}>
            {isWin ? 'WIN' : 'DEFEAT'}
          </p>
          <p className="game-card-champion-game-duration">{formattedDuration}</p>
        </div>
      </div>

      <div className="game-card-divider" />

      <div className="game-card-stats">
        <p className="game-card-kda">{kills}/{deaths}/{assists}</p>
        <p className={`game-card-kda-ratio ${kdaClass}`}>{kdaRatio} KDA</p>
        <p className="game-card-cs">cs: {cs}</p>
        <p className="game-card-vision">vision: {vision}</p>
      </div>

      <div className="game-card-divider" />

      <div className="game-card-items">
        {items.map((itemId, idx) => (
          <div key={idx} className={`game-card-item ${itemId > 0 ? '' : 'empty'}`}>
            {itemId > 0 ? (
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/item/${itemId}.png`}
                alt={`Item ${itemId}`}
                onError={(e) => {
                  // Fallback na CommunityDragon, gdyby dany item był nowszy niż wersja DDragon
                  (e.target as HTMLImageElement).src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/item-icons/${itemId}.png`;
                }}
              />
            ) : null}
          </div>
        ))}
      </div>

      <div className="game-card-divider" />

      <div className="game-card-players">
        {/* Drużyna Niebieska */}
        <div className="game-card-team">
          {team100.length > 0 ? (
            team100.map((p: any, idx: number) => {
              const name = p.gameName || p.riotIdGameName;
              const tag = p.tagLine || 'EUNE';
              const playerUrl = `/${encodeURIComponent(name)}/${encodeURIComponent(tag)}/${region}`;

              return (
                <Link
                  to={playerUrl}
                  key={p.puuid ?? idx}
                  className="game-card-player"
                  title={`Zobacz profil ${name}#${tag}`}
                >
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${p.championName}.png`}
                    alt={p.championName}
                    className="game-card-player-icon"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${p.championId || 1}.png`;
                    }}
                  />
                  <div className="game-card-player-info">
                    <span className="game-card-player-champ">{p.championName}</span>
                    <span className="game-card-player-name">{name}</span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="game-card-player-empty" />
          )}
        </div>

        {/* Drużyna Czerwona */}
        <div className="game-card-team game-card-team-right">
          {team200.length > 0 ? (
            team200.map((p: any, idx: number) => {
              const name = p.gameName || p.riotIdGameName;
              const tag = p.tagLine || 'EUNE';
              const playerUrl = `/${encodeURIComponent(name)}/${encodeURIComponent(tag)}/${region}`;

              return (
                <Link
                  to={playerUrl}
                  key={p.puuid ?? idx}
                  className="game-card-player"
                  title={`Zobacz profil ${name}#${tag}`}
                >
                  <div className="game-card-player-info-right">
                    <span className="game-card-player-champ">{p.championName}</span>
                    <span className="game-card-player-name">{name}</span>
                  </div>
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${p.championName}.png`}
                    alt={p.championName}
                    className="game-card-player-icon"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${p.championId || 1}.png`;
                    }}
                  />
                </Link>
              );
            })
          ) : (
            <div className="game-card-player-empty" />
          )}
        </div>
      </div>

      <button className="game-card-expand-btn" aria-label="Rozwiń szczegóły">
        <span className="game-card-expand-arrow" />
      </button>
      
    </div>
  );
};

export default GameCard;