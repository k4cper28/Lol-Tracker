import './GameCard.css';
import { Link } from 'react-router-dom';
import { useItems, type SimpleItem } from '../types/useItems';
import { useState } from 'react';
import { useSpells, type SimpleSpell } from '../types/useSpells';
import { useRunes, type SimpleRune } from '../types/useRunes';
import { formatRelativeTime, formatDescription, getQueueName } from '../utils/matchUtils';

interface GameCardProps {
  match?: any;
  currentPuuid?: string;
}

export const SUMMONER_SPELLS: Record<number, { name: string; icon: string }> = {
  1: { name: 'Cleanse', icon: 'SummonerBoost' },
  3: { name: 'Exhaust', icon: 'SummonerExhaust' },
  4: { name: 'Flash', icon: 'SummonerFlash' },
  6: { name: 'Ghost', icon: 'SummonerHaste' },
  7: { name: 'Heal', icon: 'SummonerHeal' },
  11: { name: 'Smite', icon: 'SummonerSmite' },
  12: { name: 'Teleport', icon: 'SummonerTeleport' },
  13: { name: 'Clarity', icon: 'SummonerMana' },
  14: { name: 'Ignite', icon: 'SummonerDot' },
  21: { name: 'Barrier', icon: 'SummonerBarrier' },
  30: { name: 'To the King!', icon: 'SummonerPoroRecall' },
  31: { name: 'Poro Toss', icon: 'SummonerPoroThrow' },
  32: { name: 'Snowball', icon: 'SummonerSnowball' },
  39: { name: 'Mark', icon: 'SummonerSnowURFSnowball_Mark' },
  2201: { name: 'Flee', icon: 'cherry_flee' },
  2202: { name: 'Flash', icon: 'SummonerFlash' },
};

const LANE_ROLES = [
  { key: 'top', icon: '/role/top.png', label: 'TOP' },
  { key: 'jg', icon: '/role/jg.png', label: 'JUNGLE' },
  { key: 'mid', icon: '/role/mid.png', label: 'MID' },
  { key: 'adc', icon: '/role/adc.png', label: 'ADC' },
  { key: 'supp', icon: '/role/supp.png', label: 'SUPPORT' },
];

