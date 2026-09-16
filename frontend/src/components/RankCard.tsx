import './RankCard.css';
import type { RankInfo } from '../pages/Profile';

interface RankCardProps {
  title: string;
  rankData: RankInfo | null;
}

export const RankCard = ({ title, rankData }: RankCardProps) => {

  if(!rankData) {
    return (
      <div className="rank-card"> 
      <div className="rank-card-header-content">
        <div className="rank-card-divider"></div>
        <span className="rank-card-header-title">Ranked Solo</span>
      </div>

      <div className="rank-card-content">
        {/* <img src="/obraz4.svg" alt="Rank tier badge" className="game-card-rank-icon" /> */}
        
        <div className="rank-card-info">
          <span className="rank-card-info-rank">Unranked</span>
          {/* <span className="rank-card-info-lp">100 LP</span> */}
        </div>

        <div className="rank-card-stats">
          <span className="rank-card-info-win-lose">0W 0L</span>
          {/* <span className="rank-card-info-wr">51% WR</span> */}
        </div>
      </div>
    </div>
    );
  }

  const { tier, rank, leaguePoints, wins, losses } = rankData;
  const totalGames = wins + losses;
  const winRatio = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  const formattedTier = tier.charAt(0).toUpperCase + tier.slice(1).toLowerCase();
  const iconPath = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${tier.toLowerCase()}.png`;


  return (
    <div className="rank-card"> 
      <div className="rank-card-header-content">
        <div className="rank-card-divider"></div>
        <span className="rank-card-header-title">{title}</span>
      </div>

      <div className="rank-card-content">
        <img src={iconPath} alt={`${tier} badge`} className="game-card-rank-icon" />
        
        <div className="rank-card-info">
          <span className="rank-card-info-rank">{rank} {tier}</span>
          <span className="rank-card-info-lp">{leaguePoints} LP</span>
        </div>

        <div className="rank-card-stats">
          <span className="rank-card-info-win-lose">{wins}W {losses}L</span>
          <span className="rank-card-info-wr">{winRatio} WR</span>
        </div>
      </div>
    </div>
  );
};

export default RankCard;