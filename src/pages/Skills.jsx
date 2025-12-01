import React from 'react'
import { useData } from '../context/DataContext'
import { usePageTracking } from '../hooks/useAnalytics'

export default function Skills(){
  const { data, isLoading } = useData()
  const skillsData = data?.skills || []
  
  // Tracker automatiquement cette page
  usePageTracking('skills', 'Compétences - Portfolio')

  if (isLoading) {
    return (
      <section className="page skills">
        <div className="skeleton skeleton-text title"></div>
        <div className="skills-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton-text medium" style={{marginBottom: '1rem'}}></div>
              <div className="skill-tags">
                {[1, 2, 3, 4, 5].map(j => (
                  <div key={j} className="skeleton skeleton-skill-tag"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="page skills">
      <h2>Compétences</h2>
      <div className="skills-grid">
        {skillsData.map((category, index) => (
          <div key={index} className="skill-category">
            <h3>{category.title}</h3>
            <div className="skill-tags">
              {category.skills?.map((skill, skillIndex) => (
                <span key={skillIndex} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}