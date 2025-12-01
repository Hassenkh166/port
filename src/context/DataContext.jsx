import React, { createContext, useContext, useState, useEffect } from 'react'
import { JSONBinService } from '../services/jsonbin'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isOnlineMode, setIsOnlineMode] = useState(false)

  // Charger les données au démarrage
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Charger uniquement depuis JSONBin.io
      const onlineData = await JSONBinService.getData()
      
      // Optimiser les images base64 si elles sont trop volumineuses
      if (onlineData.profile?.photo && onlineData.profile.photo.startsWith('data:image/')) {
        const imageSizeKB = (onlineData.profile.photo.length * 0.75) / 1024
        console.log(`📊 Taille image: ${Math.round(imageSizeKB)}KB`)
        
        if (imageSizeKB > 200) { // Si plus de 200KB
          console.log('⚠️ Image volumineuse détectée, considérez l\'utilisation d\'une URL d\'image')
        }
      }
      
      setData(onlineData)
      setIsOnlineMode(true)
      console.log('✅ Données chargées depuis JSONBin.io')
    } catch (error) {
      console.error('❌ Erreur lors du chargement depuis JSONBin.io:', error)
      setIsOnlineMode(false)
      throw new Error('Impossible de charger les données. Vérifiez votre configuration JSONBin.io')
    } finally {
      setIsLoading(false)
    }
  }

  // Sauvegarder les données
  const saveData = async (newData) => {
    try {
      setData(newData)
      
      // Sauvegarder uniquement sur JSONBin.io
      await JSONBinService.updateData(newData)
      console.log('✅ Données sauvegardées sur JSONBin.io')
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error)
      throw error
    }
  }

  // Mettre à jour une section spécifique
  const updateSection = async (section, newSectionData) => {
    const updatedData = {
      ...data,
      [section]: newSectionData
    }
    await saveData(updatedData)
  }

  // Exporter les données
  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Importer les données
  const importData = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const importedData = JSON.parse(event.target.result)
          await saveData(importedData)
          resolve(importedData)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('Erreur de lecture du fichier'))
      reader.readAsText(file)
    })
  }

  // Réinitialiser aux données par défaut
  const resetToDefault = async () => {
    await saveData(portfolioData)
  }

  // Forcer le rechargement depuis le serveur
  const refreshData = async () => {
    await loadData()
  }

  // Basculer entre mode en ligne/hors ligne
  const toggleOnlineMode = () => {
    setIsOnlineMode(!isOnlineMode)
  }

  const value = {
    data,
    updateSection,
    exportData,
    importData,
    resetToDefault,
    refreshData,
    isLoading,
    isOnlineMode,
    toggleOnlineMode
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}