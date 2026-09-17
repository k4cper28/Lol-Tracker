import './ProfileCard.css';
import type { Mastery } from '../pages/Profile';

interface ProfileCardProps {
  masteries?: Mastery[];
  profileInfo?: ProfilInfo | null;
}

interface ProfileInfoProps{

}

export const ProfileCard = ({ masteries = [], profileInfo }: ProfileCardProps) => {
    return (

        <div className="profile-card">
            <div className='profile-mastery-block'>
                <span className='mastery-title'>Top champion mastery poits</span>
                <div className='mastery-ranking'>
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
            </div>
            <div className="profile-summoner-block">
                <div className="profile-icon-wrapper">
                    <div className="profile-icon-frame">
                        <img 
                            src={
                                profileInfo?.profileIcon
                            ? `https://ddragon.leagueoflegends.com/cdn/14.17.1/img/profileicon/${profileInfo.profileIcon}.png`
                            : `https://ddragon.leagueoflegends.com/cdn/14.17.1/img/profileicon/1.png`
                            }
                            alt="Summoner Icon"
                            className="profile-avatar" />
                    </div>
                    <span className="profile-level-badge">{profileInfo?.summonerLevel ?? '...'}</span>
                </div>
                <div className="profile-details">
                    <span className="profile-name">{profileInfo?.gameName ?? '...'}</span>
                    <span className="profile-tag">#{profileInfo?.tagLine ?? '...'}</span>
                </div>
            </div>
            <div className='profile-top-rank-block'>
                <span className='profile-highest-rank'>Highest rank: </span>
                <div className='profile-highest-rank-info'>
                    <img src="/obraz4.svg" alt="Highest rank" className="highest-rank" />
                    <div className='profile-highest-rank-details'>
                        <span className='profile-rank'>Diamond III</span>
                        <span className='profile-points'>21 LP</span>
                    </div>
                </div>
                <span className='profile-20-games'>last 20 games:</span>
                <div className='profile-20-games-details'>
                    <span className='profile-20-games-kd'>3.2 KD</span>
                    <span className='profile-20-games-wr'>75%</span>
                </div>
            </div>
            <div className='reload-button-container'>
                <button className="profile-reload-button" aria-label="zaktualizuj dane">
                    <img src="/refresh.svg" alt="refresh icon" className="refresh-icon" />
                </button>
            </div>
        </div>
    );
}

export default ProfileCard;