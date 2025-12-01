import React, { useState } from 'react'
import { useData } from '../context/DataContext'
import Analytics from './Analytics'

export default function Admin() {
  const { 
    data, 
    updateSection, 
    exportData, 
    importData, 
    resetToDefault, 
    refreshData,
    isLoading,
    isOnlineMode,
    toggleOnlineMode
  } = useData()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [saveStatus, setSaveStatus] = useState('')
  
  // Mot de passe simple (en production, utilise un vrai système d'auth)
  const ADMIN_PASSWORD = 'admin123'
  
  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPassword('')
    } else {
      alert('Mot de passe incorrect')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        await importData(file)
        setSaveStatus('✅ Données importées avec succès')
        setTimeout(() => setSaveStatus(''), 3000)
      } catch (error) {
        setSaveStatus('❌ Erreur lors de l\'importation')
        setTimeout(() => setSaveStatus(''), 3000)
      }
    }
  }

  const handleRefresh = async () => {
    try {
      await refreshData()
      setSaveStatus('✅ Données actualisées')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus('❌ Erreur actualisation')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  const handleReset = async () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ?')) {
      try {
        await resetToDefault()
        setSaveStatus('✅ Données réinitialisées')
        setTimeout(() => setSaveStatus(''), 3000)
      } catch (error) {
        setSaveStatus('❌ Erreur réinitialisation')
        setTimeout(() => setSaveStatus(''), 3000)
      }
    }
  }

  if (isLoading) {
    return (
      <section className="admin-loading">
        <div className="loading-container">
          <h2>Chargement des données...</h2>
          <div className="loading-spinner"></div>
        </div>
      </section>
    )
  }

  if (!isAuthenticated) {
    return (
      <section className="admin-login">
        <div className="login-container">
          <h2>Accès Administration</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <button type="submit" className="login-btn">Connexion</button>
          </form>
          <p className="login-hint">Mot de passe: admin123</p>
          <div className="mode-indicator">
            Mode: {isOnlineMode ? '🌐 En ligne (JSONBin.io)' : '💾 Local (localStorage)'}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="admin-panel">
      <div className="admin-header">
        <h2>Administration Portfolio</h2>
        <div className="admin-status">
          <span className={`status-indicator ${isOnlineMode ? 'online' : 'offline'}`}>
            {isOnlineMode ? '🌐 En ligne' : '💾 Local'}
          </span>
          {saveStatus && <span className="save-status">{saveStatus}</span>}
        </div>
        <div className="admin-actions">
          <button onClick={handleRefresh} className="btn-refresh">🔄 Actualiser</button>
          <button onClick={exportData} className="btn-export">📥 Exporter</button>
          <label className="btn-import">
            📤 Importer
            <input type="file" accept=".json" onChange={handleImport} style={{display: 'none'}} />
          </label>
          <button onClick={toggleOnlineMode} className="btn-toggle">
            {isOnlineMode ? '📱 Mode Local' : '🌐 Mode En ligne'}
          </button>
          <button onClick={handleReset} className="btn-reset">🔄 Reset</button>
          <button onClick={handleLogout} className="btn-logout">🚪 Déconnexion</button>
        </div>
      </div>

      <div className="admin-tabs">
        {['profile', 'about', 'skills', 'experience', 'projects', 'analytics'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'analytics' ? '📊 Analytics' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === 'profile' && <ProfileEditor data={data.profile} updateSection={updateSection} setSaveStatus={setSaveStatus} />}
        {activeTab === 'about' && <AboutEditor data={data.about} updateSection={updateSection} setSaveStatus={setSaveStatus} />}
        {activeTab === 'skills' && <SkillsEditor data={data.skills} updateSection={updateSection} setSaveStatus={setSaveStatus} />}
        {activeTab === 'experience' && <ExperienceEditor data={{education: data.education, experience: data.experience}} updateSection={updateSection} setSaveStatus={setSaveStatus} />}
        {activeTab === 'projects' && <ProjectsEditor data={data.projects} updateSection={updateSection} setSaveStatus={setSaveStatus} />}
        {activeTab === 'analytics' && <Analytics />}
      </div>
    </section>
  )
}

// Composant pour éditer le profil
function ProfileEditor({ data, updateSection, setSaveStatus }) {
  const [profile, setProfile] = useState(data)

  const handleSave = async () => {
    try {
      await updateSection('profile', profile)
      setSaveStatus('✅ Profil sauvegardé !')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus('❌ Erreur sauvegarde')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Vérifier le type et la taille du fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.')
        return
      }
      
      if (file.size > 2 * 1024 * 1024) { // Réduit à 2MB max pour de meilleures performances
        alert('L\'image est trop volumineuse. Taille maximum : 2MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        // Créer une nouvelle image pour optimisation
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          // Calculer les dimensions optimales (max 400x400 pour de meilleures performances)
          const maxSize = 400
          let { width, height } = img
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height
              height = maxSize
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          // Dessiner l'image redimensionnée avec haute qualité
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)
          
          // Convertir en base64 avec compression plus agressive
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.7) // Réduit de 0.9 à 0.7
          setProfile({...profile, photo: optimizedDataUrl})
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="editor">
      <h3>Profil</h3>
      <div className="form-grid">
        <input
          type="text"
          placeholder="Nom"
          value={profile.name}
          onChange={(e) => setProfile({...profile, name: e.target.value})}
        />
        <input
          type="text"
          placeholder="Titre"
          value={profile.title}
          onChange={(e) => setProfile({...profile, title: e.target.value})}
        />
        <input
          type="text"
          placeholder="Sous-titre"
          value={profile.subtitle}
          onChange={(e) => setProfile({...profile, subtitle: e.target.value})}
        />
        <input
          type="email"
          placeholder="Email"
          value={profile.email}
          onChange={(e) => setProfile({...profile, email: e.target.value})}
        />
        <input
          type="tel"
          placeholder="Téléphone"
          value={profile.phone || ''}
          onChange={(e) => setProfile({...profile, phone: e.target.value})}
        />
        <input
          type="text"
          placeholder="Adresse"
          value={profile.address || ''}
          onChange={(e) => setProfile({...profile, address: e.target.value})}
        />
        <div className="profile-image-upload">
          <div className="upload-section">
            <label htmlFor="imageUpload" className="upload-label">
              📷 Changer photo
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="image-upload-input"
            />
          </div>
          <div className="url-section">
            <input
              type="url"
              placeholder="Ou URL d'une image"
              value={profile.photo}
              onChange={(e) => setProfile({...profile, photo: e.target.value})}
            />
          </div>
          {profile.photo && (
            <div className="image-preview">
              <img src={profile.photo} alt="Aperçu photo de profil" className="profile-image-preview" />
            </div>
          )}
        </div>
        
        {/* Réseaux sociaux */}
        <input
          type="url"
          placeholder="LinkedIn"
          value={profile.linkedin || ''}
          onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
        />
        <input
          type="url"
          placeholder="GitHub"
          value={profile.github || ''}
          onChange={(e) => setProfile({...profile, github: e.target.value})}
        />
        <input
          type="url"
          placeholder="Facebook"
          value={profile.facebook || ''}
          onChange={(e) => setProfile({...profile, facebook: e.target.value})}
        />
        <input
          type="url"
          placeholder="Instagram"
          value={profile.instagram || ''}
          onChange={(e) => setProfile({...profile, instagram: e.target.value})}
        />
        
        <textarea
          placeholder="Description"
          value={profile.description}
          onChange={(e) => setProfile({...profile, description: e.target.value})}
        />
      </div>
      <button onClick={handleSave} className="btn-save">Sauvegarder</button>
    </div>
  )
}

// Composant pour éditer la section À propos
function AboutEditor({ data, updateSection, setSaveStatus }) {
  const [about, setAbout] = useState(data)

  const handleSave = async () => {
    try {
      await updateSection('about', about)
      setSaveStatus('✅ Section À propos sauvegardée !')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus('❌ Erreur sauvegarde')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  const updateBio = (index, value) => {
    const newBio = [...about.bio]
    newBio[index] = value
    setAbout({...about, bio: newBio})
  }

  const addBioParagraph = () => {
    setAbout({...about, bio: [...about.bio, '']})
  }

  const removeBioParagraph = (index) => {
    const newBio = about.bio.filter((_, i) => i !== index)
    setAbout({...about, bio: newBio})
  }

  const updateHighlight = (index, field, value) => {
    const newHighlights = [...about.highlights]
    newHighlights[index] = {...newHighlights[index], [field]: value}
    setAbout({...about, highlights: newHighlights})
  }

  const addHighlight = () => {
    setAbout({...about, highlights: [...about.highlights, {number: '', text: ''}]})
  }

  const removeHighlight = (index) => {
    const newHighlights = about.highlights.filter((_, i) => i !== index)
    setAbout({...about, highlights: newHighlights})
  }

  return (
    <div className="editor">
      <h3>À propos</h3>
      
      <div className="section-header">
        <h4>Biographie</h4>
        <button onClick={addBioParagraph} className="btn-add">➕ Ajouter paragraphe</button>
      </div>
      {about.bio.map((paragraph, index) => (
        <div key={index} className="editable-item">
          <textarea
            placeholder={`Paragraphe ${index + 1}`}
            value={paragraph}
            onChange={(e) => updateBio(index, e.target.value)}
          />
          {about.bio.length > 1 && (
            <button 
              onClick={() => removeBioParagraph(index)} 
              className="btn-remove"
              title="Supprimer ce paragraphe"
            >
              🗑️
            </button>
          )}
        </div>
      ))}
      
      <div className="section-header">
        <h4>Points forts</h4>
        <button onClick={addHighlight} className="btn-add">➕ Ajouter point fort</button>
      </div>
      {about.highlights.map((highlight, index) => (
        <div key={index} className="highlight-editor">
          <input
            type="text"
            placeholder="Nombre"
            value={highlight.number}
            onChange={(e) => updateHighlight(index, 'number', e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={highlight.text}
            onChange={(e) => updateHighlight(index, 'text', e.target.value)}
          />
          {about.highlights.length > 1 && (
            <button 
              onClick={() => removeHighlight(index)} 
              className="btn-remove"
              title="Supprimer ce point fort"
            >
              🗑️
            </button>
          )}
        </div>
      ))}
      
      <button onClick={handleSave} className="btn-save">Sauvegarder</button>
    </div>
  )
}

// Composant pour éditer les compétences
function SkillsEditor({ data, updateSection, setSaveStatus }) {
  const [skills, setSkills] = useState(data)

  const handleSave = async () => {
    try {
      await updateSection('skills', skills)
      setSaveStatus('✅ Compétences sauvegardées !')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus('❌ Erreur sauvegarde')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  const updateCategory = (index, field, value) => {
    const newSkills = [...skills]
    if (field === 'skills') {
      newSkills[index] = {...newSkills[index], skills: value.split(',').map(s => s.trim()).filter(s => s)}
    } else {
      newSkills[index] = {...newSkills[index], [field]: value}
    }
    setSkills(newSkills)
  }

  const addCategory = () => {
    setSkills([...skills, {title: '', skills: []}])
  }

  const removeCategory = (index) => {
    const newSkills = skills.filter((_, i) => i !== index)
    setSkills(newSkills)
  }

  return (
    <div className="editor">
      <div className="section-header">
        <h3>Compétences</h3>
        <button onClick={addCategory} className="btn-add">➕ Ajouter catégorie</button>
      </div>
      {skills.map((category, index) => (
        <div key={index} className="category-editor">
          <div className="category-header">
            <input
              type="text"
              placeholder="Titre de la catégorie"
              value={category.title}
              onChange={(e) => updateCategory(index, 'title', e.target.value)}
            />
            {skills.length > 1 && (
              <button 
                onClick={() => removeCategory(index)} 
                className="btn-remove"
                title="Supprimer cette catégorie"
              >
                🗑️
              </button>
            )}
          </div>
          <textarea
            placeholder="Compétences (séparées par des virgules)"
            value={category.skills.join(', ')}
            onChange={(e) => updateCategory(index, 'skills', e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSave} className="btn-save">Sauvegarder</button>
    </div>
  )
}

// Composant pour éditer l'expérience
function ExperienceEditor({ data, updateSection, setSaveStatus }) {
  const [experience, setExperience] = useState(data.experience)
  const [education, setEducation] = useState(data.education)

  const handleSave = async () => {
    try {
      await updateSection('experience', experience)
      await updateSection('education', education)
      setSaveStatus('✅ Parcours sauvegardé !')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus('❌ Erreur sauvegarde')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  const addEducation = () => {
    setEducation([...education, {degree: '', school: '', period: '', description: ''}])
  }

  const removeEducation = (index) => {
    const newEdu = education.filter((_, i) => i !== index)
    setEducation(newEdu)
  }

  const addExperience = () => {
    setExperience([...experience, {title: '', company: '', period: '', description: ''}])
  }

  const removeExperience = (index) => {
    const newExp = experience.filter((_, i) => i !== index)
    setExperience(newExp)
  }

  return (
    <div className="editor">
      <div className="section-header">
        <h3>Formation</h3>
        <button onClick={addEducation} className="btn-add">➕ Ajouter formation</button>
      </div>
      {education.map((edu, index) => (
        <div key={index} className="timeline-editor">
          <div className="item-header">
            <input
              type="text"
              placeholder="Diplôme"
              value={edu.degree}
              onChange={(e) => {
                const newEdu = [...education]
                newEdu[index] = {...newEdu[index], degree: e.target.value}
                setEducation(newEdu)
              }}
            />
            {education.length > 1 && (
              <button 
                onClick={() => removeEducation(index)} 
                className="btn-remove"
                title="Supprimer cette formation"
              >
                🗑️
              </button>
            )}
          </div>
          <input
            type="text"
            placeholder="École"
            value={edu.school}
            onChange={(e) => {
              const newEdu = [...education]
              newEdu[index] = {...newEdu[index], school: e.target.value}
              setEducation(newEdu)
            }}
          />
          <input
            type="text"
            placeholder="Période"
            value={edu.period}
            onChange={(e) => {
              const newEdu = [...education]
              newEdu[index] = {...newEdu[index], period: e.target.value}
              setEducation(newEdu)
            }}
          />
          <textarea
            placeholder="Description"
            value={edu.description}
            onChange={(e) => {
              const newEdu = [...education]
              newEdu[index] = {...newEdu[index], description: e.target.value}
              setEducation(newEdu)
            }}
          />
        </div>
      ))}
      
      <div className="section-header">
        <h3>Expérience Professionnelle</h3>
        <button onClick={addExperience} className="btn-add">➕ Ajouter expérience</button>
      </div>
      {experience.map((exp, index) => (
        <div key={index} className="timeline-editor">
          <div className="item-header">
            <input
              type="text"
              placeholder="Poste"
              value={exp.title}
              onChange={(e) => {
                const newExp = [...experience]
                newExp[index] = {...newExp[index], title: e.target.value}
                setExperience(newExp)
              }}
            />
            {experience.length > 1 && (
              <button 
                onClick={() => removeExperience(index)} 
                className="btn-remove"
                title="Supprimer cette expérience"
              >
                🗑️
              </button>
            )}
          </div>
          <input
            type="text"
            placeholder="Entreprise"
            value={exp.company}
            onChange={(e) => {
              const newExp = [...experience]
              newExp[index] = {...newExp[index], company: e.target.value}
              setExperience(newExp)
            }}
          />
          <input
            type="text"
            placeholder="Période"
            value={exp.period}
            onChange={(e) => {
              const newExp = [...experience]
              newExp[index] = {...newExp[index], period: e.target.value}
              setExperience(newExp)
            }}
          />
          <textarea
            placeholder="Description"
            value={exp.description}
            onChange={(e) => {
              const newExp = [...experience]
              newExp[index] = {...newExp[index], description: e.target.value}
              setExperience(newExp)
            }}
          />
        </div>
      ))}
      
      <button onClick={handleSave} className="btn-save">Sauvegarder</button>
    </div>
  )
}

// Composant pour éditer les projets
function ProjectsEditor({ data, updateSection, setSaveStatus }) {
  const [projects, setProjects] = useState(data)

  const handleSave = async () => {
    try {
      await updateSection('projects', projects)
      setSaveStatus('✅ Projets sauvegardés !')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus('❌ Erreur sauvegarde')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  const updateProject = (index, field, value) => {
    const newProjects = [...projects]
    newProjects[index] = {...newProjects[index], [field]: value}
    setProjects(newProjects)
  }

  const addProject = () => {
    setProjects([...projects, {title: '', description: '', url: '', technologies: []}])
  }

  const removeProject = (index) => {
    const newProjects = projects.filter((_, i) => i !== index)
    setProjects(newProjects)
  }

  return (
    <div className="editor">
      <div className="section-header">
        <h3>Projets</h3>
        <button onClick={addProject} className="btn-add">➕ Ajouter projet</button>
      </div>
      {projects.map((project, index) => (
        <div key={index} className="project-editor">
          <div className="item-header">
            <input
              type="text"
              placeholder="Titre du projet"
              value={project.title}
              onChange={(e) => updateProject(index, 'title', e.target.value)}
            />
            {projects.length > 1 && (
              <button 
                onClick={() => removeProject(index)} 
                className="btn-remove"
                title="Supprimer ce projet"
              >
                🗑️
              </button>
            )}
          </div>
          <textarea
            placeholder="Description"
            value={project.description}
            onChange={(e) => updateProject(index, 'description', e.target.value)}
          />
          <input
            type="url"
            placeholder="URL du projet"
            value={project.url}
            onChange={(e) => updateProject(index, 'url', e.target.value)}
          />
          <textarea
            placeholder="Technologies (séparées par des virgules)"
            value={project.technologies?.join(', ') || ''}
            onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
          />
        </div>
      ))}
      <button onClick={handleSave} className="btn-save">Sauvegarder</button>
    </div>
  )
}