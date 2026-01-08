# Checklist Soutenance - API Tisséa

## Avant la Soutenance (30 min avant)

### Vérifications Techniques

#### Backend
- [ ] PostgreSQL est démarré et accessible
- [ ] Base de données `tissea_db` existe
- [ ] `.env` est configuré correctement
- [ ] Données de test sont présentes (npm run seed)
- [ ] Backend démarre sans erreur (`npm run dev`)
- [ ] API accessible sur http://localhost:5000
- [ ] Root endpoint retourne la liste des routes

```bash
cd backend
npm run dev
# Vérifier: Server is running on port 5000
```

#### Frontend
- [ ] Dependencies installées
- [ ] Frontend démarre sans erreur (`npm run dev`)
- [ ] Application accessible sur http://localhost:5173
- [ ] Leaflet CSS chargé correctement
- [ ] Cartes s'affichent correctement

```bash
cd frontend
npm run dev
```

#### Tests API
- [ ] Tester inscription avec Postman/cURL
- [ ] Tester connexion et récupérer un token
- [ ] Tester au moins 3 endpoints protégés
- [ ] Vérifier que les données sont cohérentes

### Préparation Matérielle

#### Outils
- [ ] Postman ou Insomnia ouvert avec collection importée
- [ ] Navigateur avec onglets prêts:
  - [ ] http://localhost:5173 (Frontend)
  - [ ] http://localhost:5000 (API)
  - [ ] Console développeur F12 ouverte
- [ ] VS Code ouvert avec:
  - [ ] `backend/src/app.js`
  - [ ] `backend/prisma/schema.prisma`
  - [ ] `frontend/src/pages/Map.jsx`
  - [ ] `docs/DATABASE_SCHEMA.md`
- [ ] Prisma Studio prêt (`npx prisma studio`)
- [ ] Terminal multiplexé (2 terminaux visibles)

#### Documents
- [ ] Diaporama de présentation ouvert
- [ ] README.md accessible
- [ ] Documentation API accessible
- [ ] Schéma de base de données affiché

### Compte de Démonstration
- [ ] Créer un compte test: `demo@tissea.com` / `demo2026`
- [ ] Se connecter une fois pour vérifier
- [ ] Token sauvegardé quelque part si besoin

---

## Pendant la Soutenance

### 1. Présentation du Projet (2-3 min)

**Points à mentionner:**
- [ ] Contexte: API pour réseau de transports publics
- [ ] Objectifs: Consulter lignes, calculer distances, carte interactive
- [ ] Technologies: Express.js, PostgreSQL, Prisma, React, Leaflet

**Slide à montrer:** Slide 1

---

### 2. Choix des Technologies (2-3 min)

**Points à mentionner:**
- [ ] Backend: Express.js (léger, flexible)
- [ ] Base: PostgreSQL (relations complexes, intégrité)
- [ ] ORM: Prisma (migrations auto, type-safe)
- [ ] Frontend: React + Vite (performance)
- [ ] Carte: Leaflet (open-source, léger)

**Code à montrer:**
```javascript
// backend/src/app.js - Structure Express
// backend/prisma/schema.prisma - Modèle de données
```

**Slide à montrer:** Slide 2

---

### 3. Modèle de Données (2-3 min)

**Points à mentionner:**
- [ ] 5 tables: User, Category, Line, Stop, LineStop
- [ ] Relations: Category → Line → LineStop → Stop
- [ ] Gestion de l'ordre des arrêts
- [ ] Contraintes d'intégrité

**À montrer:**
- [ ] Schéma Prisma dans VS Code
- [ ] Diagramme dans la documentation
- [ ] Prisma Studio avec les données

**Commandes:**
```bash
cd backend
npx prisma studio
```

**Slide à montrer:** Slide 3

---

### 4. Gestion de Projet (1-2 min)

**Points à mentionner:**
- [ ] 4 phases: Conception, Backend, Frontend, Documentation
- [ ] Tout est complété (cocher les cases)
- [ ] ~18-20 heures de travail total

**Slide à montrer:** Slide 4

---

### 5. Démonstration de l'API (5-7 min)

#### 5.1 Endpoints d'Authentification

**À faire:**
1. Montrer Postman avec la collection importée
2. Tester `POST /api/users/signup`
   ```json
   {
     "email": "presentation@tissea.com",
     "password": "soutenance2026",
     "name": "Démo Soutenance"
   }
   ```
