# site_portfeuil

Projet React minimal créé avec Vite.

Prérequis : Node.js (v18+) et `npm` installés.

Commandes (PowerShell) :

```powershell
cd d:\Bureau\projects\site_portfeuil
npm install
npm run dev
```

- `npm run dev` : démarre le serveur de développement (Vite).
- `npm run build` : construit pour la production dans `dist/`.
- `npm run preview` : prévisualise le build de production.

Ce dépôt contient un scaffold de site portfolio avec :

- Pages : `Accueil`, `À propos`, `Projets`, `Contact`.
- Composants : `Nav`, `Footer`.

Après modification de `package.json` (ajout de dépendances), exécutez :

```powershell
cd d:\Bureau\projects\site_portfeuil
npm install
npm run dev
```

La dépendance `react-router-dom` a été ajoutée ; si `npm install` a déjà été lancé avant ce changement, relancez-le pour récupérer la nouvelle dépendance.
