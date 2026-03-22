# Unit 19 Gamifié — Data Structures & Algorithms

Plateforme d'apprentissage gamifiée pour le module **Unit 19 : Data Structures & Algorithms** (Bachelor 2).

## Structure

```
src/app/
├── page.tsx                    # Hub principal (carte des 4 mondes)
├── monde-1/                    # LO1 — Explorer les ADT
│   ├── ch1-design-spec/        # Mini-jeu : quiz ADT + Design Spec
│   ├── ch2-memory-stack/       # Mini-jeu : simulation stack mémoire
│   ├── ch3-fifo-sorting/       # Mini-jeu : course d'algorithmes tri
│   └── ch4-shortest-path/      # Mini-jeu : graphe interactif
├── monde-2/                    # LO2 — Notation formelle
├── monde-3/                    # LO3 — Implémentation Java
└── monde-4/                    # LO4 — Évaluer l'efficacité

docs/pptx/                      # Présentations cours (enseignant)
public/exercices/                # Exercices Java (starter code + corrections)
public/fiches/                   # Fiches mémo PDF (étudiants)
```

## Chapitres disponibles

| Monde | Chapitre | Critère | Statut |
|-------|----------|---------|--------|
| 1 | Ch.1 — Design Specification | P1 | ✅ Complet |
| 1 | Ch.2 — Memory Stack | P2 | 🔜 |
| 1 | Ch.3 — FIFO + Sorting | M1/M2 | 🔜 |
| 1 | Ch.4 — Shortest Path | D1 | 🔜 |

## Lancer en local

```bash
npm install
npm run dev
```

## Déployer sur Vercel

Le projet est configuré pour un export statique (`output: 'export'`). Connecter le repo GitHub à Vercel pour un déploiement automatique.

## Auteur

Mme MBI — Programmation Java — Bachelor 2
