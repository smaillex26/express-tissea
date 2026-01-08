# Commandes Utiles - API Tisséa

## Installation et Configuration

### Installation complète
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Configuration PostgreSQL
```bash
# Windows
# Démarrer PostgreSQL via Services

# Linux
sudo service postgresql start
sudo service postgresql status

# Mac
brew services start postgresql
brew services list

# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE tissea_db;

# Lister les bases
\l

# Quitter
\q
```

### Variables d'environnement
```bash
# Créer le fichier .env dans backend/
echo 'PORT=5000' > backend/.env
echo 'DATABASE_URL="postgresql://postgres:VOTRE_PASSWORD@localhost:5432/tissea_db"' >> backend/.env
echo 'JWT_SECRET="votre-cle-secrete-ultra-securisee"' >> backend/.env
```

## Prisma

### Migrations
```bash
cd backend

# Créer une nouvelle migration
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Réinitialiser la base de données (ATTENTION: efface toutes les données!)
npx prisma migrate reset

# Voir l'état des migrations
npx prisma migrate status

# Générer le client Prisma après modification du schéma
npx prisma generate
```

### Prisma Studio
```bash
# Ouvrir l'interface graphique de la base de données
npx prisma studio
# Accessible sur http://localhost:5555
```

### Seeding
```bash
# Peupler la base avec des données de test
npm run seed

# Ou directement
node prisma/seed.js
```

## Développement

### Lancer les serveurs

**Backend (Terminal 1)**
```bash
cd backend
npm run dev
# API accessible sur http://localhost:5000
```

**Frontend (Terminal 2)**
```bash
cd frontend
npm run dev
# App accessible sur http://localhost:5173
```

### Build de production

**Backend**
```bash
cd backend
# Pas de build nécessaire, mais générer le client Prisma
npx prisma generate
```

**Frontend**
```bash
cd frontend

# Build
npm run build
# Sortie dans frontend/dist/

# Prévisualiser le build
npm run preview
```

## Tests API avec cURL

### Authentification

**Inscription**
```bash
curl -X POST http://localhost:5000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

**Connexion**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Sauvegarder le token dans une variable**
```bash
# Bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.token')

echo $TOKEN

# PowerShell
$response = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/users/login" `
  -ContentType "application/json" `
  -Body '{"email":"user@example.com","password":"password123"}'
$TOKEN = $response.token
```

### Consultation

**Lignes de métro**
```bash
curl http://localhost:5000/api/categories/1/lines \
  -H "Authorization: Bearer $TOKEN"
```

**Détails Métro B**
```bash
curl http://localhost:5000/api/lines/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Arrêts du Métro B**
```bash
curl http://localhost:5000/api/lines/1/stops \
  -H "Authorization: Bearer $TOKEN"
```

### Modification

**Ajouter un arrêt**
```bash
curl -X POST http://localhost:5000/api/lines/1/stops \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nouveau Terminal",
    "latitude": 43.5500,
    "longitude": 1.4700
  }'
```

**Modifier une ligne**
```bash
curl -X PUT http://localhost:5000/api/lines/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Métro B - Nouvelle Version",
    "startTime": "05:00",
    "endTime": "01:00"
  }'
```

**Supprimer un arrêt**
```bash
curl -X DELETE http://localhost:5000/api/lines/1/stops/17 \
  -H "Authorization: Bearer $TOKEN"
```

### Statistiques

**Distance entre deux arrêts**
```bash
curl http://localhost:5000/api/stats/distance/stops/1/5 \
  -H "Authorization: Bearer $TOKEN"
```

**Distance totale d'une ligne**
```bash
curl http://localhost:5000/api/stats/distance/lines/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Git

### Initialisation
```bash
git init
git add .
git commit -m "Initial commit: API Tisséa Express"
git branch -M main
```

### Créer le repository GitHub
```bash
# Créer un repo privé sur GitHub nommé: express-tissea
# Puis:
git remote add origin https://github.com/VOTRE_USERNAME/express-tissea.git
git push -u origin main
```

### Commits réguliers
```bash
git status
git add .
git commit -m "feat: ajout de la fonctionnalité X"
git push
```

### Conventions de commit
```bash
git commit -m "feat: nouvelle fonctionnalité"
git commit -m "fix: correction de bug"
git commit -m "docs: mise à jour documentation"
git commit -m "refactor: refactorisation du code"
git commit -m "test: ajout de tests"
git commit -m "chore: tâches maintenance"
```

## PostgreSQL Direct

### Se connecter
```bash
psql -U postgres -d tissea_db
```

