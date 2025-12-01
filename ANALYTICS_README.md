# 📊 Analytics du Portfolio

Ce portfolio intègre un système d'analytics complet avec Google Analytics 4, Microsoft Clarity et un système custom utilisant JSONBin.io.

## 🚀 Fonctionnalités

### Analytics Intégrés
- **Google Analytics 4** : Suivi des visiteurs, pages, conversions
- **Microsoft Clarity** : Heatmaps, enregistrements de sessions
- **Analytics Custom** : Stockage des données dans JSONBin.io

### Dashboard Admin
- Statistiques en temps réel (jour/semaine/mois)
- Pages les plus visitées
- Graphique par heures de visite
- Événements personnalisés (clics projets, temps passé)
- Activité récente des visiteurs

### Conformité RGPD
- Bannière de consentement des cookies
- Gestion granulaire des préférences
- Respect de la vie privée

## ⚙️ Configuration

### 1. Google Analytics 4

1. Allez sur [Google Analytics](https://analytics.google.com/)
2. Créez une nouvelle propriété GA4
3. Copiez votre ID de mesure (format: `G-XXXXXXXXXX`)
4. Modifiez `src/config/analytics.js`:

```javascript
export const ANALYTICS_CONFIG = {
  GA_TRACKING_ID: 'G-VOTRE-ID-ICI', // Remplacez par votre ID
  // ...
}
```

### 2. Microsoft Clarity

1. Allez sur [Microsoft Clarity](https://clarity.microsoft.com/)
2. Créez un nouveau projet
3. Copiez votre Project ID
4. Modifiez `src/config/analytics.js`:

```javascript
export const ANALYTICS_CONFIG = {
  CLARITY_PROJECT_ID: 'VOTRE-ID-ICI', // Remplacez par votre ID
  // ...
}
```

### 3. JSONBin.io pour Analytics Custom

1. Créez un nouveau BIN sur [JSONBin.io](https://jsonbin.io/)
2. Copiez l'ID du BIN créé
3. Modifiez `src/config/analytics.js`:

```javascript
export const ANALYTICS_CONFIG = {
  JSONBIN_ANALYTICS_BIN: 'VOTRE-BIN-ID-ICI',
  JSONBIN_API_KEY: 'VOTRE-CLE-API-ICI',
  // ...
}
```

## 📈 Utilisation

### Pages Trackées Automatiquement
- Toutes les pages du portfolio sont automatiquement trackées
- Temps passé sur chaque page
- Navigation entre les sections

### Événements Personnalisés
- **Clics sur projets** : Quand un visiteur clique sur "Voir" d'un projet
- **Contacts** : Interactions avec les informations de contact
- **Sections vues** : Défilement et visualisation des sections

### Dashboard Analytics
Accessible via `/admin` → onglet "📊 Analytics"

#### Métriques Disponibles
- **Visites** : Aujourd'hui, cette semaine, ce mois, total
- **Pages populaires** : Classement des pages les plus visitées
- **Répartition horaire** : Graphique des visites par heure
- **Activité récente** : Liste des dernières visites avec détails

## 🔒 Conformité et Confidentialité

### Bannière RGPD
- S'affiche automatiquement à la première visite
- Permet de choisir les cookies : nécessaires, analytics, marketing
- Respecte le choix de l'utilisateur
- Bouton de gestion accessible via l'icône 🍪

### Données Collectées
- **Analytics Google/Clarity** : Uniquement si consentement donné
- **Analytics Custom** : Pages visitées, temps passé, événements
- **Pas de données personnelles** : Anonymisation complète

## 📊 API Analytics

### Hooks Disponibles

```javascript
import { useAnalytics, usePageTracking } from '../hooks/useAnalytics'

// Dans un composant
const { trackCustomEvent, trackProjectClick } = useAnalytics()
usePageTracking('nom-page', 'Titre Page')

// Tracker un événement
trackCustomEvent('button_click', { button: 'download-cv' })
```

### Services

```javascript
import { 
  trackPageView, 
  trackEvent, 
  sendCustomAnalytics,
  getAnalyticsData 
} from '../services/analytics'
```

## 🛠️ Structure des Fichiers

```
src/
├── config/
│   └── analytics.js          # Configuration centralisée
├── services/
│   └── analytics.js          # Services Google Analytics + Custom
├── hooks/
│   └── useAnalytics.js       # Hooks React pour analytics
├── components/
│   └── CookieConsent.jsx     # Bannière RGPD
└── pages/
    └── Analytics.jsx         # Dashboard admin
```

## 🔧 Personnalisation

### Ajouter de Nouveaux Événements

```javascript
// Dans un composant
const { trackCustomEvent } = useAnalytics()

const handleCustomAction = () => {
  trackCustomEvent('custom_action', { 
    value: 'specific_value',
    category: 'user_interaction'
  })
}
```

### Modifier les Métriques

Éditez `src/services/analytics.js` pour ajouter de nouvelles fonctions d'analyse :

```javascript
export const analyzeCustomMetric = (analyticsData) => {
  // Votre logique d'analyse
  return results
}
```

## 🚀 Déploiement

1. **Configurez vos IDs** dans `src/config/analytics.js`
2. **Testez en local** pour vérifier le bon fonctionnement
3. **Déployez** votre application
4. **Vérifiez** que les analytics remontent bien dans GA4 et Clarity

## ⚠️ Notes Importantes

- Les analytics ne fonctionnent qu'en production (domaines configurés)
- Testez d'abord en local avec des IDs de développement
- La bannière RGPD s'affiche automatiquement à la première visite
- Les données analytics sont stockées pendant 30 jours dans JSONBin.io

## 📞 Support

Pour toute question sur la configuration des analytics, consultez :
- [Documentation GA4](https://support.google.com/analytics/answer/10089681)
- [Documentation Clarity](https://docs.microsoft.com/en-us/clarity/)
- [Documentation JSONBin.io](https://jsonbin.io/api-reference)