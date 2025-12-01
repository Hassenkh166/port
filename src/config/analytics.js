// Configuration des services d'analytics
// Remplacez ces IDs par vos vrais IDs de production

export const ANALYTICS_CONFIG = {
  // Google Analytics 4
  GA_TRACKING_ID: 'G-XXXXXXXXXX', // Remplacez par votre ID GA4
  
  // Microsoft Clarity
  CLARITY_PROJECT_ID: 'ub0n1qcn7n', // ID Clarity configuré
  
  // JSONBin.io pour analytics custom
  JSONBIN_ANALYTICS_BIN: '692413a4d0ea881f40fc7e17', // BIN dédié aux analytics
  JSONBIN_API_KEY: '$2a$10$3r7kDRCHHLsIWHqYZEujdOMqezQCN0gR7FbVhoj2CoVKkgIxN48.C',
  
  // Configuration des événements
  EVENTS_CONFIG: {
    // Délai minimum entre les événements similaires (en ms)
    THROTTLE_DELAY: 1000,
    
    // Durée minimum sur une page avant de tracker (en secondes)
    MIN_TIME_ON_PAGE: 5,
    
    // Nombre maximum d'entrées analytics à garder
    MAX_ANALYTICS_ENTRIES: 1000
  },
  
  // URLs et endpoints
  ENDPOINTS: {
    JSONBIN_BASE: 'https://api.jsonbin.io/v3/b',
    GA_SCRIPT: 'https://www.googletagmanager.com/gtag/js',
    CLARITY_SCRIPT: 'https://www.clarity.ms/tag'
  }
}

// Instructions de configuration
export const SETUP_INSTRUCTIONS = {
  googleAnalytics: {
    title: "Configuration Google Analytics 4",
    steps: [
      "1. Allez sur https://analytics.google.com/",
      "2. Créez une propriété GA4",
      "3. Copiez votre ID de mesure (G-XXXXXXXXXX)",
      "4. Remplacez GA_TRACKING_ID dans ce fichier"
    ]
  },
  
  microsoftClarity: {
    title: "Configuration Microsoft Clarity",
    steps: [
      "1. Allez sur https://clarity.microsoft.com/",
      "2. Créez un nouveau projet",
      "3. Copiez votre Project ID",
      "4. Remplacez CLARITY_PROJECT_ID dans ce fichier"
    ]
  },
  
  jsonbin: {
    title: "Configuration JSONBin.io Analytics",
    steps: [
      "1. Créez un nouveau BIN sur https://jsonbin.io/",
      "2. Copiez l'ID du BIN créé",
      "3. Remplacez JSONBIN_ANALYTICS_BIN dans ce fichier",
      "4. Utilisez votre clé API JSONBin existante"
    ]
  }
}

export default ANALYTICS_CONFIG