### Commandes SQL utiles
```sql
-- Lister les tables
\dt

-- Décrire une table
\d "User"
\d "Line"

-- Voir tous les arrêts
SELECT * FROM "Stop";

-- Voir toutes les lignes avec leur catégorie
SELECT l.name, l.number, c.name as category
FROM "Line" l
JOIN "Category" c ON l."categoryId" = c.id;

-- Compter les arrêts par ligne
SELECT l.name, COUNT(ls.id) as stop_count
FROM "Line" l
LEFT JOIN "LineStop" ls ON l.id = ls."lineId"
GROUP BY l.id, l.name;

-- Voir les arrêts du Métro B dans l'ordre
SELECT s.name, ls.order
FROM "Stop" s
JOIN "LineStop" ls ON s.id = ls."stopId"
WHERE ls."lineId" = 1
ORDER BY ls.order;

-- Quitter
\q
```

## Debugging

### Logs Backend
```bash
# Nodemon affiche les logs en temps réel
cd backend
npm run dev

# Logs détaillés avec DEBUG
DEBUG=* npm run dev
```

### Logs Frontend
```bash
# Console navigateur: F12 → Console
# Ou dans le terminal
cd frontend
npm run dev
```

### Prisma Debug
```bash
# Voir les requêtes SQL générées
DEBUG="prisma:query" npm run dev
```

## Nettoyage

### Supprimer node_modules
```bash
# Backend
rm -rf backend/node_modules
cd backend && npm install

# Frontend
rm -rf frontend/node_modules
cd frontend && npm install

# Les deux
rm -rf backend/node_modules frontend/node_modules
cd backend && npm install
cd ../frontend && npm install
```

### Réinitialiser la base
```bash
cd backend
npx prisma migrate reset
npm run seed
```

### Nettoyer les builds
```bash
rm -rf frontend/dist
```

## Vérifications

### Ports utilisés
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Linux/Mac
lsof -i :5000
lsof -i :5173
```

### Tuer un processus sur un port
```bash
# Windows
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

### Version des outils
```bash
node --version
npm --version
npx prisma --version
psql --version
git --version
```

## Performance

### Analyser le bundle frontend
```bash
cd frontend
npm run build
npx vite-bundle-visualizer
```

### Profiler PostgreSQL
```sql
-- Activer le timing
\timing

-- Expliquer une requête
EXPLAIN ANALYZE
SELECT * FROM "Line" WHERE "categoryId" = 1;
```

## Import/Export

### Export de la base
```bash
# Export complet
pg_dump -U postgres tissea_db > backup.sql

# Export des données seulement
pg_dump -U postgres --data-only tissea_db > data.sql
```

### Import
```bash
# Import
psql -U postgres tissea_db < backup.sql
```

## Raccourcis Développement

### Aliases Bash (optionnel)
```bash
# Ajouter dans ~/.bashrc ou ~/.zshrc
alias tissea-backend="cd ~/express-tissea/backend && npm run dev"
alias tissea-frontend="cd ~/express-tissea/frontend && npm run dev"
alias tissea-seed="cd ~/express-tissea/backend && npm run seed"
alias tissea-studio="cd ~/express-tissea/backend && npx prisma studio"

# Recharger
source ~/.bashrc
```

### Scripts PowerShell (Windows)
```powershell
# Créer start-tissea.ps1
# Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
```

## Tests Rapides

### Vérifier que tout fonctionne
```bash
# 1. Backend accessible
curl http://localhost:5000/

# 2. Créer un compte
curl -X POST http://localhost:5000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"quick@test.com","password":"test123","name":"Quick Test"}'

# 3. Se connecter et récupérer le token
# 4. Tester un endpoint protégé
# 5. Ouvrir le frontend dans le navigateur
```

## Documentation

### Générer la doc Prisma
```bash
cd backend
npx prisma generate
# Voir node_modules/.prisma/client/
```

### Servir la doc en local
```bash
# Installer markdown viewer
npm install -g markdown-http

# Servir le README
cd express-tissea
markdown-http README.md
```

## Troubleshooting Rapide

**Problème: Cannot find module '@prisma/client'**
```bash
cd backend
npx prisma generate
```

**Problème: Port already in use**
```bash
# Changer le port dans .env ou tuer le processus
```

**Problème: Leaflet map not showing**
```bash
# Vérifier import CSS dans main.jsx ou index.html
import 'leaflet/dist/leaflet.css'
```

**Problème: CORS error**
```bash
# Vérifier que cors() est activé dans backend/src/app.js
```

**Problème: JWT token invalid**
```bash
# Vérifier que JWT_SECRET est identique partout
# Régénérer un token en se reconnectant
```
