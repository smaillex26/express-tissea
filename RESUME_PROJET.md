# Projet API Tisséo Express - Résumé Complet

## Vue d'ensemble

Projet d'API REST pour gérer le réseau de transport Tisséo de Toulouse, réalisé avec Node.js, Express et PostgreSQL.

## Technologies utilisées

- **Backend**: Node.js + Express.js
- **Base de données**: PostgreSQL (avec le package `pg` natif)
- **Authentification**: JWT (JSON Web Tokens)
- **Sécurité**: bcryptjs pour le hachage des mots de passe
- **Frontend**: React + Vite (dans le dossier `frontend/`)

## Structure de la base de données

### Tables

1. **users** - Utilisateurs de l'application
2. **categories** - Catégories de transport (Linéo, Bus, Express, Navette)
3. **lines** - Lignes de transport
4. **stops** - Arrêts
5. **line_stops** - Table de jonction (ligne ↔ arrêts) avec ordre

### Schéma détaillé

Voir le fichier `backend/database/SCHEMA_DIAGRAM.md` pour le diagramme complet.

## Endpoints API (Conformes à l'énoncé)

### Authentification

✅ **6. POST /api/users/signup** - Inscription d'un utilisateur
  - Body: `{email, password, name}`
  - Retourne: `{user, token}`

✅ **7. POST /api/users/login** - Connexion (retourne JWT)
  - Body: `{email, password}`
  - Retourne: `{user, token}`

### Endpoints protégés (nécessitent un token JWT)

✅ **1. GET /api/categories/:id/lines**
  - Retourne toutes les lignes d'une catégorie

✅ **2. GET /api/lines/:id**
  - Retourne les détails d'une ligne:
    - Date de création
    - Début d'activité (start_time)
    - Fin d'activité (end_time)
    - Liste des arrêts dans l'ordre

✅ **3. GET /api/lines/:id/stops**
  - Retourne la liste détaillée des arrêts:
    - Nom de chaque arrêt
    - Longitude et latitude
    - Ordre d'apparition sur la ligne

✅ **4. GET /api/stats/distance/stops/:id/:id**
  - Calcule la distance en km entre deux arrêts

✅ **5. GET /api/stats/distance/lines/:id**
  - Calcule la distance totale d'une ligne en km

✅ **8. POST /api/lines/:id/stops**
  - Ajout d'un arrêt à une ligne
  - Conserve l'intégrité de l'ordre des arrêts
  - Body: `{name, latitude, longitude}`

✅ **9. PUT /api/lines/:id**
  - Modification des détails d'une ligne
  - Body: `{name?, number?, color?, startTime?, endTime?}`

✅ **10. DELETE /api/lines/:id/stops/:id**
  - Suppression d'un arrêt d'une ligne
  - Réorganise automatiquement l'ordre des arrêts restants

## Données

Le projet contient **toutes les lignes Tisséo de Toulouse**:

- **13 lignes Linéo** (L1 à L13)
- **13 lignes de Bus classiques** (1, 2, 10, 14, 23, 27, 34, 36, 38, 41, 45, 52, 78)
- **1 ligne Express** (100)
- **2 Navettes** (NAV A, NAV C)

**Total**: 29 lignes, ~97 arrêts, ~209 relations ligne-arrêt

## Installation et utilisation

### 1. Configuration de la base de données

Créer une base PostgreSQL et configurer le `.env`:

```bash
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/tissea_db"
JWT_SECRET="votre-cle-secrete"
```

### 2. Initialiser la base de données

```bash
cd backend
npm install
npm run init:db    # Crée la structure de la base
npm run seed       # Peuple avec les données Tisséo
```

### 3. Lancer le serveur

```bash
npm run dev        # Mode développement avec nodemon
```

Le serveur démarre sur `http://localhost:5000`

### 4. Tester l'API

1. Créer un utilisateur:
```bash
curl -X POST http://localhost:5000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'
```

2. Utiliser le token retourné pour les autres endpoints:
```bash
curl -H "Authorization: Bearer <VOTRE_TOKEN>" \
  http://localhost:5000/api/categories/1/lines
```

## Architecture du projet

