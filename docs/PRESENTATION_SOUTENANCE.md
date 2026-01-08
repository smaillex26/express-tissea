# Présentation Soutenance - API Tisséa

## Slide 1: Présentation du Projet

### Titre
**API Tisséa - Réseau de Transports Publics**
*Bus, Métro et Tramway*

### Contexte
- Création d'une API REST complète pour gérer un réseau de transports publics
- Inspiré du réseau Tisséa de Toulouse
- Application full-stack moderne avec frontend interactif

### Objectifs
- Fournir des informations sur les lignes de transport
- Calculer des distances et itinéraires
- Interface utilisateur intuitive avec carte interactive
- Authentification sécurisée

---

## Slide 2: Choix des Technologies

### Backend
- **Express.js 5.2** - Framework web Node.js rapide et minimaliste
- **PostgreSQL 14+** - Base de données relationnelle robuste
- **Prisma ORM 5.22** - ORM moderne avec typage TypeScript-like
- **JWT** - Authentification stateless et sécurisée
- **bcryptjs** - Hashage sécurisé des mots de passe

### Frontend
- **React 18** - Bibliothèque UI moderne et performante
- **Vite** - Build tool ultra-rapide
- **React Router** - Navigation SPA
- **Leaflet** - Cartes interactives OpenStreetMap
- **Axios** - Client HTTP avec intercepteurs

### Pourquoi ces choix ?
- **Express**: Simple, léger, grande communauté
- **PostgreSQL**: Relations complexes, intégrité référentielle
- **Prisma**: Migrations automatiques, requêtes type-safe
- **React + Vite**: Performance, hot reload instantané
- **Leaflet**: Open-source, léger, personnalisable

---

## Slide 3: Modèle de Données

### Schéma Entité-Relation

```
Category (1) ───► (N) Line (1) ───► (N) LineStop (N) ───► (1) Stop
                                             ↓
                                          (order)
```

### Entités Principales

**Category** - Catégories de transport
- id, name (Bus/Métro/Tramway)

**Line** - Lignes de transport
- id, name, number, color, startTime, endTime
- Relation: categoryId → Category

**Stop** - Arrêts/Stations
- id, name, latitude, longitude

**LineStop** - Association avec ordre
- lineId, stopId, order (séquentiel)
- Gère l'ordre des arrêts sur chaque ligne

**User** - Utilisateurs
- id, email, password (hashé), name

### Points Clés
- Ordre séquentiel des arrêts (1, 2, 3...)
- Réorganisation automatique lors des suppressions
- Validation des coordonnées GPS

---

## Slide 4: Gestion de Projet / Découpage des Tâches

### Phase 1: Conception (20%)
- [x] Analyse des besoins
- [x] Conception du modèle de données
- [x] Choix des technologies

### Phase 2: Backend (40%)
- [x] Configuration Express.js et PostgreSQL
- [x] Schéma Prisma et migrations
- [x] Authentification JWT
- [x] 10 endpoints REST
- [x] Calcul de distance (Haversine)
- [x] Seeding de données

### Phase 3: Frontend (30%)
- [x] Configuration React + Vite
- [x] Pages d'authentification
- [x] Carte Leaflet interactive
- [x] Affichage des lignes et arrêts
- [x] Styling responsive

### Phase 4: Documentation (10%)
- [x] README complet
- [x] Documentation API
- [x] Schéma de base de données
- [x] Guide de démarrage rapide

---

## Slide 5: Démonstration de l'API

### Endpoints Implémentés (10/10)

#### Authentification (Public)
1. **POST** `/api/users/signup` - Inscription
2. **POST** `/api/users/login` - Connexion (retourne JWT)

#### Consultation (Authentifié)
3. **GET** `/api/categories/:id/lines` - Lignes par catégorie
4. **GET** `/api/lines/:id` - Détails d'une ligne
5. **GET** `/api/lines/:id/stops` - Arrêts détaillés

#### Modification (Authentifié)
6. **POST** `/api/lines/:id/stops` - Ajouter un arrêt
7. **PUT** `/api/lines/:id` - Modifier une ligne
8. **DELETE** `/api/lines/:lineId/stops/:stopId` - Supprimer un arrêt

#### Statistiques (Authentifié)
9. **GET** `/api/stats/distance/stops/:id1/:id2` - Distance entre 2 arrêts
10. **GET** `/api/stats/distance/lines/:id` - Distance totale d'une ligne

### Démonstration Live
- Test des endpoints avec Postman/Thunder Client
- Affichage de la réponse JSON
- Vérification de l'authentification JWT

---

## Slide 6: Démonstration du Frontend

### Parcours Utilisateur

1. **Page d'accueil**
   - Présentation de l'application
   - Boutons Inscription / Connexion

2. **Inscription / Connexion**
   - Formulaires avec validation
   - Gestion d'erreurs
   - Redirection automatique

3. **Carte Interactive**
   - Sélection par catégorie (Métro/Bus/Tramway)
   - Choix de ligne
   - Affichage des arrêts avec marqueurs
   - Tracé du parcours (Polyline)
   - Popup d'information par arrêt
   - Liste des arrêts dans l'ordre

### Fonctionnalités
- Authentification persistante (localStorage)
- Protection des routes
- Responsive design
- Interface intuitive

---

## Slide 7: Analyse des Écarts

### Points Réalisés ✅
- ✅ Tous les 10 endpoints fonctionnels
- ✅ Authentification JWT sécurisée
- ✅ Calcul de distance avec formule de Haversine
- ✅ Frontend React avec carte Leaflet
- ✅ Gestion complète de l'ordre des arrêts
- ✅ Documentation exhaustive
- ✅ Seeding avec données réalistes (Toulouse)
- ✅ Intégrité référentielle (CASCADE)

