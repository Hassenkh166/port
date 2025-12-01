import React, { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Toujours activé
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Vérifier si le consentement a déjà été donné
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setShowBanner(true)
    } else {
      const savedPreferences = JSON.parse(consent)
      setPreferences(savedPreferences)
      
      // Activer les services basés sur le consentement sauvegardé
      if (savedPreferences.analytics) {
        enableAnalytics()
      }
    }
  }, [])

  const enableAnalytics = () => {
    // Initialiser Google Analytics et Clarity uniquement si consentement donné
    if (window.gtag && window.clarity) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      })
    }
  }

  const handleAcceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true
    }
    
    setPreferences(newPreferences)
    localStorage.setItem('cookieConsent', JSON.stringify(newPreferences))
    setShowBanner(false)
    enableAnalytics()
  }

  const handleAcceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences))
    setShowBanner(false)
    
    if (preferences.analytics) {
      enableAnalytics()
    }
  }

  const handleRejectAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
      marketing: false
    }
    
    setPreferences(newPreferences)
    localStorage.setItem('cookieConsent', JSON.stringify(newPreferences))
    setShowBanner(false)
  }

  const resetConsent = () => {
    localStorage.removeItem('cookieConsent')
    setShowBanner(true)
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false
    })
  }

  if (!showBanner) {
    return (
      <button 
        onClick={resetConsent}
        className="cookie-settings-btn"
        title="Gérer les cookies"
      >
        🍪
      </button>
    )
  }

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <div className="cookie-header">
          <h3>🍪 Gestion des cookies</h3>
          <p>
            Ce site utilise des cookies pour améliorer votre expérience et analyser 
            les performances. Vous pouvez choisir quels cookies autoriser.
          </p>
        </div>

        <div className="cookie-categories">
          <div className="cookie-category">
            <label className="cookie-label">
              <input 
                type="checkbox" 
                checked={preferences.necessary}
                disabled={true}
              />
              <span className="checkmark"></span>
              <div className="cookie-info">
                <strong>Cookies nécessaires</strong>
                <p>Indispensables au fonctionnement du site</p>
              </div>
            </label>
          </div>

          <div className="cookie-category">
            <label className="cookie-label">
              <input 
                type="checkbox" 
                checked={preferences.analytics}
                onChange={(e) => setPreferences(prev => ({
                  ...prev, 
                  analytics: e.target.checked
                }))}
              />
              <span className="checkmark"></span>
              <div className="cookie-info">
                <strong>Cookies analytiques</strong>
                <p>Google Analytics et Microsoft Clarity pour les statistiques</p>
              </div>
            </label>
          </div>

          <div className="cookie-category">
            <label className="cookie-label">
              <input 
                type="checkbox" 
                checked={preferences.marketing}
                onChange={(e) => setPreferences(prev => ({
                  ...prev, 
                  marketing: e.target.checked
                }))}
              />
              <span className="checkmark"></span>
              <div className="cookie-info">
                <strong>Cookies marketing</strong>
                <p>Futurs outils de marketing (désactivés pour le moment)</p>
              </div>
            </label>
          </div>
        </div>

        <div className="cookie-actions">
          <button 
            onClick={handleRejectAll}
            className="btn btn-secondary"
          >
            Refuser tout
          </button>
          <button 
            onClick={handleAcceptSelected}
            className="btn btn-primary"
          >
            Accepter la sélection
          </button>
          <button 
            onClick={handleAcceptAll}
            className="btn btn-accent"
          >
            Accepter tout
          </button>
        </div>

        <div className="cookie-footer">
          <small>
            En conformité avec le RGPD. Vos données restent privées et sécurisées.
            <br />
            Vous pouvez modifier vos préférences à tout moment via l'icône 🍪
          </small>
        </div>
      </div>
    </div>
  )
}