```
backend/
├── database/
│   ├── schema.sql           # Structure de la base
│   ├── seed.js              # Script de peuplement
│   ├── init.js              # Script d'initialisation
│   └── SCHEMA_DIAGRAM.md    # Diagramme du schéma
├── src/
│   ├── config/
│   │   └── database.js      # Configuration PostgreSQL (pg)
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── category.controller.js
│   │   ├── line.controller.js
│   │   └── stats.controller.js
│   ├── services/
│   │   ├── user.service.js
│   │   ├── category.service.js
│   │   ├── line.service.js
│   │   ├── stop.service.js
│   │   └── stats.service.js
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── category.routes.js
│   │   ├── line.routes.js
│   │   └── stats.routes.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── utils/
│   │   └── distance.js
│   ├── app.js
│   └── server.js
├── start-server.js          # Point d'entrée avec keep-alive
├── package.json
└── README.md

frontend/
└── [Application React]
```

## Points techniques importants

### Sécurité
- ✅ Toutes les requêtes SQL utilisent des requêtes paramétrées ($1, $2, etc.) pour prévenir les injections SQL
- ✅ Mots de passe hashés avec bcryptjs (10 rounds)
- ✅ Authentification JWT avec expiration (7 jours)
- ✅ Middleware d'authentification sur tous les endpoints sensibles

### Intégrité des données
- ✅ Contraintes d'unicité sur `line_stops(line_id, stop_id)` - un arrêt ne peut apparaître qu'une fois par ligne
- ✅ Contraintes d'unicité sur `line_stops(line_id, stop_order)` - l'ordre est unique par ligne
- ✅ Réorganisation automatique de l'ordre lors de la suppression d'un arrêt
- ✅ Triggers pour mise à jour automatique du champ `updated_at`

### Performances
- ✅ Index sur les clés étrangères
- ✅ Connection pooling PostgreSQL
- ✅ Requêtes optimisées avec JOIN pour éviter les N+1

## Exemple de ligne complète

**Ligne A du Métro** (stockée comme Linéo 7):
- Basso Cambo → Bellefontaine → Reynerie → Mirail - Université → Bagatelle → Mermoz → Fontaine Lestang → Arènes → Patte d'Oie → Saint Cyprien - République → Esquirol → Capitole → Jean Jaurès → Marengo - SNCF → Jolimont → Roseraie → Argoulets → Balma - Gramont

## Conformité avec l'énoncé

✅ Base de données PostgreSQL avec schéma documenté (SCHEMA_DIAGRAM.md)
✅ Tous les 10 endpoints requis sont implémentés
✅ Authentification JWT sur tous les endpoints (sauf signup/login)
✅ Intégrité des données (ordre des arrêts, pas plus de 2 terminus)
✅ Calcul des distances entre arrêts et lignes complètes
✅ CRUD complet sur les lignes et arrêts

## Tests effectués

Tous les endpoints ont été testés avec succès:
- ✅ Création d'utilisateur
- ✅ Connexion et obtention du token
- ✅ Récupération des lignes par catégorie
- ✅ Détails d'une ligne avec ses arrêts
- ✅ Liste détaillée des arrêts (coordonnées + ordre)
- ✅ Calcul de distance entre arrêts
- ✅ Calcul de distance d'une ligne complète
- ✅ Ajout d'arrêt à une ligne
- ✅ Modification d'une ligne
- ✅ Suppression d'arrêt avec réorganisation

## Migration Prisma → pg

Le projet a été migré de Prisma ORM vers PostgreSQL natif avec le package `pg`:
- ✅ Tous les fichiers Prisma supprimés
- ✅ Toutes les requêtes converties en SQL natif
- ✅ Gestion des transactions avec pg
- ✅ Scripts d'initialisation et de seed créés

## Améliorations possibles

1. Ajouter des tests unitaires et d'intégration
2. Implémenter la pagination sur les endpoints retournant des listes
3. Ajouter un cache Redis pour les requêtes fréquentes
4. Implémenter un système de logs (Winston, Morgan)
5. Ajouter la validation des données avec Joi ou Zod
6. Documenter l'API avec Swagger/OpenAPI

## Auteur

Projet développé dans le cadre du cours Express/FastAPI/Laravel - Tisséo Express API
