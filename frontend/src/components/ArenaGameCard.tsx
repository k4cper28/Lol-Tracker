import './ArenaGameCard.css';
import { useItems, type SimpleItem } from '../types/useItems';
import { formatRelativeTime, formatDescription, getQueueName } from '../utils/matchUtils';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ArenaGameCardProps {
    match: any;
    currentPuuid?: string;
}

export const ArenaGameCard = ({ match, currentPuuid }: ArenaGameCardProps) => {
    const rawGameVersion = match.gameVersion ?? match.info?.gameVersion;
    const patch = rawGameVersion ? rawGameVersion.split('.').slice(0, 2).join('.') : '16.18';
    const DDRAGON_VERSION = `${patch}.1`;
    const participants = match.info?.participants || match.participants || [];
    const me = participants.find((p: any) => p.puuid === currentPuuid) || participants[0];

    const itemsDict = useItems(patch);
    const placement = me?.placement ?? me?.subteamPlacement ?? 1;
    const isWin = placement <= 4;

    const queueId = match.queueId ?? match.info?.queueId ?? 1700;
    const queueName = getQueueName(queueId);
    const [hoveredItem, setHoveredItem] = useState<{ id: number; data?: SimpleItem } | null>(null);

    // Obliczenie minut i sekund:
    const durationSec = match.gameDuration ?? match.info?.gameDuration ?? 0;
    const durationCleanSec = durationSec > 10000 ? Math.floor(durationSec / 1000) : durationSec;
    const min = Math.floor(durationCleanSec / 60);
    const sec = Math.floor(durationCleanSec % 60);
    const formattedDuration = `${min}:${sec < 10 ? '0' : ''}${sec}`;

    // 4. Statystyki bojowe
    const kills = me.kills ?? 0;
    const deaths = me.deaths ?? 0;
    const assists = me.assists ?? 0;
    const kdaRatio = deaths === 0 ? 'Perfect' : ((kills + assists) / deaths).toFixed(2);

    const numericKda = deaths === 0 ? 999 : (kills + assists) / deaths;
    const kdaClass =
        numericKda < 1.0
            ? 'low'
            : numericKda <= 2.5
                ? 'normal'
                : 'high';

    // 5. Przedmioty w kolejności: 0,1,2,3,4,5
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

    const region = match.platformId ?? 'EUNE';

    // Grupowanie graczy w drużyny i sortowanie od 1. do ostatniego miejsca
    const teamsMap: Record<number, any[]> = {};
    participants.forEach((p: any) => {
        const teamKey = p.playerSubteamId ?? p.subteamPlacement ?? p.placement ?? 0;
        if (!teamsMap[teamKey]) {
            teamsMap[teamKey] = [];
        }
        teamsMap[teamKey].push(p);
    });

    const sortedTeams = Object.values(teamsMap).sort((teamA, teamB) => {
        const placeA = teamA[0]?.placement ?? teamA[0]?.subteamPlacement ?? 99;
        const placeB = teamB[0]?.placement ?? teamB[0]?.subteamPlacement ?? 99;
        return placeA - placeB;
    });

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
                    <div className="game-card-augments">
                        <div className="game-card-augment">
                            <img
                                src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${me.championName}.png`}
                                alt={me.championName}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${me.championId || 1}.png`;
                                }}
                            />
                        </div>
                        <div className="game-card-augment">
                            <img
                                src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${me.championName}.png`}
                                alt={me.championName}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${me.championId || 1}.png`;
                                }}
                            />
                        </div>
                    </div>
                    <div className="game-card-augments">
                        <div className="game-card-augment">
                            <img
                                src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${me.championName}.png`}
                                alt={me.championName}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${me.championId || 1}.png`;
                                }}
                            />
                        </div>
                        <div className="game-card-augment">
                            <img
                                src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${me.championName}.png`}
                                alt={me.championName}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${me.championId || 1}.png`;
                                }}
                            />
                        </div>
                    </div>
                </div>


                <div className="game-card-bottom-info">
                    <p className={`game-card-champion-resault ${isWin ? 'win-text' : 'loss-text'}`}>
                        #{placement === 1 ? '1st' : placement === 2 ? '2nd' : placement === 3 ? '3rd' : `${placement}th`}
                    </p>
                    <p className="game-card-champion-game-duration">{formattedDuration}</p>
                </div>
            </div>
            <div className="game-card-divider" />
            <div className="game-card-middle">
                <div className="game-card-stats">
                    <p className="game-card-kda">{kills}/{deaths}/{assists}</p>
                    <p className={`game-card-kda-ratio ${kdaClass}`}>{kdaRatio} KDA</p>
                </div>
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
                                                    <span className="item-tooltip-name">
                                                        {itemData?.name || `Przedmiot #${itemId}`}
                                                    </span>
                                                </div>
                                                <div className="item-tooltip-desc">
                                                    {formatDescription(itemData?.description)}
                                                </div>

                                                {itemData?.gold !== undefined && (
                                                    <span className="item-tooltip-gold">{itemData.gold} G</span>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="game-card-z" />

            <div className="arena-card-teams">
                {sortedTeams.slice(0, 6).map((team, tIdx) => {
                    const place = team[0]?.placement ?? team[0]?.subteamPlacement ?? tIdx + 1;
                    const isMyTeam = team.some((p: any) => p.puuid === currentPuuid);

                    return (
                        <div key={tIdx} className={`arena-team-row ${isMyTeam ? 'my-team' : ''}`}>
                            <span
                                className={`arena-team-place ${place === 1 ? 'gold' : place === 2 ? 'silver' : place === 3 ? 'bronze' : ''
                                    }`}
                            >
                                #{place}
                            </span>
                            <div className="arena-team-members">
                                {team.slice(0, 3).map((player: any, pIdx: number) => {
                                    const pName = player.gameName || player.riotIdGameName || 'Player';
                                    const pTag = player.tagLine || player.riotIdTagline || 'EUNE';
                                    const pChampion = player.championName || 'Champion';

                                    return (
                                        <Link
                                            to={`/${encodeURIComponent(pName)}/${encodeURIComponent(pTag)}/${region}`}
                                            key={pIdx}
                                            className="arena-player-avatar-link"
                                            title={`${pName}#${pTag} (${pChampion})`}
                                        >
                                            <img
                                                src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${pChampion}.png`}
                                                alt={pChampion}
                                                className="arena-player-avatar"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${player.championId || 1}.png`;
                                                }}
                                            />
                                            <span className="arena-player-name">{pName}</span>
                                        </Link>
                                    );
                                })}
                            </div>
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