### Améliorations Réalisées 🎯
- ✅ Interface moderne et responsive
- ✅ Affichage graphique des lignes (Polyline)
- ✅ Gestion d'erreurs côté client
- ✅ Protection CORS
- ✅ Code bien structuré (MVC pattern)

### Points Non Réalisés ⚠️
- ⚠️ Tests unitaires (Vitest) - par manque de temps
- ⚠️ Utilisation de Prisma Studio - fonctionnel mais non démontré
- ⚠️ Gestion des horaires détaillés (jours fériés, etc.)

### Difficultés Rencontrées
1. **Migration SQLite → PostgreSQL**
   - Solution: Configuration correcte de DATABASE_URL

2. **Gestion de l'ordre des arrêts**
   - Solution: Contraintes UNIQUE et réorganisation automatique

3. **Affichage Leaflet**
   - Solution: Import correct des CSS et fix des icônes

---

## Slide 8: Conclusion / Axes d'Amélioration

### Ce que nous avons appris
- Architecture d'une API REST complète
- Gestion des relations complexes avec Prisma
- Authentification JWT stateless
- Intégration frontend-backend
- Calculs géographiques

### Axes d'Amélioration Techniques

#### Court Terme
1. **Tests Unitaires**
   - Vitest pour les routes
   - Couverture de code >80%

2. **Performance**
   - Pagination des résultats
   - Cache Redis pour les distances
   - Indexes supplémentaires

3. **Sécurité**
   - Rate limiting
   - Validation Joi/Zod
   - Helmet.js

#### Moyen Terme
4. **Fonctionnalités**
   - Horaires en temps réel
   - Perturbations/Alertes
   - Itinéraires multi-lignes
   - Recherche d'arrêts

5. **UX**
   - Mode hors-ligne
   - Notifications push
   - Favoris utilisateur
   - Partage d'itinéraire

#### Long Terme
6. **Scalabilité**
   - Microservices
   - Déploiement Docker
   - CI/CD avec GitHub Actions
   - Monitoring (Sentry, DataDog)

### Compétences Acquises
- ✅ Architecture backend moderne
- ✅ ORM et migrations
- ✅ Sécurité web (JWT, bcrypt)
- ✅ React et hooks
- ✅ APIs géographiques
- ✅ Documentation technique

---

## Slide 9: Démonstration Complète

### Scénario 1: Créer un compte et consulter le Métro B
1. Inscription avec email/password
2. Connexion automatique
3. Sélection "Métro" → "Métro B"
4. Visualisation des 17 arrêts
5. Calcul de la distance totale (≈15 km)

### Scénario 2: Ajouter un arrêt via API
1. POST `/api/lines/1/stops`
2. Body: `{ name: "Nouveau Terminus", lat: 43.55, lon: 1.47 }`
3. Vérification sur la carte
4. Suppression de l'arrêt

### Scénario 3: Statistiques
1. GET distance entre Borderouge et Jean Jaurès
2. GET distance totale du Tramway T1
3. Affichage des résultats

---

## Slide 10: Questions / Réponses

### Questions Potentielles et Réponses

**Q: Pourquoi Prisma plutôt qu'un autre ORM ?**
R: Migrations automatiques, typage fort, requêtes lisibles, excellente DX

**Q: Comment gérez-vous la sécurité ?**
R: JWT pour l'auth, bcrypt (10 rounds) pour les passwords, CORS configuré, validation des inputs

**Q: Et si deux arrêts ont le même ordre ?**
R: Impossible grâce à la contrainte UNIQUE(lineId, order) au niveau DB

**Q: La formule de Haversine est-elle précise ?**
R: Oui à ±0.5% pour des distances <1000km, parfait pour un réseau urbain

**Q: Comment déployer en production ?**
R: Docker + PostgreSQL cloud + Vercel/Railway pour le backend + Netlify pour le frontend

**Q: Temps total de développement ?**
R: Environ 15-20 heures (conception, dev, tests, documentation)

---

## Données Chiffrées du Projet

### Code Source
- **Lignes de code backend**: ~800 lignes
- **Lignes de code frontend**: ~600 lignes
- **Fichiers totaux**: 45+
- **Routes API**: 10 endpoints

### Base de Données
- **Tables**: 5 (User, Category, Line, Stop, LineStop)
- **Arrêts**: 27 arrêts au total
- **Lignes**: 3 lignes (Métro B, Tramway T1, Bus 14)
- **Catégories**: 3

### Documentation
- **README.md**: Guide complet
- **API_DOCUMENTATION.md**: Documentation détaillée de l'API
- **DATABASE_SCHEMA.md**: Schéma et explications
- **QUICK_START.md**: Guide de démarrage rapide
- **DIAGRAM_SCHEMA.txt**: Diagramme ASCII

### Technologies
- **Dépendances backend**: 17 packages
- **Dépendances frontend**: 30 packages
- **Version Node.js**: 18+
- **Version PostgreSQL**: 14+

---

## Ressources et Inspirations

### Documentation Officielle
- Express.js: https://expressjs.com
- Prisma: https://prisma.io
- React: https://react.dev
- Leaflet: https://leafletjs.com

### Inspirations
- Réseau Tisséa Toulouse: https://www.tisseo.fr
- Geopy (calculs géo): https://geopy.readthedocs.io
- Formule Haversine: Stack Overflow

### Repository
- GitHub: [lien du repository]
- Nomenclature: express-tissea

---

**Merci pour votre attention !**

Des questions ? 🙋
