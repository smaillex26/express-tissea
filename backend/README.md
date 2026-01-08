# API Tisséo Express - Backend

API REST pour gérer les lignes de transport de Toulouse (Tisséo).

## Technologies

- Node.js + Express.js
- PostgreSQL (avec le package `pg`)
- JWT pour l'authentification
- bcryptjs pour le hachage des mots de passe

## Structure de la base de données

La base de données PostgreSQL contient les tables suivantes:

- **users**: Utilisateurs de l'application
- **categories**: Catégories de transport (Linéo, Bus, Express, Navette, TAD)
- **lines**: Lignes de transport
- **stops**: Arrêts
- **line_stops**: Table de jonction ligne-arrêts avec ordre

## Installation

1. Installer les dépendances:
```bash
npm install
```

2. Configurer la base de données dans `.env`:
```
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/tissea_db"
JWT_SECRET="your-secret-key"
```

3. Initialiser la base de données:
```bash
npm run init:db
```

4. Peupler la base de données avec les données Tisséo:
```bash
npm run seed
```

## Démarrage

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

## Endpoints API

### Authentification

- **POST /api/users/signup** - Inscription d'un nouvel utilisateur
- **POST /api/users/login** - Connexion (retourne un token JWT)

### Lignes et catégories (authentification requise)

1. **GET /api/categories/:id/lines** - Liste des lignes d'une catégorie
2. **GET /api/lines/:id** - Détails d'une ligne (date création, début/fin activité, arrêts)
3. **GET /api/lines/:id/stops** - Liste détaillée des arrêts d'une ligne (nom, coordonnées, ordre)
4. **PUT /api/lines/:id** - Modification des détails d'une ligne
5. **POST /api/lines/:id/stops** - Ajout d'un arrêt à une ligne
6. **DELETE /api/lines/:id/stops/:id** - Suppression d'un arrêt d'une ligne

### Statistiques (authentification requise)

4. **GET /api/stats/distance/stops/:id/:id** - Distance entre deux arrêts
5. **GET /api/stats/distance/lines/:id** - Distance totale d'une ligne

## Scripts disponibles

- `npm run dev` - Démarre le serveur en mode développement avec nodemon
- `npm run init:db` - Initialise la structure de la base de données
- `npm run seed` - Peuple la base de données avec les données Tisséo

## Authentification

Tous les endpoints (sauf signup et login) nécessitent un token JWT dans le header:

```
Authorization: Bearer <votre_token>
```

## Données

Le projet contient les données de toutes les lignes Tisséo de Toulouse:
- 13 lignes Linéo
- 13 lignes de Bus classiques
- 1 ligne Express
- 2 Navettes
