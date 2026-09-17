import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import './Home.css';


interface LocationState {
  errorMessage?: string;
}

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (state?.errorMessage) {
      setToastMessage(state.errorMessage);

      // Czyści stan w historii, by alert nie wracał po F5
      navigate(location.pathname, { replace: true, state: {} });

      // Samoczynne zamknięcie po 4 sekundach
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [state, navigate, location.pathname]);

  return (
    <div className="app-container">
      {/* Pływający toast błędu */}
      {toastMessage && (
        <div className="toast-notification">
          <span className="toast-icon">⚠️</span>
          <span className="toast-text">{toastMessage}</span>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setToastMessage(null)}
          >
            ✕
          </button>
        </div>
      )}

      <header className="navbar">
        <a href="/" className="logo-link">
          <img src="/logo.svg" alt="Riftly" className="logo-img" />
        </a>
      </header>

      <main className="main-content">
  <img src="/huge-logo.svg" alt="Riftly" className="hero-logo" />
  <SearchBar onError={(msg) => setToastMessage(msg)} />
</main>
    </div>
  );
}

export default Home;