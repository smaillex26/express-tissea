import { useState, useEffect } from 'react';
import { lineService, categoryService } from '../services/api';
import '../styles/Lines.css';

function Lines() {
  const [lines, setLines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredLines, setFilteredLines] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLineType, setSelectedLineType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLine, setSelectedLine] = useState(null);
  const [lineStops, setLineStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterLines();
  }, [selectedCategory, selectedLineType, searchTerm, lines]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [linesData, categoriesData] = await Promise.all([
        lineService.getAllLines(),
        categoryService.getAllCategories()
      ]);
      setLines(linesData);
      setCategories(categoriesData);
      setFilteredLines(linesData);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du chargement des données:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterLines = () => {
    let result = [...lines];

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      result = result.filter(line => line.categoryId === parseInt(selectedCategory));
    }

    // Filtre par type de ligne
    if (selectedLineType !== 'all') {
      result = result.filter(line => line.lineType === selectedLineType);
    }

    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(line =>
        line.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        line.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        line.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLines(result);
  };

  const selectLine = async (line) => {
    setSelectedLine(line);
    try {
      const stops = await lineService.getLineStops(line.id);
      setLineStops(stops);
    } catch (err) {
      console.error('Erreur lors du chargement des arrêts:', err);
    }
  };

  const getLineTypeColor = (lineType) => {
    switch(lineType) {
      case 'Linéo': return '#E2001A';
      case 'Express': return '#FF6600';
      case 'Navette': return '#8E44AD';
      case 'TAD': return '#95A5A6';
      default: return '#0066CC';
    }
  };

  const lineTypes = ['Linéo', 'Classic', 'Express', 'Navette', 'TAD'];

  if (loading) {
    return (
      <div className="lines-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement des lignes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lines-page">
        <div className="error-message">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={loadData}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="lines-page">
      <div className="lines-header">
        <h1>Lignes Tisséo</h1>
        <p className="subtitle">Découvrez toutes les lignes du réseau de transport toulousain</p>
      </div>

      {/* Filtres */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="search">
            <i className="icon-search"></i> Rechercher
          </label>
          <input
            id="search"
            type="text"
            placeholder="Rechercher une ligne..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category">Catégorie</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="lineType">Type de ligne</label>
          <select
            id="lineType"
            value={selectedLineType}
            onChange={(e) => setSelectedLineType(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les types</option>
            {lineTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="results-count">
          <strong>{filteredLines.length}</strong> ligne{filteredLines.length > 1 ? 's' : ''} trouvée{filteredLines.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Liste des lignes */}
      <div className="lines-container">
        <div className="lines-grid">
          {filteredLines.length === 0 ? (
            <div className="no-results">
              <p>Aucune ligne trouvée avec ces critères</p>
            </div>
          ) : (
            filteredLines.map(line => (
              <div
                key={line.id}
                className={`line-card ${selectedLine?.id === line.id ? 'active' : ''}`}
                onClick={() => selectLine(line)}
              >
                <div className="line-badge" style={{ backgroundColor: line.color || getLineTypeColor(line.lineType) }}>
                  {line.number}
                </div>
                <div className="line-info">
                  <h3>{line.name}</h3>
                  {line.description && (
                    <p className="line-description">{line.description}</p>
                  )}
                  <div className="line-meta">
                    <span className="line-type" style={{ color: getLineTypeColor(line.lineType) }}>
                      {line.lineType || 'Classic'}
                    </span>
                    <span className="line-hours">
                      {line.startTime} - {line.endTime}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Détail de la ligne sélectionnée */}
        {selectedLine && (
          <div className="line-details">
            <div className="line-details-header">
              <div className="line-details-badge" style={{ backgroundColor: selectedLine.color || getLineTypeColor(selectedLine.lineType) }}>
                {selectedLine.number}
              </div>
              <div>
                <h2>{selectedLine.name}</h2>
                <p className="line-category">{categories.find(c => c.id === selectedLine.categoryId)?.name}</p>
              </div>
              <button className="close-details" onClick={() => setSelectedLine(null)}>
                ✕
              </button>
            </div>

            {selectedLine.description && (
              <div className="line-route">
                <h3>Itinéraire</h3>
                <p>{selectedLine.description}</p>
              </div>
            )}

            <div className="line-schedule">
              <h3>Horaires</h3>
              <div className="schedule-info">
                <div>
                  <strong>Début de service:</strong> {selectedLine.startTime}
                </div>
                <div>
                  <strong>Fin de service:</strong> {selectedLine.endTime}
                </div>
              </div>
            </div>

            {lineStops.length > 0 && (
              <div className="line-stops">
                <h3>Arrêts ({lineStops.length})</h3>
                <div className="stops-list">
                  {lineStops.map((stop, index) => (
                    <div key={stop.id} className="stop-item">
                      <div className="stop-number">{index + 1}</div>
                      <div className="stop-name">{stop.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Lines;
