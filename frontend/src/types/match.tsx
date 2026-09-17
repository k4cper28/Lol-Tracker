export interface PlayerRunes {
  primaryStyleId: number;
  subStyleId: number;
  primaryPerks: number[];
  subPerks: number[];
  startPerks: number[];
}

export interface ParticipantStats {
  puuid: string;
  gameName: string;
  tagLine: string;
  championName: string;
  position: string;
  teamId: number;
  championId: number;
  level: number;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  visionScore: number;
  wardPlaced: number;
  gold: number;
  items: number[];
  questId: number;
  totalChampionDmg: number;
  apDmg: number;
  physicalDmg: number;
  totalDmg: number;
  totalApDmg: number;
  totalPhysicalDmg: number;
  cs: number;
  naturalMinionsKilled: number;
  turretKills: number;
  healedDmg: number;
  getDmg: number;
  firstBlood: boolean;
  firstTower: boolean;
  win: boolean;
  perks: PlayerRunes;
}

export interface TeamInfo {
  id: number;
  win: boolean;
  baron: number;
  dragon: number;
  herald: number;
  inhibitor: number;
  tower: number;
  horde: number;
  champion: number;
  bans: number[];
}

export interface MatchSummary {
  matchId: string;
  gameDuration: number;
  gameEndTimestamp: number;
  gameVersion: string;
  platformId: string;
  queueId: number;
  mapId: number;
  participants: ParticipantStats[];
  teams: TeamInfo[];
}