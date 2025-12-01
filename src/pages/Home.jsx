import React from 'react'
import { useData } from '../context/DataContext'
import { usePageTracking } from '../hooks/useAnalytics'

export default function Home() {
  const { data, isLoading } = useData()
  const profile = data?.profile || {}
  
  // Tracker automatiquement cette page
  usePageTracking('home', 'Accueil - Portfolio')

  if (isLoading) {
    return (
      <section className="page home">
        <div className="hero">
          <div className="skeleton skeleton-text title"></div>
          <div className="skeleton skeleton-text subtitle"></div>
          <div className="skeleton skeleton-text paragraph long"></div>
          <div className="skeleton skeleton-text paragraph medium"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="page home">
      <div className="hero">
        <h2>{profile.title || 'Mon Portfolio'}<br/>{profile.subtitle || 'En cours de chargement'}</h2>
        <p>{profile.description || 'Chargement de la description...'}</p>
      </div>
    </section>
  )
}
