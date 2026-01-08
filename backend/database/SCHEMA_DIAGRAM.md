# Diagramme du schéma de la base de données

## Tables

### users
```
┌─────────────────────────────────┐
│          users                  │
├─────────────────────────────────┤
│ id           SERIAL PK           │
│ email        VARCHAR(255) UNIQUE │
│ password     VARCHAR(255)        │
│ name         VARCHAR(255)        │
│ created_at   TIMESTAMP           │
│ updated_at   TIMESTAMP           │
└─────────────────────────────────┘
```

### categories
```
┌─────────────────────────────────┐
│        categories               │
├─────────────────────────────────┤
│ id           SERIAL PK           │
│ name         VARCHAR(100) UNIQUE │
│ created_at   TIMESTAMP           │
│ updated_at   TIMESTAMP           │
└─────────────────────────────────┘
```

### lines
```
┌─────────────────────────────────┐
│          lines                  │
├─────────────────────────────────┤
│ id           SERIAL PK           │
│ name         VARCHAR(255)        │
│ number       VARCHAR(50)         │
│ color        VARCHAR(7)          │
│ category_id  INTEGER FK          │──┐
│ start_time   VARCHAR(5)          │  │
│ end_time     VARCHAR(5)          │  │
│ line_type    VARCHAR(50)         │  │
│ description  TEXT                │  │
│ created_at   TIMESTAMP           │  │
│ updated_at   TIMESTAMP           │  │
└─────────────────────────────────┘  │
                                      │
                ┌─────────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│        categories               │
└─────────────────────────────────┘
```

### stops
```
┌─────────────────────────────────┐
│          stops                  │
├─────────────────────────────────┤
│ id           SERIAL PK           │
│ name         VARCHAR(255)        │
│ latitude     DECIMAL(10,8)       │
│ longitude    DECIMAL(11,8)       │
│ created_at   TIMESTAMP           │
│ updated_at   TIMESTAMP           │
└─────────────────────────────────┘
```

### line_stops (table de jonction)
```
┌─────────────────────────────────┐
│        line_stops               │
├─────────────────────────────────┤
│ id           SERIAL PK           │
│ line_id      INTEGER FK          │──┐
│ stop_id      INTEGER FK          │──┼──┐
│ stop_order   INTEGER             │  │  │
│ created_at   TIMESTAMP           │  │  │
│ updated_at   TIMESTAMP           │  │  │
│                                  │  │  │
│ UNIQUE(line_id, stop_id)         │  │  │
│ UNIQUE(line_id, stop_order)      │  │  │
└─────────────────────────────────┘  │  │
                                      │  │
        ┌─────────────────────────────┘  │
        │                                │
        ▼                                ▼
┌─────────────────┐          ┌─────────────────┐
│     lines       │          │     stops       │
└─────────────────┘          └─────────────────┘
```

## Relations

1. **categories → lines** (1:N)
   - Une catégorie peut avoir plusieurs lignes
   - Une ligne appartient à une seule catégorie

2. **lines ↔ stops** (N:M via line_stops)
   - Une ligne peut avoir plusieurs arrêts
   - Un arrêt peut appartenir à plusieurs lignes
   - La table line_stops maintient l'ordre des arrêts (stop_order)
   - Contraintes d'unicité:
     - Un arrêt ne peut apparaître qu'une fois sur une ligne
     - L'ordre des arrêts est unique par ligne

## Indexes

- `idx_lines_category_id` sur `lines(category_id)`
- `idx_lines_line_type` sur `lines(line_type)`
- `idx_line_stops_line_id` sur `line_stops(line_id)`
- `idx_line_stops_stop_id` sur `line_stops(stop_id)`

## Triggers

- Tous les tables ont un trigger `update_updated_at` qui met à jour automatiquement le champ `updated_at` lors d'une modification.

## Données initiales

Le script de seed (`database/seed.js`) peuple la base avec:
- 4 catégories: Linéo, Bus, Express, Navette
- 29 lignes de transport
- ~97 arrêts
- ~209 relations ligne-arrêt
