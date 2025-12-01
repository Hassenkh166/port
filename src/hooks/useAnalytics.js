import { useEffect, useRef } from 'react'
import { trackPageView, trackEvent, sendCustomAnalytics, usePageTimer } from '../services/analytics'

// Hook principal pour analytics
export const useAnalytics = () => {
  // Tracker une page vue
  const trackPage = (pageName, pageTitle = null) => {
    const title = pageTitle || document.title
    trackPageView(pageName, title)
    sendCustomAnalytics('page_view', { 
      page: pageName, 
      title,
      timestamp: new Date().toISOString()
    })
  }

  // Tracker un événement
  const trackCustomEvent = (eventName, data = {}) => {
    trackEvent(eventName, 'user_interaction', eventName, 1)
    sendCustomAnalytics('custom_event', { 
      event: eventName, 
      ...data,
      timestamp: new Date().toISOString()
    })
  }

  // Tracker un clic sur un projet
  const trackProjectClick = (projectTitle, projectUrl) => {
    trackEvent('project_click', 'portfolio', projectTitle, 1)
    sendCustomAnalytics('project_click', {
      project: projectTitle,
      url: projectUrl,
      timestamp: new Date().toISOString()
    })
  }

  // Tracker un clic sur contact
  const trackContactClick = (contactType, value) => {
    trackEvent('contact_click', 'engagement', contactType, 1)
    sendCustomAnalytics('contact_click', {
      type: contactType,
      value,
      timestamp: new Date().toISOString()
    })
  }

  // Tracker le temps passé sur une section
  const trackSectionView = (sectionName) => {
    sendCustomAnalytics('section_view', {
      section: sectionName,
      timestamp: new Date().toISOString()
    })
  }

  return {
    trackPage,
    trackCustomEvent,
    trackProjectClick,
    trackContactClick,
    trackSectionView
  }
}

// Hook pour tracker automatiquement une page
export const usePageTracking = (pageName, pageTitle = null) => {
  const { trackPage } = useAnalytics()
  const startTimeRef = useRef(Date.now())
  
  useEffect(() => {
    // Tracker la page vue au montage
    trackPage(pageName, pageTitle)
    startTimeRef.current = Date.now()
    
    // Tracker le temps passé au démontage
    return () => {
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000)
      sendCustomAnalytics('page_time', {
        page: pageName,
        seconds: timeSpent,
        timestamp: new Date().toISOString()
      })
    }
  }, [pageName, pageTitle, trackPage])
}

// Hook pour tracker les interactions avec intersection observer
export const useIntersectionTracking = (elementRef, sectionName) => {
  const { trackSectionView } = useAnalytics()
  const trackedRef = useRef(false)
  
  useEffect(() => {
    if (!elementRef.current) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !trackedRef.current) {
          trackSectionView(sectionName)
          trackedRef.current = true
        }
      },
      {
        threshold: 0.5 // Déclenche quand 50% de l'élément est visible
      }
    )
    
    observer.observe(elementRef.current)
    
    return () => {
      observer.disconnect()
    }
  }, [elementRef, sectionName, trackSectionView])
}

// Hook pour tracker les formulaires
export const useFormTracking = () => {
  const { trackCustomEvent } = useAnalytics()
  
  const trackFormStart = (formName) => {
    trackCustomEvent('form_start', { form: formName })
  }
  
  const trackFormSubmit = (formName, success = true) => {
    trackCustomEvent('form_submit', { 
      form: formName, 
      success 
    })
  }
  
  const trackFormError = (formName, error) => {
    trackCustomEvent('form_error', { 
      form: formName, 
      error: error.toString() 
    })
  }
  
  return {
    trackFormStart,
    trackFormSubmit,
    trackFormError
  }
}