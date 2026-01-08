# Schéma de Base de Données - API Tisséa

## Diagramme de Relations

```
┌─────────────────┐
│     Category    │
├─────────────────┤
│ id (PK)         │
│ name (UNIQUE)   │
│ createdAt       │
│ updatedAt       │
└────────┬────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐
│      Line       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ number          │
│ color           │
│ categoryId (FK) │
│ startTime       │
│ endTime         │
│ createdAt       │
│ updatedAt       │
└────────┬────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐          ┌─────────────────┐
│    LineStop     │          │      Stop       │
├─────────────────┤          ├─────────────────┤
│ id (PK)         │          │ id (PK)         │
│ lineId (FK) ────┼─────N:1──┤ name            │
│ stopId (FK) ────┼──────────┤ latitude        │
│ order           │          │ longitude       │
│ createdAt       │          │ createdAt       │
│ updatedAt       │          │ updatedAt       │
└─────────────────┘          └─────────────────┘

┌─────────────────┐
│      User       │
├─────────────────┤
│ id (PK)         │
│ email (UNIQUE)  │
│ password        │
│ name            │
│ createdAt       │
│ updatedAt       │
└─────────────────┘
```

## Tables

### 1. User
Table des utilisateurs de l'application.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Identifiant unique |
| email | VARCHAR | UNIQUE, NOT NULL | Email de l'utilisateur |
| password | VARCHAR | NOT NULL | Mot de passe hashé (bcrypt) |
| name | VARCHAR | NULL | Nom de l'utilisateur |
| createdAt | TIMESTAMP | DEFAULT NOW() | Date de création |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Date de dernière modification |

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE (email)

---

### 2. Category
Table des catégories de transport.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Identifiant unique |
| name | VARCHAR | UNIQUE, NOT NULL | Nom de la catégorie (Bus, Métro, Tramway) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Date de création |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Date de dernière modification |

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE (name)

**Données initiales:**
- 1: Métro
- 2: Bus
- 3: Tramway

---

### 3. Line
Table des lignes de transport.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Identifiant unique |
| name | VARCHAR | NOT NULL | Nom complet de la ligne (ex: "Métro B") |
| number | VARCHAR | NOT NULL | Numéro/lettre de la ligne (ex: "B", "14") |
| color | VARCHAR | NULL | Couleur en hexadécimal (ex: "#FFA500") |
| categoryId | INT | FK, NOT NULL | Référence vers Category |
| startTime | VARCHAR | NOT NULL | Heure de début d'activité (format HH:mm) |
| endTime | VARCHAR | NOT NULL | Heure de fin d'activité (format HH:mm) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Date de création |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Date de dernière modification |

**Relations:**
- categoryId → Category(id) ON DELETE CASCADE

**Indexes:**
- PRIMARY KEY (id)
- INDEX (categoryId)

---

### 4. Stop
Table des arrêts/stations.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Identifiant unique |
| name | VARCHAR | NOT NULL | Nom de l'arrêt |
| latitude | FLOAT | NOT NULL | Latitude GPS (WGS84) |
| longitude | FLOAT | NOT NULL | Longitude GPS (WGS84) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Date de création |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Date de dernière modification |

**Indexes:**
- PRIMARY KEY (id)

**Notes:**
- Coordonnées GPS au format WGS84
- Latitude: -90 à +90 (Nord/Sud)
- Longitude: -180 à +180 (Est/Ouest)

---

### 5. LineStop
Table d'association entre les lignes et les arrêts (avec ordre).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Identifiant unique |
| lineId | INT | FK, NOT NULL | Référence vers Line |
| stopId | INT | FK, NOT NULL | Référence vers Stop |
| order | INT | NOT NULL | Ordre de l'arrêt sur la ligne (1, 2, 3...) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Date de création |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Date de dernière modification |

**Relations:**
- lineId → Line(id) ON DELETE CASCADE
- stopId → Stop(id) ON DELETE CASCADE

**Contraintes:**
- UNIQUE (lineId, stopId) - Un arrêt ne peut apparaître qu'une fois sur une ligne
- UNIQUE (lineId, order) - L'ordre doit être unique par ligne

**Indexes:**
- PRIMARY KEY (id)
- INDEX (lineId)
- INDEX (stopId)

**Notes:**
- L'ordre commence à 1
- En cas de suppression d'un arrêt, les ordres sont automatiquement réorganisés

---

## Règles de Gestion

### Intégrité Référentielle

1. **Suppression en cascade:**
   - Si une Category est supprimée → toutes les Lines associées sont supprimées
   - Si une Line est supprimée → tous les LineStops associés sont supprimés
   - Si un Stop est supprimé → tous les LineStops associés sont supprimés

2. **Ordre des arrêts:**
   - L'ordre doit être séquentiel (1, 2, 3, ...)
   - Pas de sauts dans la séquence
   - Pas de doublons d'ordre sur une même ligne

3. **Terminaisons:**
   - Une ligne ne peut pas avoir plus de 2 terminus
   - Les arrêts avec order = 1 et order = MAX sont les terminus

### Validation des Données

1. **User:**
   - Email doit être valide et unique
   - Mot de passe minimum 6 caractères (hashé avec bcrypt)

2. **Line:**
   - startTime et endTime au format HH:mm (24h)
   - color au format hexadécimal (#RRGGBB) ou null

3. **Stop:**
   - latitude: -90.0 à +90.0
   - longitude: -180.0 à +180.0

4. **Category:**
   - name: unique et non vide

## Migrations Prisma

Les migrations sont gérées par Prisma:

```bash
# Créer une nouvelle migration
npx prisma migrate dev --name description_migration

# Appliquer les migrations
npx prisma migrate deploy

# Réinitialiser la base
npx prisma migrate reset
```

## Seeding

Le fichier `prisma/seed.js` contient des données de test:
- 3 catégories (Métro, Bus, Tramway)
- Métro ligne B: 17 arrêts (données Toulouse)
- Tramway T1: 6 arrêts
- Bus 14: 4 arrêts

```bash
npm run seed
```

## Performances

### Index recommandés
- Category.name (UNIQUE)
- User.email (UNIQUE)
- LineStop.lineId
- LineStop.stopId
- LineStop(lineId, order) (UNIQUE composite)
- LineStop(lineId, stopId) (UNIQUE composite)
- Line.categoryId

### Optimisations
- Utilisation de EXPLAIN pour analyser les requêtes
- Index sur les colonnes fréquemment filtrées
- Pagination recommandée pour les grandes listes

## Exemples de Requêtes SQL

### Obtenir tous les arrêts d'une ligne dans l'ordre
```sql
SELECT s.*, ls.order
FROM "Stop" s
JOIN "LineStop" ls ON s.id = ls."stopId"
WHERE ls."lineId" = 1
ORDER BY ls.order ASC;
```

### Calculer le nombre d'arrêts par ligne
```sql
SELECT l.name, COUNT(ls.id) as stop_count
FROM "Line" l
LEFT JOIN "LineStop" ls ON l.id = ls."lineId"
GROUP BY l.id, l.name;
```

### Trouver les lignes passant par un arrêt donné
```sql
SELECT l.*
FROM "Line" l
JOIN "LineStop" ls ON l.id = ls."lineId"
WHERE ls."stopId" = 5;
```

## Évolutions Futures

Améliorations possibles:
- Table `Schedule` pour horaires détaillés
- Table `Vehicle` pour le matériel roulant
- Table `Alert` pour les perturbations
- Table `Ticket` pour la billetterie
- Support multi-langues pour les noms
- Historique des modifications
