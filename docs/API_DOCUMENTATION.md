# Documentation de l'API Tisséa

## Vue d'ensemble

L'API Tisséa est une API RESTful pour la gestion des transports publics (Bus, Métro, Tramway). Elle utilise l'authentification JWT et permet de consulter les lignes, les arrêts et de calculer des distances.

## URL de base

```
http://localhost:5000/api
```

## Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Après connexion ou inscription, un token est retourné et doit être inclus dans l'en-tête `Authorization` de toutes les requêtes protégées:

```
Authorization: Bearer <votre_token_jwt>
```

---

## Endpoints

### 1. Inscription

Créer un nouveau compte utilisateur.

**Endpoint:** `POST /api/users/signup`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123",
  "name": "Jean Dupont"
}
```

**Réponse (201 Created):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Jean Dupont"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs possibles:**
- 400: Email ou mot de passe manquant
- 400: Un utilisateur avec cet email existe déjà

---

### 2. Connexion

Se connecter avec un compte existant.

**Endpoint:** `POST /api/users/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Réponse (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Jean Dupont"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs possibles:**
- 400: Email ou mot de passe manquant
- 401: Email ou mot de passe incorrect

---

### 3. Lister les lignes par catégorie

Récupérer toutes les lignes d'une catégorie de transport.

**Endpoint:** `GET /api/categories/:id/lines`

**Headers:**
```
Authorization: Bearer <token>
```

**Paramètres URL:**
- `id`: ID de la catégorie (1 = Métro, 2 = Bus, 3 = Tramway)

**Exemple:**
```
GET /api/categories/1/lines
```

**Réponse (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Métro B",
    "number": "B",
    "color": "#FFA500",
    "categoryId": 1,
    "startTime": "05:15",
    "endTime": "00:00",
    "category": {
      "id": 1,
      "name": "Métro"
    }
  }
]
```

**Erreurs possibles:**
- 401: Token manquant ou invalide
- 404: Catégorie non trouvée

---

### 4. Détails d'une ligne

Obtenir les détails complets d'une ligne, incluant ses arrêts.

**Endpoint:** `GET /api/lines/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Paramètres URL:**
- `id`: ID de la ligne

**Exemple:**
```
GET /api/lines/1
```

**Réponse (200 OK):**
```json
{
  "id": 1,
  "name": "Métro B",
  "number": "B",
  "color": "#FFA500",
  "category": "Métro",
  "startTime": "05:15",
  "endTime": "00:00",
  "createdAt": "2025-01-07T19:01:57.000Z",
  "stops": [
    "Borderouge",
    "Trois Cocus",
    "La Vache",
    "Barrière de Paris",
    "..."
  ]
}
```

**Erreurs possibles:**
- 401: Token manquant ou invalide
- 404: Ligne non trouvée

---

### 5. Arrêts détaillés d'une ligne

Récupérer la liste détaillée des arrêts d'une ligne avec coordonnées GPS.

**Endpoint:** `GET /api/lines/:id/stops`

**Headers:**
```
Authorization: Bearer <token>
```

**Paramètres URL:**
- `id`: ID de la ligne

**Exemple:**
```
GET /api/lines/1/stops
```

**Réponse (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Borderouge",
    "latitude": 43.6356,
    "longitude": 1.4419,
    "order": 1
  },
  {
    "id": 2,
    "name": "Trois Cocus",
    "latitude": 43.6282,
    "longitude": 1.4388,
    "order": 2
  }
]
```

**Erreurs possibles:**
- 401: Token manquant ou invalide
- 404: Ligne non trouvée

---

### 6. Ajouter un arrêt à une ligne

Ajouter un nouvel arrêt à la fin d'une ligne.

**Endpoint:** `POST /api/lines/:id/stops`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Paramètres URL:**
- `id`: ID de la ligne

**Body:**
```json
{
  "name": "Nouveau Terminal",
  "latitude": 43.5500,
  "longitude": 1.4700
}
```

**Réponse (201 Created):**
```json
{
  "id": 28,
  "lineId": 1,
  "stopId": 28,
  "order": 18,
  "stop": {
    "id": 28,
    "name": "Nouveau Terminal",
    "latitude": 43.5500,
    "longitude": 1.4700
  }
}
```

**Erreurs possibles:**
- 400: Données manquantes (name, latitude, longitude)
- 401: Token manquant ou invalide
- 404: Ligne non trouvée

---

### 7. Modifier une ligne

Modifier les détails d'une ligne existante.

**Endpoint:** `PUT /api/lines/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Paramètres URL:**
- `id`: ID de la ligne

