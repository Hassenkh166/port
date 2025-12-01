import React, { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { usePageTracking, useFormTracking, useAnalytics } from '../hooks/useAnalytics'
import { sendContactEmail, validateContactForm, initEmailJS } from '../services/email'

export default function Contact(){
  const { data, isLoading } = useData()
  const profile = data?.profile || {}
  const { trackContactClick } = useAnalytics()
  
  // Analytics hooks
  usePageTracking('contact', 'Contact - Portfolio')
  const { trackFormStart, trackFormSubmit, trackFormError } = useFormTracking()
  
  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', null
  
  // Initialiser EmailJS au montage
  useEffect(() => {
    initEmailJS()
  }, [])
  
  // Gérer les changements de champs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  // Gérer la soumission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Tracker le début du formulaire
    trackFormStart('contact')
    
    // Validation
    const validation = validateContactForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      trackFormError('contact', 'Validation failed')
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrors({})
    
    try {
      const result = await sendContactEmail(formData)
      
      if (result.success) {
        setSubmitStatus('success')
        trackFormSubmit('contact', true)
        
        // Réinitialiser le formulaire
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        setSubmitStatus('error')
        trackFormError('contact', result.message)
        console.error('Erreur envoi:', result.error)
      }
    } catch (error) {
      setSubmitStatus('error')
      trackFormError('contact', error.message)
      console.error('Erreur:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <section className="page contact">
        <div className="contact-container">
          <div className="skeleton skeleton-text title"></div>
          <div className="skeleton skeleton-text paragraph medium"></div>
          
          <div className="contact-info">
            <div className="contact-item">
              <div className="skeleton skeleton-text medium"></div>
              <div className="skeleton skeleton-text short"></div>
            </div>
          </div>
          
          <div className="contact-form">
            <div className="skeleton skeleton-text medium"></div>
            <div className="form-group">
              <div className="skeleton skeleton-text short"></div>
              <div className="skeleton skeleton-text long" style={{height: '2.5em'}}></div>
            </div>
            <div className="form-group">
              <div className="skeleton skeleton-text short"></div>
              <div className="skeleton skeleton-text long" style={{height: '2.5em'}}></div>
            </div>
            <div className="form-group">
              <div className="skeleton skeleton-text short"></div>
              <div className="skeleton skeleton-text long" style={{height: '6em'}}></div>
            </div>
            <div className="skeleton skeleton-text medium" style={{height: '3em', width: '150px'}}></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page contact">
      <div className="contact-container">
        <div className="contact-header">
          <h2>Contact</h2>
          <p>N'hésitez pas à me contacter pour discuter de vos projets !</p>
        </div>

        <div className="contact-content">
          {/* Informations de contact */}
          <div className="contact-info">
          
            {profile.phone && (
              <div className="contact-item">
                <h3>📱 Téléphone</h3>
                <a 
                  href={`tel:${profile.phone}`}
                  onClick={() => trackContactClick('phone', profile.phone)}
                >
                  {profile.phone}
                </a>
              </div>
            )}
            
            {profile.linkedin && (
              <div className="contact-item">
                <h3>💼 LinkedIn</h3>
                <a 
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContactClick('linkedin', profile.linkedin)}
                >
                  Profil LinkedIn
                </a>
              </div>
            )}
            
            {profile.github && (
              <div className="contact-item">
                <h3>💻 GitHub</h3>
                <a 
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContactClick('github', profile.github)}
                >
                  Profil GitHub
                </a>
              </div>
            )}
          </div>

          {/* Formulaire de contact */}
          <div className="contact-form-section">
            <h3>✉️ Envoyer un message</h3>
            
            {submitStatus === 'success' && (
              <div className="form-success">
                <p>✅ Message envoyé avec succès ! Je vous répondrai rapidement.</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="form-error">
                <p>❌ Erreur lors de l'envoi. Veuillez réessayer ou m'envoyer un email directement.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nom *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    className={errors.name ? 'error' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className={errors.email ? 'error' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Sujet</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Sujet de votre message"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Votre message..."
                  className={errors.message ? 'error' : ''}
                  disabled={isSubmitting}
                ></textarea>
                {errors.message && <span className="error-text">{errors.message}</span>}
              </div>

              <button 
                type="submit" 
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? '📤 Envoi en cours...' : '📨 Envoyer le message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
