import React from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { usePageTracking } from '../hooks/useAnalytics'

export default function About(){
  const { data, isLoading } = useData()
  const profile = data?.profile || {}
  const about = data?.about || { bio: [], highlights: [], keywords: [] }
  const experience = data?.experience || []
  const skills = data?.skills || []

  usePageTracking('about', 'À propos - Portfolio')

  if (isLoading) {
    return (
      <section className="page about">
        <div className="skeleton skeleton-text title"></div>
        <div className="skeleton skeleton-text paragraph long"></div>
        <div className="skeleton skeleton-text paragraph medium"></div>
      </section>
    )
  }

  // Données pour les sections
  const topSkills = skills.slice(0, 4) // Top 4 compétences
  const keyExperience = experience[0] // Première expérience

  return (
    <section className="page about">
      {/* 1️⃣ SECTION INTRO & PHOTO */}
      <section id="about-hero" className="about-section about-hero">
        <div className="about-hero-content">
          <div className="about-photo-container">
            {profile.photo && (
              <img 
                src={profile.photo} 
                alt={profile.name || 'Photo de profil'}
                className="about-photo"
                loading="lazy"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/300x300/6366f1/ffffff?text=${encodeURIComponent((profile.name || 'U').charAt(0))}`
                }}
              />
            )}
          </div>
          <div className="about-intro">
            <h1>{profile.name || 'Professionnel'}</h1>
            <p className="about-title">{profile.title || 'Titre professionnel'}</p>
            <p className="about-description">{profile.description || 'Description professionnelle'}</p>
          </div>
        </div>
      </section>

      {/* 2️⃣ SECTION RÉSUMÉ DU PARCOURS (LE "POURQUOI") */}
      <section id="about-journey" className="about-section about-journey">
        <h2>Mon Parcours</h2>
        <div className="journey-content">
          {about.bio && about.bio.length > 0 ? (
            about.bio.map((paragraph, idx) => (
              <p key={idx} className="journey-paragraph">{paragraph}</p>
            ))
          ) : (
            <p>Parcours en cours de chargement...</p>
          )}
        </div>
      </section>

      {/* 3️⃣ SECTION CHIFFRES CLÉS (L'IMPACT) */}
      <section id="about-stats" className="about-section about-stats">
        <h2>Mon Impact</h2>
        <div className="stats-grid">
          {about.highlights && about.highlights.length > 0 ? (
            about.highlights.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-text">{stat.text}</div>
              </div>
            ))
          ) : (
            <p>Statistiques en cours de chargement...</p>
          )}
        </div>
      </section>

      {/* 4️⃣ SECTION COMPÉTENCES PRINCIPALES (LE "QUOI") */}
      <section id="about-skills" className="about-section about-skills">
        <h2>Compétences Principales</h2>
        <div className="skills-container">
          <div className="skills-list">
            {topSkills && topSkills.length > 0 ? (
              topSkills.map((skill, idx) => (
                <div key={idx} className="skill-item">
                  <div className="skill-name">{skill.name || skill}</div>
                  {skill.level && (
                    <div className="skill-level">
                      <div className="skill-bar" style={{width: `${skill.level}%`}}></div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>Compétences en cours de chargement...</p>
            )}
          </div>
          <div className="skills-cta">
            <p>Découvrez toutes mes compétences en détail</p>
            <Link to="/skills" className="btn btn-primary">
              Voir plus →
            </Link>
          </div>
        </div>
      </section>

      {/* 5️⃣ SECTION EXPÉRIENCE CLÉ (LE "COMMENT") */}
      <section id="about-experience" className="about-section about-experience">
        <h2>Expérience Clé</h2>
        {keyExperience ? (
          <div className="experience-highlight">
            <div className="exp-header">
              <h3>{keyExperience.title || 'Titre du poste'}</h3>
              <span className="exp-company">{keyExperience.company || 'Entreprise'}</span>
            </div>
            <p className="exp-description">
              {keyExperience.description || 'Description de l\'expérience'}
            </p>
            {keyExperience.highlights && keyExperience.highlights.length > 0 && (
              <ul className="exp-highlights">
                {keyExperience.highlights.slice(0, 3).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
            <p className="exp-period">
              {keyExperience.startDate} - {keyExperience.endDate || 'Présent'}
            </p>
          </div>
        ) : (
          <p>Expérience en cours de chargement...</p>
        )}
        <div className="experience-cta">
          <Link to="/experience" className="btn btn-secondary">
            Voir tout mon parcours professionnel →
          </Link>
        </div>
      </section>

      {/* 6️⃣ SECTION APPEL À L'ACTION (LA SUITE) */}
      <section id="about-cta" className="about-section about-cta">
        <h2>Parlons de votre projet</h2>
        <p>
          Vous avez un projet intéressant ? Vous souhaitez en savoir plus sur mes expériences ?
          <br />
          Contactez-moi pour discuter de comment je peux vous aider.
        </p>
        <div className="cta-buttons">
          <Link to="/contact" className="btn btn-accent">
            Me contacter
          </Link>
          <a href="#" className="btn btn-secondary">
            Télécharger mon CV
          </a>
        </div>
      </section>
    </section>
  )
}