3. Copier le token retourné
4. Expliquer JWT (7 jours d'expiration, bcrypt pour le password)

**Points clés:**
- [ ] Création du compte réussie
- [ ] Token JWT retourné
- [ ] Password hashé (sécurité)

#### 5.2 Endpoints de Consultation

**À faire:**
1. `GET /api/categories/1/lines` - Lignes de métro
2. `GET /api/lines/1` - Détails Métro B
3. `GET /api/lines/1/stops` - Arrêts du Métro B

**Points clés:**
- [ ] Token dans header `Authorization: Bearer ...`
- [ ] Données cohérentes et structurées
- [ ] 17 arrêts pour le Métro B

#### 5.3 Endpoints de Modification

**À faire:**
1. `POST /api/lines/1/stops` - Ajouter un arrêt
   ```json
   {
     "name": "Test Soutenance",
     "latitude": 43.5400,
     "longitude": 1.4800
   }
   ```
2. Vérifier que l'arrêt a été ajouté (ordre automatique)
3. `DELETE /api/lines/1/stops/{id}` - Supprimer l'arrêt
4. Montrer que les ordres ont été réorganisés

**Points clés:**
- [ ] Ordre automatiquement incrémenté
- [ ] Réorganisation après suppression
- [ ] Intégrité des données maintenue

#### 5.4 Endpoints Statistiques

**À faire:**
1. `GET /api/stats/distance/stops/1/5` - Distance entre 2 arrêts
2. `GET /api/stats/distance/lines/1` - Distance totale Métro B (~15 km)
3. Expliquer la formule de Haversine

**Points clés:**
- [ ] Calcul précis avec Haversine
- [ ] Distance en kilomètres
- [ ] Arrondi à 2 décimales

**Slide à montrer:** Slide 5

---

### 6. Démonstration Frontend (3-5 min)

#### 6.1 Parcours Utilisateur

**À faire:**
1. Montrer la page d'accueil (http://localhost:5173)
2. Cliquer sur "S'inscrire" ou "Se connecter"
3. Se connecter avec le compte démo
4. Montrer la redirection automatique vers la carte

**Points clés:**
- [ ] Design moderne et responsive
- [ ] Gestion d'erreurs (afficher une erreur volontaire)
- [ ] Navigation fluide

#### 6.2 Carte Interactive

**À faire:**
1. Sélectionner "Métro" dans la catégorie
2. Sélectionner "Métro B"
3. Montrer:
   - Les 17 marqueurs sur la carte
   - Le tracé de la ligne (polyline orange)
   - Cliquer sur un marqueur → popup avec infos
   - Liste des arrêts en bas

4. Changer pour "Tramway T1"
5. Montrer la différence (6 arrêts, tracé rouge)

**Points clés:**
- [ ] Carte OpenStreetMap (Leaflet)
- [ ] Marqueurs interactifs
- [ ] Tracé coloré selon la ligne
- [ ] Informations détaillées (lat/lon, ordre)
- [ ] Horaires affichés

**Console F12:**
- [ ] Montrer qu'il n'y a pas d'erreurs
- [ ] Network: requêtes API réussies

**Slide à montrer:** Slide 6

---

### 7. Analyse des Écarts (1-2 min)

**Points à mentionner:**
- [ ] ✅ Tout réalisé: 10 endpoints, JWT, frontend, doc
- [ ] ✅ Améliorations: interface moderne, polylines
- [ ] ⚠️ Non fait: Tests unitaires (manque de temps)

**Points clés:**
- [ ] Honnêteté sur ce qui n'est pas fait
- [ ] Expliquer pourquoi (priorisation)
- [ ] Montrer ce qui a été fait en plus

**Slide à montrer:** Slide 7

---

### 8. Axes d'Amélioration (1-2 min)

**Points à mentionner:**
- [ ] Court terme: Tests, validation, rate limiting
- [ ] Moyen terme: Horaires temps réel, alertes
- [ ] Long terme: Microservices, déploiement cloud

**Slide à montrer:** Slide 8

---

### 9. Conclusion (1 min)

**Points à mentionner:**
- [ ] Projet complet et fonctionnel
- [ ] Toutes les specs respectées
- [ ] Documentation exhaustive
- [ ] Prêt pour production (avec améliorations)

**À montrer:**
- [ ] Arborescence du projet dans VS Code
- [ ] Dossier docs/ avec tous les fichiers
- [ ] README.md

---

## Questions / Réponses (10 min)

### Questions Probables

#### Sur les Choix Techniques

**Q: Pourquoi Express plutôt que NestJS ou FastAPI ?**
- [ ] Express: simple, léger, grande communauté
- [ ] Connaissance préalable du framework
- [ ] Parfait pour une API REST classique

**Q: Pourquoi PostgreSQL et pas MongoDB ?**
- [ ] Relations complexes (Category → Line → Stop)
- [ ] Intégrité référentielle (CASCADE)
- [ ] Contraintes UNIQUE sur l'ordre

**Q: Pourquoi Prisma ?**
- [ ] Migrations automatiques
- [ ] Requêtes type-safe
- [ ] Excellent support PostgreSQL
- [ ] Prisma Studio pour visualiser

#### Sur l'Implémentation

**Q: Comment gérez-vous l'ordre des arrêts ?**
- [ ] Table LineStop avec colonne `order`
- [ ] Contrainte UNIQUE(lineId, order)
- [ ] Réorganisation auto lors des suppressions
- [ ] Code dans `line.service.js:removeStopFromLine`

**Q: La formule de Haversine est-elle précise ?**
- [ ] Oui, ±0.5% pour distances < 1000 km
- [ ] Parfait pour réseau urbain
- [ ] Code dans `utils/distance.js`

**Q: Comment sécurisez-vous l'API ?**
- [ ] JWT avec expiration 7 jours
- [ ] bcrypt 10 rounds pour passwords
- [ ] Middleware auth sur toutes les routes protégées
- [ ] CORS configuré
- [ ] Validation des inputs

**Q: Que se passe-t-il si on supprime un arrêt utilisé par une ligne ?**
- [ ] Suppression en cascade (ON DELETE CASCADE)
- [ ] LineStop automatiquement supprimé
- [ ] Ordres réorganisés
- [ ] Intégrité maintenue

#### Sur le Frontend

**Q: Pourquoi React et pas Vue/Angular ?**
- [ ] Connaissance React
- [ ] Grande communauté
- [ ] Vite pour le build ultra rapide
- [ ] Leaflet bien intégré

**Q: Comment gérez-vous l'authentification côté client ?**
- [ ] Token dans localStorage
- [ ] Axios interceptor pour ajouter le token
- [ ] ProtectedRoute component
- [ ] Redirection auto si non connecté

#### Sur le Projet

**Q: Combien de temps avez-vous passé ?**
- [ ] ~18-20 heures total
- [ ] 2-3h conception
- [ ] 6-7h backend
- [ ] 5-6h frontend
- [ ] 2-3h documentation
- [ ] 1-2h tests

**Q: Comment déploieriez-vous en production ?**
- [ ] Backend: Railway, Render, ou Heroku
- [ ] Frontend: Vercel ou Netlify
- [ ] Base: PostgreSQL cloud (Supabase, Neon)
- [ ] Docker pour containerisation
- [ ] CI/CD avec GitHub Actions

---

## Après la Soutenance

### Nettoyage
- [ ] Arrêter les serveurs (Ctrl+C)
- [ ] Fermer Prisma Studio
- [ ] Commit final si nécessaire

### Archivage
- [ ] Créer un tag Git: `git tag v1.0.0`
- [ ] Push final: `git push --tags`
- [ ] Export de la base: `pg_dump tissea_db > backup.sql`

---

## Matériel de Secours

### Si le Backend Crash
```bash
cd backend
npm run dev
# Vérifier les logs
# Vérifier PostgreSQL
sudo service postgresql status
```

### Si le Frontend Crash
```bash
cd frontend
npm run dev
# Vérifier les logs
# Ctrl+F5 pour forcer le reload
```

### Si la Base est Vide
```bash
cd backend
npm run seed
```

### Si Prisma Bug
```bash
cd backend
npx prisma generate
npx prisma migrate reset
npm run seed
```

---

## Rappels Importants

- 🎯 Rester calme et confiant
- 🎯 Parler clairement et pas trop vite
- 🎯 Montrer le code autant que possible
- 🎯 Expliquer les choix techniques
- 🎯 Être honnête sur ce qui n'est pas fait
- 🎯 Montrer la documentation
- 🎯 Tester EN LIVE (montrer que ça marche vraiment)
- 🎯 Gérer le temps (10-15 min présentation max)

---

## Timing Suggéré

| Section | Durée | Cumul |
|---------|-------|-------|
| Présentation projet | 2-3 min | 3 min |
| Technologies | 2-3 min | 6 min |
| Modèle données | 2-3 min | 9 min |
| Gestion projet | 1-2 min | 10 min |
| Démo API | 5-7 min | 17 min |
| Démo Frontend | 3-5 min | 20 min |
| Écarts & Axes | 2-3 min | 23 min |
| **TOTAL** | **20-25 min** | |
| Questions/Réponses | 10 min | 35 min |

---

## Compte de Démonstration Pré-créé

**Email:** `demo@tissea.com`
**Password:** `demo2026`

**Créer avant la soutenance:**
```bash
curl -X POST http://localhost:5000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@tissea.com",
    "password": "demo2026",
    "name": "Compte Démo Soutenance"
  }'
```

---

**Bonne chance ! 🚀**
