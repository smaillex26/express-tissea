import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="home-content">
        <h1>API Tisséa</h1>
        <p className="subtitle">Réseau de transports publics - Bus, Métro et Tramway</p>

        <div className="home-description">
          <p>
            Bienvenue sur l'API Tisséa, votre plateforme de gestion des transports en commun.
            Accédez aux informations sur les lignes de bus, métro et tramway.
          </p>
        </div>

        <div className="home-actions">
          <Link to="/signup" className="btn btn-primary">
            S'inscrire
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Se connecter
          </Link>
        </div>

        <div className="home-features">
          <div className="feature">
            <h3>🚇 Métro</h3>
            <p>Consultez les horaires et itinéraires des lignes de métro</p>
          </div>
          <div className="feature">
            <h3>🚌 Bus</h3>
            <p>Trouvez votre ligne de bus et ses arrêts</p>
          </div>
          <div className="feature">
            <h3>🚊 Tramway</h3>
            <p>Découvrez le réseau de tramway et ses stations</p>
          </div>
        </div>

        <div className="home-quick-links">
          <h3>Accès rapide</h3>
          <div className="quick-links-grid">
            <Link to="/lines" className="quick-link">
              <span className="icon">📋</span>
              <span>Toutes les lignes</span>
            </Link>
            <Link to="/map" className="quick-link">
              <span className="icon">🗺️</span>
              <span>Carte interactive</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
