import SearchBar from '../components/SearchBar';
import './Home.css';



function Home() {
  return (
    <div className="app-container">
      <header className="navbar">
        <a href="/" className="logo-link">
          <img src="/logo.svg" alt="Riftly" className="logo-img" />
        </a>
      </header>

      <main className="main-content">
        <img src="/huge-logo.svg" alt="Riftly" className="hero-logo" />
        
        <SearchBar />
      </main>
    </div>
  );
}

export default Home;