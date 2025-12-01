import React from 'react'
import { useData } from '../context/DataContext'
import { usePageTracking } from '../hooks/useAnalytics'

export default function About(){
  const { data, isLoading } = useData()
  const about = data?.about || { bio: [], highlights: [] }
  const profile = data?.profile || {}
  
  // Tracker automatiquement cette page
  usePageTracking('about', 'À propos - Portfolio')

  if (isLoading) {
    return (
      <section className="page about">
        <div className="about-container">
          <div className="about-photo">
            <div className="skeleton skeleton-image"></div>
          </div>
          <div className="about-content">
            <div className="skeleton skeleton-text title"></div>
            <div className="skeleton skeleton-text paragraph long"></div>
            <div className="skeleton skeleton-text paragraph medium"></div>
            <div className="skeleton skeleton-text paragraph short"></div>
            <div className="about-highlights">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton-highlight">
                  <div className="skeleton skeleton-highlight-number"></div>
                  <div className="skeleton skeleton-highlight-text"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page about">
      <div className="about-container">
        <div className="about-photo">
          {profile.photo && (
            <img 
              src={profile.photo} 
              alt="Photo de profil"
              loading="lazy"
              style={{
                maxWidth: '100%',
                height: 'auto',
                transition: 'opacity 0.3s ease',
                opacity: '0'
              }}
              onLoad={(e) => e.target.style.opacity = '1'}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/300x300/6366f1/ffffff?text=${encodeURIComponent((profile.name || 'U').charAt(0))}`
                e.target.style.opacity = '1'
              }}
            />
          )}
        </div>
        <div className="about-content">
          <h2>À propos de moi</h2>
          {about.bio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <div className="about-highlights">
            {about.highlights.map((highlight, index) => (
              <div key={index} className="highlight">
                <span className="highlight-number">{highlight.number}</span>
                <span className="highlight-text">{highlight.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
