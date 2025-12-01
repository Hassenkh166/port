import React from 'react'
import { NavLink } from 'react-router-dom'
import { useData } from '../context/DataContext'

export default function Nav() {
  const { data, isLoading } = useData()
  const profile = data?.profile || {}

  // Afficher un skeleton pendant le chargement
  if (isLoading || !profile.name) {
    return (
      <nav className="nav">
        <div className="nav-inner">
          <div className="skeleton skeleton-text short" style={{width: '120px'}}></div>
          <ul className="nav-links">
            <li><NavLink to="/" end>Accueil</NavLink></li>
            <li><NavLink to="/about">À propos</NavLink></li>
            <li><NavLink to="/skills">Compétences</NavLink></li>
            <li><NavLink to="/experience">Parcours</NavLink></li>
            <li><NavLink to="/projects">Projets</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul>
        </div>
      </nav>
    )
  }

  return (
    <nav className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="logo">{profile.name}</NavLink>
        <ul className="nav-links">
          <li><NavLink to="/" end>Accueil</NavLink></li>
          <li><NavLink to="/about">À propos</NavLink></li>
          <li><NavLink to="/skills">Compétences</NavLink></li>
          <li><NavLink to="/experience">Parcours</NavLink></li>
          <li><NavLink to="/projects">Projets</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}
