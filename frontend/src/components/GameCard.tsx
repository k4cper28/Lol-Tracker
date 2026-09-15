import './GameCard.css';

export const GameCard = () => {
    return (
        <div className="game-card">
            <div className="game-card-left">
                <div className="game-card-top-info">
                    <p className="game-card-type-game">Ranked Solo/Duo</p>
                    <p className="game-card-time">11 hours ago</p>
                </div>
                <div className="game-card-champion">
                    <div className="game-card-champion-icon">
                        <img src="/Kaisa.png" alt="Champion Icon" />
                    </div>
                    <div className="game-card-summoner-spells">
                        <div className="game-card-summoner-spell">
                            <img src="/Flash.png" alt="Summoner Spell 1" />
                        </div>
                        <div className="game-card-summoner-spell">
                            <img src="/Ignite.png" alt="Summoner Spell 2" />
                        </div>
                    </div>
                    <div className="game-card-champion-runes">
                        <div className="game-card-rune">
                            <img src="/Precision.png" alt="Rune 1" />
                        </div>
                        <div className="game-card-rune">
                            <img src="/Domination.png" alt="Rune 2" />
                        </div>
                    </div>
                </div>

                <div className="game-card-bottom-info">
                    <p className="game-card-champion-resault">WIN</p>
                    <p className="game-card-champion-game-duration">35:23</p>
                </div>
            </div>
            <div className="game-card-divider"></div>
            <div className="game-card-stats">
                <p className="game-card-kda">101/21/5</p>
                <p className="game-card-kda-ratio">7.5 KDA</p>
                <p className="game-card-cs">cs: 360</p>
                <p className="game-card-vision">vision: 30</p>
            </div>
            <div className="game-card-divider"></div>
            <div className="game-card-items">
                <div className="game-card-item">
                    <img src="/Flash.png" alt="Item 1" />
                </div>
                <div className="game-card-item">
                    <img src="/Flash.png" alt="Item 1" />
                </div>
                <div className="game-card-item">
                    <img src="/Flash.png" alt="Item 1" />
                </div>
                <div className="game-card-item">
                    <img src="/Flash.png" alt="Item 1" />
                </div>
                <div className="game-card-item">
                    <img src="/Flash.png" alt="Item 1" />
                </div>
                <div className="game-card-item">
                    <img src="/Flash.png" alt="Item 1" />
                </div>
                <div className="game-card-item">
                    <img src="/Flash.png" alt="Item 1" />
                </div>
                <div className="game-card-item">
                    <img src="/Flash.png" alt="Item 1" />
                </div>
            </div>
            <div className="game-card-divider"></div>
            <div className="game-card-players">
                <div className="game-card-team">
                    <div className="game-card-player">
                        <img src="/Kaisa.png" alt="Champion" className="game-card-player-icon" />
                        <div className="game-card-player-info">
                            <span className="game-card-player-champ">Mordekaise</span>
                            <span className="game-card-player-name">henio39</span>
                        </div>
                    </div>
                    <div className="game-card-player">
                        <img src="/Kaisa.png" alt="Champion" className="game-card-player-icon" />
                        <div className="game-card-player-info">
                            <span className="game-card-player-champ">Mordekaise</span>
                            <span className="game-card-player-name">henio39</span>
                        </div>
                    </div>
                    <div className="game-card-player">
                        <img src="/Kaisa.png" alt="Champion" className="game-card-player-icon" />
                        <div className="game-card-player-info">
                            <span className="game-card-player-champ">Mordekaise</span>
                            <span className="game-card-player-name">henio39</span>
                        </div>
                    </div>
                    <div className="game-card-player">
                        <img src="/Kaisa.png" alt="Champion" className="game-card-player-icon" />
                        <div className="game-card-player-info">
                            <span className="game-card-player-champ">Mordekaise</span>
                            <span className="game-card-player-name">henio39</span>
                        </div>
                    </div>
                    <div className="game-card-player">
                        <img src="/Kaisa.png" alt="Champion" className="game-card-player-icon" />
                        <div className="game-card-player-info">
                            <span className="game-card-player-champ">Mordekaise</span>
                            <span className="game-card-player-name">henio39</span>
                        </div>
                    </div>
                </div>

                <div className="game-card-team game-card-team-right">
                    <div className="game-card-player">
                        <div className="game-card-player-info">
                            <span className="game-card-player-champ">Mordekaise</span>
                            <span className="game-card-player-name">henio39</span>
                        </div>
                        <img src="/Kaisa.png" alt="Champion" className="game-card-player-icon" />
                    </div>
                    <div className="game-card-player">
                        <div className="game-card-player-info">
                            <span className="game-card-player-champ">Mordekaise</span>
                            <span className="game-card-player-name">henio39</span>
                        </div>
                        <img src="/Kaisa.png" alt="Champion" className="game-card-player-icon" />
                    </div>
                    <div className="game-card-player">
                        <div className="game-card-player-info">
                            <span className="game-card-player-champ">Mordekaise</span>
                            <span className="game-card-player-name">henio39</span>
                        </div>
                        <img src="/Kaisa.png" alt="Champion" className="game-card-player-icon" />
                    </div>
                    <div className="game-card-player">
                        <div className="game-card-player-info">
                            <span className="game-card-player-champ">Mordekaise</span>
                            <span className="game-card-player-name">henio39</span>
                        </div>
                        <img src="/Kaisa.png" alt="Champion" className="game-card-player-icon" />
                    </div>
                    <div className="game-card-player">
                        <div className="game-card-player-info">
                            <span className="game-card-player-champ">Mordekaise</span>
                            <span className="game-card-player-name">henio39</span>
                        </div>
                        <img src="/Kaisa.png" alt="Champion" className="game-card-player-icon" />
                    </div>
                </div>
            </div>
            <button className="game-card-expand-btn" aria-label="Rozwiń szczegóły">
                <span className="game-card-expand-arrow"></span>
            </button>

        </div>
    );
};

export default GameCard;