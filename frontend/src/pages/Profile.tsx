import { SearchBar } from '../components/SearchBar';
import { GameCard } from '../components/GameCard';
import { Link } from 'react-router-dom';
import './Home.css';
import RankCard from '../components/RankCard.';



function Profile() {
    return (
        <div className="app-container">
            <header className="navbar">
                <Link to="/" className="logo-link">
                    < img src="/logo.svg" alt="Riftly" className="logo-img" />
                </Link>
            </header>

            <main className="main-content">
                <img src="/huge-logo.svg" alt="Riftly" className="hero-logo" />

                {/* Sam pusty prostokąt */}
                <SearchBar />
                <GameCard />
                <RankCard />
            </main>
        </div>
    );
}

export default Profile;