import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Link, useNavigate } from 'react-router-dom';
import { authService, lineService } from '../services/api';
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';
import L from 'leaflet';

// Fix pour les icônes Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = () => {
  const [allLinesData, setAllLinesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [showAllLines, setShowAllLines] = useState(true);
  const [selectedLineId, setSelectedLineId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      // Charger toutes les lignes de toutes les catégories au démarrage
      loadAllCategories();
    }
  }, []);

  const loadAllCategories = async () => {
    try {
      const allData = [];
      // Charger Métro, Tramway, Linéo, Bus, Express, Navette
      for (let categoryId = 1; categoryId <= 6; categoryId++) {
        const lines = await lineService.getLinesByCategory(categoryId);

        for (const line of lines) {
          const stops = await lineService.getLineStops(line.id);
          allData.push({
            ...line,
            stops: stops
          });
        }
      }
      setAllLinesData(allData);
    } catch (error) {
      console.error('Erreur lors du chargement des lignes:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value);
    setSelectedCategory(categoryId);
    setShowAllLines(true);
    setSelectedLineId(null);
  };

  const handleViewModeChange = (mode) => {
    if (mode === 'all') {
      setShowAllLines(true);
      setSelectedLineId(null);
    } else {
      setShowAllLines(false);
    }
  };

  const handleLineClick = (lineId) => {
    setSelectedLineId(lineId);
    setShowAllLines(false);
  };

  // Centre de Toulouse par défaut
  const center = [43.6045, 1.4442];

  // Filtrer les lignes par catégorie
  const categoryLines = allLinesData.filter(line => line.categoryId === selectedCategory);

  // Lignes à afficher
  const linesToDisplay = showAllLines
    ? categoryLines
    : categoryLines.filter(line => line.id === selectedLineId);

  return (
    <div className="map-page">
      <header className="map-header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🚇</span>
            <span className="logo-text">Tisséo Express</span>
          </Link>
          <nav className="nav-buttons">
            <Link to="/" className="nav-btn">
              🏠 Accueil
            </Link>
            <Link to="/map" className="nav-btn active">
              🗺️ Plan
            </Link>
            <Link to="/lines" className="nav-btn">
              📋 Lignes
            </Link>
            <button onClick={handleLogout} className="nav-btn btn-logout">
              🚪 Déconnexion
            </button>
          </nav>
        </div>
      </header>

      <div className="map-controls">
        <div className="control-group">
          <label htmlFor="category">Catégorie:</label>
          <select id="category" onChange={handleCategoryChange} value={selectedCategory}>
            <option value="1">Métro</option>
            <option value="2">Tramway</option>
            <option value="3">Linéo</option>
            <option value="4">Bus</option>
            <option value="5">Express</option>
            <option value="6">Navette</option>
          </select>
        </div>

        <div className="control-group">
          <label>Mode d'affichage:</label>
          <div className="view-mode-buttons">
            <button
              className={`btn ${showAllLines ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleViewModeChange('all')}
            >
              Toutes les lignes
            </button>
          </div>
        </div>

        <div className="lines-legend">
          {categoryLines.map(line => (
            <div
              key={line.id}
              className={`line-item ${selectedLineId === line.id ? 'active' : ''}`}
              onClick={() => handleLineClick(line.id)}
            >
              <span className="line-badge" style={{ backgroundColor: line.color }}>
                {line.number}
              </span>
              <span className="line-name">{line.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="map-container-wrapper">
        <MapContainer center={center} zoom={12} className="map-container">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {linesToDisplay.map(line => (
            <div key={line.id}>
              {/* Afficher les arrêts de chaque ligne */}
              {line.stops.map((stop) => (
                <Marker key={`${line.id}-${stop.id}`} position={[stop.latitude, stop.longitude]}>
                  <Popup>
                    <div className="popup-content">
                      <h3>{stop.name}</h3>
                      <p><strong>Ligne:</strong> {line.name}</p>
                      <p><strong>Ordre:</strong> {stop.order}</p>
                      <p><strong>Horaires:</strong> {line.startTime} - {line.endTime}</p>
                      <p>Coordonnées: {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Tracer la ligne */}
              {line.stops.length > 1 && (
                <Polyline
                  positions={line.stops.map(s => [s.latitude, s.longitude])}
                  color={line.color || '#0066CC'}
                  weight={4}
                  opacity={0.7}
                />
              )}
            </div>
          ))}
        </MapContainer>
      </div>

      <div className="stops-list">
        <h3>
          {showAllLines
            ? `Toutes les lignes - ${selectedCategory === 24 ? 'Métro' : selectedCategory === 25 ? 'Bus' : selectedCategory === 26 ? 'Tramway' : 'Téléphérique'}`
            : `Ligne ${linesToDisplay[0]?.name}`}
        </h3>
        <div className="lines-info">
          {linesToDisplay.map(line => (
            <div key={line.id} className="line-details">
              <h4 style={{ color: line.color }}>
                {line.name} ({line.stops.length} arrêts)
              </h4>
              <ul>
                {line.stops.map((stop) => (
                  <li key={stop.id}>
                    {stop.order}. {stop.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;
