import emailjs from '@emailjs/browser'
import { EMAIL_CONFIG } from '../config/email'

// Initialiser EmailJS
export const initEmailJS = () => {
  emailjs.init(EMAIL_CONFIG.PUBLIC_KEY)
}

// Envoyer un email de contact
export const sendContactEmail = async (formData) => {
  try {
    // Vérifier que le template ID est configuré
    if (EMAIL_CONFIG.TEMPLATE_ID === 'template_XXXXXXX') {
      throw new Error('Template ID EmailJS non configuré')
    }

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject || 'Message depuis le portfolio',
      message: formData.message,
      to_email: EMAIL_CONFIG.TO_EMAIL,
      reply_to: formData.email
    }

    const response = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.TEMPLATE_ID,
      templateParams
    )

    return {
      success: true,
      data: response,
      message: 'Email envoyé avec succès !'
    }
  } catch (error) {
    console.error('Erreur envoi email:', error)
    return {
      success: false,
      error: error,
      message: error.text || error.message || 'Erreur lors de l\'envoi'
    }
  }
}

// Valider les données du formulaire
export const validateContactForm = (formData) => {
  const errors = {}

  // Validation nom
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Le nom doit contenir au moins 2 caractères'
  }

  // Validation email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = 'Veuillez entrer une adresse email valide'
  }

  // Validation message
  if (!formData.message || formData.message.trim().length < 10) {
    errors.message = 'Le message doit contenir au moins 10 caractères'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}