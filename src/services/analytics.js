import { ANALYTICS_CONFIG } from '../config/analytics'

// Google Analytics 4 Configuration
const GA_TRACKING_ID = ANALYTICS_CONFIG.GA_TRACKING_ID
const CLARITY_PROJECT_ID = ANALYTICS_CONFIG.CLARITY_PROJECT_ID
const JSONBIN_ANALYTICS_BIN = ANALYTICS_CONFIG.JSONBIN_ANALYTICS_BIN
const JSONBIN_API_KEY = ANALYTICS_CONFIG.JSONBIN_API_KEY

// Initialiser Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return

  // Charger le script GA4
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
  document.head.appendChild(script)

  // Initialiser gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href
  })
}

// Tracker une page vue
export const trackPageView = (pagePath, pageTitle) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: pagePath,
      page_title: pageTitle
    })
  }
}

// Tracker un événement personnalisé
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
  }
}

// Tracker le temps passé sur une page
export const trackTimeOnPage = (pageName, timeInSeconds) => {
  trackEvent('time_on_page', 'engagement', pageName, timeInSeconds)
}

// Microsoft Clarity Configuration
// Initialiser Microsoft Clarity
export const initClarity = () => {
  if (typeof window === 'undefined') return

  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
}

// Analytics personnalisé pour JSONBin.io
// Structure des données analytics
const createAnalyticsEntry = (action, data) => ({
  timestamp: new Date().toISOString(),
  action,
  data,
  userAgent: navigator.userAgent,
  url: window.location.href,
  referrer: document.referrer
})

// Envoyer données analytics vers JSONBin.io
export const sendCustomAnalytics = async (action, data) => {
  try {
    const entry = createAnalyticsEntry(action, data)
    
    // Récupérer les données existantes
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ANALYTICS_BIN}/latest`, {
      headers: {
        'X-Master-Key': '$2a$10$FJvuP5dH8S2yH9qR3LmKkeOr4tY8xJ2zF6nQ9mV1cH3sB7aE5pG4u'
      }
    })
    
    let analytics = []
    if (response.ok) {
      const result = await response.json()
      analytics = Array.isArray(result.record) ? result.record : []
    }
    
    // Ajouter la nouvelle entrée
    analytics.push(entry)
    
    // Garder seulement les 1000 dernières entrées pour éviter de surcharger
    if (analytics.length > 1000) {
      analytics = analytics.slice(-1000)
    }
    
    // Sauvegarder
    await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ANALYTICS_BIN}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify(analytics)
    })
  } catch (error) {
    console.error('Erreur envoi analytics:', error)
  }
}

// Récupérer les données analytics
export const getAnalyticsData = async () => {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ANALYTICS_BIN}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      return Array.isArray(result.record) ? result.record : []
    }
    return []
  } catch (error) {
    console.error('Erreur récupération analytics:', error)
    return []
  }
}

// Fonctions d'analyse des données
export const analyzeVisits = (analyticsData) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000))
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  
  const pageViews = analyticsData.filter(entry => entry.action === 'page_view')
  
  return {
    today: pageViews.filter(entry => new Date(entry.timestamp) >= today).length,
    thisWeek: pageViews.filter(entry => new Date(entry.timestamp) >= thisWeek).length,
    thisMonth: pageViews.filter(entry => new Date(entry.timestamp) >= thisMonth).length,
    total: pageViews.length,
    popularPages: getPopularPages(pageViews),
    hourlyStats: getHourlyStats(pageViews)
  }
}

const getPopularPages = (pageViews) => {
  const pageCounts = {}
  pageViews.forEach(entry => {
    const page = entry.data?.page || 'unknown'
    pageCounts[page] = (pageCounts[page] || 0) + 1
  })
  
  return Object.entries(pageCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([page, count]) => ({ page, count }))
}

const getHourlyStats = (pageViews) => {
  const hourlyData = new Array(24).fill(0)
  
  pageViews.forEach(entry => {
    const hour = new Date(entry.timestamp).getHours()
    hourlyData[hour]++
  })
  
  return hourlyData
}

// Hook pour tracker le temps passé sur une page
export const usePageTimer = (pageName) => {
  const startTime = Date.now()
  
  const endTimer = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    trackTimeOnPage(pageName, timeSpent)
    sendCustomAnalytics('time_on_page', { page: pageName, seconds: timeSpent })
  }
  
  // Nettoyer au démontage du composant
  return endTimer
}