export const GameCard = ({ match, currentPuuid }: GameCardProps) => {
  if (!match) return null;

  const rawGameVersion = match.gameVersion;
  const patch = rawGameVersion ? rawGameVersion.split('.').slice(0, 2).join('.') : '16.18';
  const DDRAGON_VERSION = `${patch}.1`;

  const itemsDict = useItems(patch);
  const spellsDict = useSpells(patch);
  const { trees: runeTrees, runes: allRunes } = useRunes(patch);

  const [hoveredItem, setHoveredItem] = useState<{ id: number; data?: SimpleItem } | null>(null);
  const [hoveredSpell, setHoveredSpell] = useState<{ id: number; data?: SimpleSpell } | null>(null);
  const [hoveredRune, setHoveredRune] = useState<{ id: number; data?: SimpleRune } | null>(null);

  const region = match.platformId ?? 'EUNE';

  const participantsList = match.info?.participants || match.participants;
  const isMatchSummary = Array.isArray(participantsList);

  const me = isMatchSummary
    ? participantsList.find((p: any) => p.puuid?.toLowerCase() === currentPuuid?.toLowerCase()) || participantsList[0]
    : match;

  if (!me) return null;

  const durationSec = match.gameDuration ?? match.info?.gameDuration ?? me.gameDuration ?? 0;
  const durationCleanSec = durationSec > 10000 ? Math.floor(durationSec / 1000) : durationSec;
  const min = Math.floor(durationCleanSec / 60);
  const sec = Math.floor(durationCleanSec % 60);
  const formattedDuration = `${min}:${sec < 10 ? '0' : ''}${sec}`;

  const queueId = match.queueId ?? match.info?.queueId ?? 420;
  const queueName = getQueueName(queueId);

  const spell1Id = me.summoner1Id ?? 4;
  const spell2Id = me.summoner2Id ?? 14;
  const spell1Data = spellsDict[spell1Id.toString()];
  const spell2Data = spellsDict[spell2Id.toString()];

  const keystoneId = me.perks?.primaryPerks?.[0] ?? me.primaryPerks?.[0] ?? 8010;
  const subStyleId = me.perks?.subStyleId ?? me.subStyleId ?? 8200;
  const keystoneData = allRunes[keystoneId];
  const subStyleData = runeTrees[subStyleId];

  const kills = me.kills ?? 0;
  const deaths = me.deaths ?? 0;
  const assists = me.assists ?? 0;
  const kdaRatio = deaths === 0 ? 'Perfect' : ((kills + assists) / deaths).toFixed(2);
  const cs = (me.cs ?? 0) + (me.totalMinionsKilled ?? 0) + (me.naturalMinionsKilled ?? 0);
  const vision = me.visionScore ?? 0;
  const isWin = Boolean(me.win);

  const numericKda = deaths === 0 ? 999 : (kills + assists) / deaths;
  const kdaClass = numericKda < 1.0 ? 'low' : numericKda <= 2.5 ? 'normal' : 'high';

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
            <div
              className="game-card-summoner-spell"
              onMouseEnter={() => setHoveredSpell({ id: spell1Id, data: spell1Data })}
              onMouseLeave={() => setHoveredSpell(null)}
            >
              <img
                src={
                  spell1Id === 2201
                    ? '/spells/flee.png'
                    : `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/${spell1Data?.image || 'SummonerFlash.png'}`
                }
                alt={spell1Data?.name || `Spell ${spell1Id}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/SummonerFlash.png`;
                }}
              />
              {hoveredSpell?.id === spell1Id && (
                <div className="spell-tooltip">
                  <div className="item-tooltip-header">
                    <span className="item-tooltip-name">{spell1Data?.name || `Spell #${spell1Id}`}</span>
                    {spell1Data?.cooldown ? <span className="item-tooltip-gold">{spell1Data.cooldown}s CD</span> : null}
                  </div>
                  <div className="item-tooltip-desc">{formatDescription(spell1Data?.description)}</div>
                </div>
              )}
            </div>

            <div
              className="game-card-summoner-spell"
              onMouseEnter={() => setHoveredSpell({ id: spell2Id, data: spell2Data })}
              onMouseLeave={() => setHoveredSpell(null)}
            >
              <img
                src={
                  spell2Id === 2201
                    ? '/spells/flee.png'
                    : `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/${spell2Data?.image || 'SummonerDot.png'}`
                }
                alt={spell2Data?.name || `Spell ${spell2Id}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/SummonerFlash.png`;
                }}
              />
              {hoveredSpell?.id === spell2Id && (
                <div className="spell-tooltip">
                  <div className="item-tooltip-header">
                    <span className="item-tooltip-name">{spell2Data?.name || `Spell #${spell2Id}`}</span>
                    {spell2Data?.cooldown ? <span className="item-tooltip-gold">{spell2Data.cooldown}s CD</span> : null}
                  </div>
                  <div className="item-tooltip-desc">{formatDescription(spell2Data?.description)}</div>
                </div>
              )}
            </div>
          </div>

          <div className="game-card-champion-runes">
            <div
              className="game-card-rune"
              onMouseEnter={() => setHoveredRune({ id: keystoneId, data: keystoneData })}
              onMouseLeave={() => setHoveredRune(null)}
            >
              <img
                src={
                  keystoneData?.icon
                    ? `https://ddragon.leagueoflegends.com/cdn/img/${keystoneData.icon}`
                    : 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7201_Precision.png'
                }
                alt={keystoneData?.name || `Keystone #${keystoneId}`}
              />
              {hoveredRune?.id === keystoneId && (
                <div className="spell-tooltip">
                  <div className="item-tooltip-header">
                    <span className="item-tooltip-name">{keystoneData?.name || `Keystone #${keystoneId}`}</span>
                    <span className="item-tooltip-gold">Keystone</span>
                  </div>
                  <div className="item-tooltip-desc">
                    {formatDescription(keystoneData?.shortDesc || keystoneData?.longDesc)}
                  </div>
                </div>
              )}
            </div>

            <div
              className="game-card-rune"
              onMouseEnter={() => setHoveredRune({ id: subStyleId, data: subStyleData })}
              onMouseLeave={() => setHoveredRune(null)}
            >
              <img
                src={
                  subStyleData?.icon
                    ? `https://ddragon.leagueoflegends.com/cdn/img/${subStyleData.icon}`
                    : 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7200_Domination.png'
                }
                alt={subStyleData?.name || `SubStyle #${subStyleId}`}
              />
              {hoveredRune?.id === subStyleId && (
                <div className="spell-tooltip">
                  <div className="item-tooltip-header">
                    <span className="item-tooltip-name">{subStyleData?.name || `Tree #${subStyleId}`}</span>
                    <span className="item-tooltip-gold">Secondary Tree</span>
                  </div>
                  <div className="item-tooltip-desc">Secondary rune path selected for this match.</div>
                </div>
              )}
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
        {items.map((itemId, idx) => {
          const itemData = itemId > 0 ? itemsDict[itemId.toString()] : undefined;

          return (
            <div
              key={idx}
              className={`game-card-item ${itemId > 0 ? '' : 'empty'}`}
              onMouseEnter={() => itemId > 0 && setHoveredItem({ id: itemId, data: itemData })}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {itemId > 0 ? (
                <>
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/item/${itemId}.png`}
                    alt={`Item ${itemId}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/item-icons/${itemId}.png`;
                    }}
                  />
                  {hoveredItem?.id === itemId && (
                    <div className="item-tooltip">
                      <div className="item-tooltip-header">
                        <span className="item-tooltip-name">{itemData?.name || `Przedmiot #${itemId}`}</span>
                      </div>
                      <div className="item-tooltip-desc">{formatDescription(itemData?.description)}</div>
                      {itemData?.gold !== undefined && <span className="item-tooltip-gold">{itemData.gold} G</span>}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="game-card-divider" />

      {/* Zestawienie 5 linii: Niebiescy vs Rola vs Czerwoni */}
      <div className="game-card-players-matchups">
        {LANE_ROLES.map((role, i) => {
          const p1 = team100[i];
          const p2 = team200[i];

          const p1Name = p1?.gameName || p1?.riotIdGameName || 'Player';
          const p1Tag = p1?.tagLine || 'EUNE';
          const p1Champ = p1?.championName || 'Champion';
          const isP1Me = p1?.puuid?.toLowerCase() === currentPuuid?.toLowerCase();

          const p2Name = p2?.gameName || p2?.riotIdGameName || 'Player';
          const p2Tag = p2?.tagLine || 'EUNE';
          const p2Champ = p2?.championName || 'Champion';
          const isP2Me = p2?.puuid?.toLowerCase() === currentPuuid?.toLowerCase();

          return (
            <div key={role.key} className="game-card-matchup-row">
              {/* Lewy gracz: Awatar -> Nick */}
              {p1 ? (
                <Link
                  to={`/${encodeURIComponent(p1Name)}/${encodeURIComponent(p1Tag)}/${region}`}
                  className={`game-card-player-slot ${isP1Me ? 'my-player' : ''}`}
                  title={`${p1Name}#${p1Tag} (${p1Champ})`}
                >
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${p1Champ}.png`}
                    alt={p1Champ}
                    className="game-card-player-avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${p1.championId || 1}.png`;
                    }}
                  />
                  <span className="game-card-player-name">{p1Name}</span>
                </Link>
              ) : (
                <div className="game-card-player-slot empty" />
              )}

              {/* Środek: Ikona roli */}
              <div className="game-card-lane-role" title={role.label}>
                <img src={role.icon} alt={role.label} />
              </div>

              {/* Prawy gracz: Nick -> Awatar */}
              {p2 ? (
                <Link
                  to={`/${encodeURIComponent(p2Name)}/${encodeURIComponent(p2Tag)}/${region}`}
                  className={`game-card-player-slot right ${isP2Me ? 'my-player' : ''}`}
                  title={`${p2Name}#${p2Tag} (${p2Champ})`}
                >
                  <span className="game-card-player-name">{p2Name}</span>
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${p2Champ}.png`}
                    alt={p2Champ}
                    className="game-card-player-avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${p2.championId || 1}.png`;
                    }}
                  />
                </Link>
              ) : (
                <div className="game-card-player-slot empty" />
              )}
            </div>
          );
        })}
      </div>

      <button className="game-card-expand-btn" aria-label="Rozwiń szczegóły">
        <span className="game-card-expand-arrow" />
      </button>
    </div>
  );
};

export default GameCard;