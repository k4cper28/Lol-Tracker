import './RankCard.css';

export const RankCard = () => {
  return (
    <div className="rank-card"> 
      <div className="rank-card-header-content">
        <div className="game-card-divider"></div>
        <span className="rank-card-header-title">Ranked Solo</span>
      </div>

      <div className="rank-card-content">
        <img src="/obraz4.svg" alt="Rank tier badge" className="game-card-rank-icon" />
        
        <div className="rank-card-info">
          <span className="rank-card-info-rank">Platinum III</span>
          <span className="rank-card-info-lp">100 LP</span>
        </div>

        <div className="rank-card-stats">
          <span className="rank-card-info-win-lose">3110W 2610L</span>
          <span className="rank-card-info-wr">51% WR</span>
        </div>
      </div>
    </div>
  );
};

export default RankCard;