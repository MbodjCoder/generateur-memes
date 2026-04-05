# MèmeStudio

Éditeur de mèmes en ligne moderne et intuitif, inspiré de l'expérience Canva. Créez, personnalisez et gérez vos mèmes avec un éditeur canvas professionnel directement dans votre navigateur.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)

---

## Aperçu

MèmeStudio est une application web full-stack pensée pour offrir une expérience d'édition fluide et professionnelle. L'éditeur repose sur un canvas interactif (Konva.js) qui permet de manipuler librement textes et images avec des gestes naturels : glisser-déposer, redimensionnement multi-directionnel, rotation, et édition inline.

## Fonctionnalités

### Éditeur Canvas

- **Manipulation libre** — Déplacez, redimensionnez et faites pivoter chaque élément depuis n'importe quel bord ou coin
- **Édition inline du texte** — Double-cliquez sur un texte pour le modifier directement sur le canvas (style Canva)
- **Multi-couches** — Superposez plusieurs images et textes avec gestion de l'ordre (monter / descendre)
- **Retournement** — Inversez les images horizontalement ou verticalement
- **Coins arrondis** — Ajustez le rayon de bordure des images
- **Opacité & rotation** — Contrôle fin sur chaque élément

### Texte avancé

- **Polices variées** — Impact, Arial, Comic Sans MS, Roboto, Montserrat, Open Sans, Oswald
- **Style complet** — Gras, italique, ombre portée, contour personnalisable
- **Couleurs** — Palette de couleurs prédéfinies + sélecteur de couleur libre
- **Taille ajustable** — De 12px à 120px avec contrôle par slider ou boutons +/-

### Images

- **Upload d'images** — Importez vos propres images depuis votre ordinateur
- **Templates** — 4 templates de mèmes classiques intégrés (Drake, Bouton, Cerveau, Change My Mind)
- **Modes d'ajustement** — Contenir, couvrir, remplir ou étirer selon vos besoins

### Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl+C` | Copier l'élément sélectionné |
| `Ctrl+V` | Coller l'élément copié |
| `Suppr` | Supprimer l'élément sélectionné |
| `Échap` | Désélectionner |

### Menu contextuel

- Clic droit sur un élément → copier, supprimer, monter/descendre dans les couches
- Clic droit sur le fond → coller, ajouter texte, ajouter image

### Galerie

- Sauvegardez vos mèmes dans une galerie persistante (SQLite)
- Modifiez un mème existant en cliquant dessus
- Supprimez les mèmes dont vous n'avez plus besoin

### Interface

- **Thème clair / sombre** — Basculez en un clic grâce au sélecteur dans la barre de navigation
- **Design responsive** — Interface adaptée aux écrans larges
- **Panneau latéral** — Contrôles contextuels selon l'élément sélectionné (texte ou image)
- **Panneau des couches** — Visualisez et réorganisez tous les éléments du canvas

## Stack technique

| Technologie | Rôle |
|-------------|------|
| **Next.js 16** (App Router) | Framework React full-stack |
| **TypeScript** | Typage statique strict |
| **react-konva / Konva.js** | Canvas interactif 2D |
| **Tailwind CSS 4** | Styles utilitaires avec thème personnalisé |
| **Prisma 7** + SQLite | ORM et base de données locale |
| **Framer Motion** | Animations fluides |
| **next-themes** | Gestion du thème clair/sombre |
| **lucide-react** | Icônes SVG |

## Installation

### Prérequis

- Node.js >= 18
- npm >= 9

### Étapes

```bash
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/generateur-memes.git
cd generateur-memes

# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Initialiser la base de données
npx prisma db push

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## Structure du projet

```
src/
├── app/
│   ├── api/memes/          # API REST (CRUD mèmes)
│   ├── galerie/             # Page galerie
│   ├── globals.css          # Thème et variables CSS
│   ├── layout.tsx           # Layout racine
│   └── page.tsx             # Page d'accueil (éditeur)
├── composants/
│   ├── editeur/
│   │   ├── CanvasMeme.tsx       # Canvas Konva interactif
│   │   ├── EditeurMeme.tsx      # Orchestrateur de l'éditeur
│   │   ├── ControlesTexte.tsx   # Panneau propriétés texte
│   │   ├── ControlesImage.tsx   # Panneau propriétés image
│   │   ├── BarreOutils.tsx      # Barre d'outils
│   │   ├── SelecteurTemplate.tsx # Sélection de templates
│   │   └── ZoneUpload.tsx       # Zone d'upload d'images
│   ├── galerie/
│   │   ├── GrilleGalerie.tsx    # Grille de mèmes sauvegardés
│   │   └── CarteMeme.tsx        # Carte individuelle
│   └── ui/
│       ├── BoutonTheme.tsx      # Toggle thème
│       ├── FournisseurTheme.tsx # Provider de thème
│       ├── MenuContextuel.tsx   # Menu clic droit
│       └── Navigation.tsx       # Barre de navigation
├── lib/
│   ├── constantes.ts        # Constantes (polices, couleurs, templates)
│   ├── prisma.ts            # Singleton Prisma
│   ├── types.ts             # Types TypeScript
│   └── utilitaires.ts       # Fonctions utilitaires
└── generated/prisma/        # Client Prisma généré
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement (Turbopack) |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | Vérification ESLint |

## Captures d'écran

> Les captures d'écran seront ajoutées prochainement.

## Licence

Ce projet est réalisé dans le cadre d'un projet académique.
