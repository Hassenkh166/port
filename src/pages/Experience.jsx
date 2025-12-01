import React from 'react'
import { useData } from '../context/DataContext'
import { usePageTracking } from '../hooks/useAnalytics'

export default function Experience() {
  const { data, isLoading } = useData()
  const education = data?.education || []
  const experience = data?.experience || []
  
  // Tracker automatiquement cette page
  usePageTracking('experience', 'Parcours - Portfolio')

  if (isLoading) {
    return (
      <section className="page experience">
        <div className="experience-container">
          <div className="education-section">
            <div className="skeleton skeleton-text title"></div>
            <div className="timeline">
              {[1, 2].map(i => (
                <div key={i} className="skeleton-timeline-item">
                  <div className="skeleton skeleton-timeline-marker"></div>
                  <div className="skeleton-timeline-content">
                    <div className="skeleton skeleton-text medium"></div>
                    <div className="skeleton skeleton-text short"></div>
                    <div className="skeleton skeleton-text short"></div>
                    <div className="skeleton skeleton-text paragraph long"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="experience-section">
            <div className="skeleton skeleton-text title"></div>
            <div className="timeline">
              {[1, 2].map(i => (
                <div key={i} className="skeleton-timeline-item">
                  <div className="skeleton skeleton-timeline-marker"></div>
                  <div className="skeleton-timeline-content">
                    <div className="skeleton skeleton-text medium"></div>
                    <div className="skeleton skeleton-text short"></div>
                    <div className="skeleton skeleton-text short"></div>
                    <div className="skeleton skeleton-text paragraph long"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page experience">
      <div className="experience-container">
        <div className="education-section">
          <h2>Formation</h2>
          <div className="timeline">
            {education.map((edu, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-content">
                  <h3>{edu.degree}</h3>
                  <h4>{edu.school}</h4>
                  <span className="period">{edu.period}</span>
                  <p>{edu.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="experience-section">
          <h2>Expérience Professionnelle</h2>
          <div className="timeline">
            {experience.map((exp, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-content">
                  <h3>{exp.title}</h3>
                  <h4>{exp.company}</h4>
                  <span className="period">{exp.period}</span>
                  <p>{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}