**Body (tous les champs sont optionnels):**
```json
{
  "name": "Métro B - Nouvelle Ligne",
  "number": "B",
  "color": "#FF0000",
  "startTime": "05:00",
  "endTime": "01:00"
}
```

**Réponse (200 OK):**
```json
{
  "id": 1,
  "name": "Métro B - Nouvelle Ligne",
  "number": "B",
  "color": "#FF0000",
  "startTime": "05:00",
  "endTime": "01:00",
  "category": {
    "id": 1,
    "name": "Métro"
  }
}
```

**Erreurs possibles:**
- 400: Données invalides
- 401: Token manquant ou invalide
- 404: Ligne non trouvée

---

### 8. Supprimer un arrêt d'une ligne

Supprimer un arrêt d'une ligne et réorganiser l'ordre des arrêts restants.

**Endpoint:** `DELETE /api/lines/:lineId/stops/:stopId`

**Headers:**
```
Authorization: Bearer <token>
```

**Paramètres URL:**
- `lineId`: ID de la ligne
- `stopId`: ID de l'arrêt à supprimer

**Exemple:**
```
DELETE /api/lines/1/stops/5
```

**Réponse (200 OK):**
```json
{
  "message": "Arrêt supprimé et ordre réorganisé"
}
```

**Erreurs possibles:**
- 400: Arrêt non trouvé sur cette ligne
- 401: Token manquant ou invalide

---

### 9. Distance entre deux arrêts

Calculer la distance en kilomètres entre deux arrêts.

**Endpoint:** `GET /api/stats/distance/stops/:id1/:id2`

**Headers:**
```
Authorization: Bearer <token>
```

**Paramètres URL:**
- `id1`: ID du premier arrêt
- `id2`: ID du deuxième arrêt

**Exemple:**
```
GET /api/stats/distance/stops/1/5
```

**Réponse (200 OK):**
```json
{
  "stop1": {
    "id": 1,
    "name": "Borderouge",
    "latitude": 43.6356,
    "longitude": 1.4419
  },
  "stop2": {
    "id": 5,
    "name": "Minimes Claude Nougaro",
    "latitude": 43.6108,
    "longitude": 1.4309
  },
  "distance": 2.89
}
```

**Erreurs possibles:**
- 401: Token manquant ou invalide
- 404: Un ou plusieurs arrêts non trouvés

---

### 10. Distance totale d'une ligne

Calculer la distance totale d'une ligne (somme des distances entre arrêts consécutifs).

**Endpoint:** `GET /api/stats/distance/lines/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Paramètres URL:**
- `id`: ID de la ligne

**Exemple:**
```
GET /api/stats/distance/lines/1
```

**Réponse (200 OK):**
```json
{
  "lineId": 1,
  "distance": 15.47
}
```

**Erreurs possibles:**
- 401: Token manquant ou invalide
- 404: Ligne non trouvée

---

## Codes d'erreur HTTP

| Code | Description |
|------|-------------|
| 200 | OK - Requête réussie |
| 201 | Created - Ressource créée avec succès |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Authentification requise ou token invalide |
| 404 | Not Found - Ressource non trouvée |
| 500 | Internal Server Error - Erreur serveur |

## Formule de calcul de distance

L'API utilise la **formule de Haversine** pour calculer la distance orthodromique entre deux points sur une sphère:

```
a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
c = 2 ⋅ atan2(√a, √(1−a))
d = R ⋅ c
```

Où:
- φ est la latitude
- λ est la longitude
- R est le rayon de la Terre (6371 km)

Le résultat est arrondi à 2 décimales.

## Limites de l'API

- Token JWT valide pendant 7 jours
- Aucune limitation de taux pour le moment
- Les horaires de ligne ne prennent pas en compte les jours fériés

## Exemples avec cURL

### Inscription
```bash
curl -X POST http://localhost:5000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

### Connexion
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Obtenir les lignes de métro
```bash
curl http://localhost:5000/api/categories/1/lines \
  -H "Authorization: Bearer VOTRE_TOKEN"
```
