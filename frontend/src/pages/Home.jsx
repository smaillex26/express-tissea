import { Link, useNavigate } from 'react-router-dom';
import { authService, statsService } from '../services/api';
import { useEffect, useState } from 'react';
import '../styles/Home.css';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    categories: 0,
    lines: 0,
    stops: 0,
    relations: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    setIsAuthenticated(!!user);

    // Charger les statistiques
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await statsService.getGeneralStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="home">
      {/* Header avec bouton Accueil */}
      <header className="home-header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🚇</span>
            <span className="logo-text">Tisséo Express</span>
          </Link>
          <nav className="nav-buttons">
            <Link to="/" className="nav-btn active">
              🏠 Accueil
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/map" className="nav-btn">
                  🗺️ Plan
                </Link>
                <button onClick={handleLogout} className="nav-btn btn-logout">
                  🚪 Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-btn">
                  🔑 Connexion
                </Link>
                <Link to="/signup" className="nav-btn btn-primary">
                  ✨ S'inscrire
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <div className="home-content">
        {/* Hero Section */}
        <section className="hero">
          <h1 className="hero-title">Tisséo Express</h1>
          <p className="hero-subtitle">Réseau de transports publics de Toulouse</p>
          <p className="hero-description">
            Explorez et gérez les lignes de métro et tramway
            du réseau Tisséo de Toulouse. Consultez les horaires, arrêts et itinéraires
            en temps réel.
          </p>

          {!isAuthenticated && (
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-large">
                Commencer maintenant
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                Se connecter
              </Link>
            </div>
          )}
        </section>

        {/* Statistics */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.lines}</div>
              <div className="stat-label">Lignes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.stops}</div>
              <div className="stat-label">Arrêts</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.categories}</div>
              <div className="stat-label">Catégories</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.relations}</div>
              <div className="stat-label">Relations</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features-section">
          <h2 className="section-title">Nos Services</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚇</div>
              <h3>Métro</h3>
              <p>2 lignes de métro (A et B) desservant 38 stations à travers Toulouse</p>
              <ul className="feature-list">
                <li>Ligne A: Basso Cambo ↔ Balma-Gramont (18 arrêts)</li>
                <li>Ligne B: Borderouge ↔ Ramonville (20 arrêts)</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚋</div>
              <h3>Tramway</h3>
              <p>1 ligne de tramway T1 desservant 25 stations de Palais de Justice à MEETT</p>
              <ul className="feature-list">
                <li>Ligne T1: Palais de Justice ↔ MEETT (25 arrêts)</li>
                <li>Desserte aéroport et zones d'activité</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚌</div>
              <h3>Bus</h3>
              <p>4 lignes de bus structurantes desservant 22 arrêts dans l'agglomération</p>
              <ul className="feature-list">
                <li>Linéo 1, 2 et 3: Lignes à haut niveau de service</li>
                <li>Navette Aéroport: Liaison rapide centre-ville</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quick Access */}
        <section className="quick-access-section">
          <h2 className="section-title">Accès Rapide</h2>
          <div className="quick-access-grid">
            <Link to={isAuthenticated ? "/map" : "/login"} className="quick-access-card">
              <div className="quick-icon">🗺️</div>
              <h3>Carte interactive</h3>
              <p>Visualisez les lignes et arrêts sur une carte</p>
            </Link>

            <div className="quick-access-card">
              <div className="quick-icon">📊</div>
              <h3>API REST</h3>
              <p>10 endpoints conformes aux spécifications</p>
            </div>

            <div className="quick-access-card">
              <div className="quick-icon">🔒</div>
              <h3>Authentification JWT</h3>
              <p>Connexion sécurisée avec tokens JWT</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="home-footer">
          <p>© 2026 Tisséo Express - API REST pour le réseau de transport de Toulouse</p>
          <p className="footer-tech">Node.js • Express • PostgreSQL • React</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
