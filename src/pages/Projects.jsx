import React from 'react'
import { useData } from '../context/DataContext'
import { usePageTracking, useAnalytics } from '../hooks/useAnalytics'

export default function Projects(){
  const { data, isLoading } = useData()
  const projects = data?.projects || []
  const { trackProjectClick } = useAnalytics()
  
  // Tracker automatiquement cette page
  usePageTracking('projects', 'Projets - Portfolio')

  if (isLoading) {
    return (
      <section className="page projects">
        <div className="skeleton skeleton-text title"></div>
        <div className="projects-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton-text medium" style={{marginBottom: '1rem'}}></div>
              <div className="skeleton skeleton-text paragraph long"></div>
              <div className="skeleton skeleton-text paragraph medium"></div>
              <div className="project-tech" style={{marginTop: '1rem'}}>
                {[1, 2, 3].map(j => (
                  <div key={j} className="skeleton skeleton-skill-tag"></div>
                ))}
              </div>
              <div className="skeleton skeleton-text short" style={{marginTop: '1rem', height: '2.5em'}}></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="page projects">
      <h2>Projets</h2>
      <div className="projects-grid">
        {projects.map(p=> (
          <article key={p.id} className="project-card">
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <a 
              href={p.url} 
              target="_blank" 
              rel="noreferrer"
              onClick={() => trackProjectClick(p.title, p.url)}
            >
              Voir
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
