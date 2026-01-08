# Guide de Démarrage Rapide - API Tisséa

## Installation en 5 minutes

### 1. Prérequis
- Node.js >= 18
- PostgreSQL >= 14
- Git

### 2. Cloner et installer

```bash
# Cloner le projet
git clone <url-du-repo>
cd express-tissea

# Backend
cd backend
npm install

# Frontend (dans un nouveau terminal)
cd frontend
npm install
```

### 3. Configuration PostgreSQL

```sql
-- Se connecter à PostgreSQL
psql -U postgres

-- Créer la base de données
CREATE DATABASE tissea_db;
```

### 4. Configuration Backend

Créer `backend/.env`:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/tissea_db"
JWT_SECRET="changez-cette-cle-secrete-en-production"
```

### 5. Initialiser la base de données

```bash
cd backend

# Appliquer les migrations
npx prisma migrate dev

# Peupler avec des données de test
npm run seed
```

### 6. Lancer l'application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Accéder à l'application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Tester l'API

### 1. Créer un compte
```bash
curl -X POST http://localhost:5000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

**Réponse:**
```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Copiez le token pour les prochaines requêtes.**

### 2. Obtenir les lignes de métro

```bash
curl http://localhost:5000/api/categories/1/lines \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

### 3. Voir les arrêts du Métro B

```bash
curl http://localhost:5000/api/lines/1/stops \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

### 4. Calculer la distance de la ligne

```bash
curl http://localhost:5000/api/stats/distance/lines/1 \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

## Utiliser l'interface Web

1. Ouvrir http://localhost:5173
2. Cliquer sur "S'inscrire"
3. Remplir le formulaire
4. Vous serez redirigé vers la carte
5. Sélectionner une catégorie (Métro, Bus, Tramway)
6. Sélectionner une ligne
7. La carte affichera tous les arrêts avec le tracé

## Données de Test

Après le seeding, vous aurez:

### Métro (Category ID: 1)
- **Ligne B** (ID: 1) - 17 arrêts
  - Borderouge → Ramonville
  - Horaires: 05:15 - 00:00

### Bus (Category ID: 2)
- **Ligne 14** (ID: 3) - 4 arrêts
  - Capitole → Patte d'Oie
  - Horaires: 06:00 - 21:00

### Tramway (Category ID: 3)
- **Ligne T1** (ID: 2) - 6 arrêts
  - Aéroconstellation → Matabiau SNCF
  - Horaires: 05:00 - 00:30

## Endpoints Principaux

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | /api/users/signup | Inscription | ❌ |
| POST | /api/users/login | Connexion | ❌ |
| GET | /api/categories/:id/lines | Lignes par catégorie | ✅ |
| GET | /api/lines/:id | Détails d'une ligne | ✅ |
| GET | /api/lines/:id/stops | Arrêts d'une ligne | ✅ |
| POST | /api/lines/:id/stops | Ajouter un arrêt | ✅ |
| PUT | /api/lines/:id | Modifier une ligne | ✅ |
| DELETE | /api/lines/:lineId/stops/:stopId | Supprimer un arrêt | ✅ |
| GET | /api/stats/distance/stops/:id1/:id2 | Distance entre arrêts | ✅ |
| GET | /api/stats/distance/lines/:id | Distance totale ligne | ✅ |

## Commandes Utiles

### Backend

```bash
# Démarrer le serveur
npm run dev

# Recréer la base de données
npx prisma migrate reset

# Peupler avec des données
npm run seed

# Générer le client Prisma
npx prisma generate

# Ouvrir Prisma Studio (interface DB)
npx prisma studio
```

### Frontend

```bash
# Démarrer en développement
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

## Résolution de Problèmes

### Le backend ne démarre pas

**Erreur: "Cannot connect to database"**
```bash
# Vérifier que PostgreSQL est lancé
sudo service postgresql status  # Linux
brew services list              # Mac
# Services Windows

# Vérifier les identifiants dans .env
```

**Erreur: "Port 5000 already in use"**
```bash
# Changer le port dans backend/.env
PORT=3000
```

### Le frontend ne se connecte pas à l'API

**Erreur: "Network Error"**
- Vérifier que le backend tourne sur http://localhost:5000
- Vérifier que CORS est activé dans `backend/src/app.js`

### Erreur Prisma

**"Prisma schema mismatch"**
```bash
cd backend
npx prisma generate
```

**"Migration failed"**
```bash
# Réinitialiser la base
npx prisma migrate reset

# Réappliquer
npx prisma migrate dev
npm run seed
```

### Leaflet ne s'affiche pas

**Les tuiles ne se chargent pas:**
- Vérifier la connexion internet
- Vérifier que leaflet CSS est importé
- F12 → Console pour voir les erreurs

## Variables d'Environnement

### Backend (.env)

```env
# Serveur
PORT=5000

# Base de données
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# JWT
JWT_SECRET="votre-cle-secrete-ultra-securisee"
```

### Frontend (optionnel)

Créer `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Puis modifier `frontend/src/services/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

## Outils Recommandés

- **Postman** ou **Insomnia** - Tester l'API
- **DBeaver** ou **pgAdmin** - Gérer PostgreSQL
- **VS Code** - Éditeur de code
  - Extension: Prisma
  - Extension: ES7 React snippets
  - Extension: REST Client

## Support

Pour plus d'informations:
- [Documentation complète de l'API](./API_DOCUMENTATION.md)
- [Schéma de base de données](./DATABASE_SCHEMA.md)
- [README principal](../README.md)
