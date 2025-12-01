import React, { useState, useEffect } from 'react'
import { getAnalyticsData, analyzeVisits } from '../services/analytics'

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('today')

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const data = await getAnalyticsData()
      setAnalyticsData(data)
      const analysisResult = analyzeVisits(data)
      setStats(analysisResult)
    } catch (error) {
      console.error('Erreur chargement analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getVisitsByPeriod = () => {
    if (!analyticsData.length) return []
    
    const now = new Date()
    let startDate

    switch (selectedPeriod) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        startDate = new Date(0)
    }

    return analyticsData.filter(entry => 
      entry.action === 'page_view' && 
      new Date(entry.timestamp) >= startDate
    )
  }

  const recentVisits = getVisitsByPeriod().slice(-10)

  if (loading) {
    return (
      <div className="analytics-page">
        <h2>Analytics</h2>
        <div className="loading">
          <div className="skeleton skeleton-text title"></div>
          <div className="analytics-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-text medium"></div>
                <div className="skeleton skeleton-text short"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h2>📊 Analytics du Portfolio</h2>
        <button onClick={loadAnalytics} className="btn btn-secondary">
          🔄 Actualiser
        </button>
      </div>

      {/* Statistiques principales */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.today}</div>
            <div className="stat-label">Visites aujourd'hui</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.thisWeek}</div>
            <div className="stat-label">Cette semaine</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.thisMonth}</div>
            <div className="stat-label">Ce mois</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total visites</div>
          </div>
        </div>
      )}

      <div className="analytics-content">
        {/* Pages populaires */}
        {stats?.popularPages && (
          <div className="analytics-section">
            <h3>🏆 Pages les plus visitées</h3>
            <div className="popular-pages">
              {stats.popularPages.map((page, index) => (
                <div key={page.page} className="page-stat">
                  <span className="page-rank">#{index + 1}</span>
                  <span className="page-name">{page.page}</span>
                  <span className="page-count">{page.count} visites</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Graphique des heures */}
        {stats?.hourlyStats && (
          <div className="analytics-section">
            <h3>⏰ Répartition par heure</h3>
            <div className="hourly-chart">
              {stats.hourlyStats.map((count, hour) => (
                <div key={hour} className="hour-bar">
                  <div 
                    className="bar" 
                    style={{ height: `${(count / Math.max(...stats.hourlyStats)) * 100}%` }}
                  ></div>
                  <span className="hour-label">{hour}h</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visites récentes */}
        <div className="analytics-section">
          <div className="section-header">
            <h3>🕐 Activité récente</h3>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-selector"
            >
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="all">Tout</option>
            </select>
          </div>
          
          <div className="recent-visits">
            {recentVisits.length > 0 ? (
              recentVisits.map((visit, index) => (
                <div key={index} className="visit-item">
                  <div className="visit-info">
                    <span className="visit-page">{visit.data?.page || 'Page inconnue'}</span>
                    <span className="visit-time">{formatDate(visit.timestamp)}</span>
                  </div>
                  {visit.data?.title && (
                    <div className="visit-title">{visit.data.title}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-data">Aucune visite pour cette période</div>
            )}
          </div>
        </div>

        {/* Events personnalisés */}
        <div className="analytics-section">
          <h3>🎯 Événements récents</h3>
          <div className="recent-events">
            {analyticsData
              .filter(entry => entry.action !== 'page_view')
              .slice(-10)
              .map((event, index) => (
                <div key={index} className="event-item">
                  <div className="event-type">{event.action}</div>
                  <div className="event-details">
                    {event.data?.project && <span>Projet: {event.data.project}</span>}
                    {event.data?.section && <span>Section: {event.data.section}</span>}
                    {event.data?.seconds && <span>Durée: {event.data.seconds}s</span>}
                  </div>
                  <div className="event-time">{formatDate(event.timestamp)}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}