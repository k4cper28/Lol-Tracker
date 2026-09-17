import './ProfileCard.css';

export const ProfileCard = () => {
    return (
        <div className="profile-card">
            <div className='profile-mastery-block'>
                <span className='mastery-title'>Top champion mastery poits</span>
                <div className='mastery-ranking'>
                    <div className='mastery-rank'>
                        <div className='mastery-rank-img'>
                            <img src="/Kaisa.png" alt="Summoner Icon" className="mastery-awatar" />
                        </div>
                        <span className='mastery-lvl'>311 lvl</span>
                        <span className='mastery-points'>311111</span>
                        <span className='mastery-points'>points</span>
                    </div>
                    <div className='mastery-rank'>
                        <div className='mastery-rank-img'>
                            <img src="/Kaisa.png" alt="Summoner Icon" className="mastery-awatar" />
                        </div>
                        <span className='mastery-lvl'>311 lvl</span>
                        <span className='mastery-points'>311111</span>
                        <span className='mastery-points'>points</span>
                    </div>
                    <div className='mastery-rank'>
                        <div className='mastery-rank-img'>
                            <img src="/Kaisa.png" alt="Summoner Icon" className="mastery-awatar" />
                        </div>
                        <span className='mastery-lvl'>311 lvl</span>
                        <span className='mastery-points'>311111</span>
                        <span className='mastery-points'>points</span>
                    </div>
                </div>
            </div>
            <div className="profile-summoner-block">
                <div className="profile-icon-wrapper">
                    <div className="profile-icon-frame">
                        <img src="/Kaisa.png" alt="Summoner Icon" className="profile-avatar" />
                    </div>
                    <span className="profile-level-badge">312</span>
                </div>
                <div className="profile-details">
                    <span className="profile-name">k4cper</span>
                    <span className="profile-tag">#2137</span>
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