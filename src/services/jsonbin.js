// Configuration JSONBin.io
const JSONBIN_CONFIG = {
  // ⚠️ VÉRIFIEZ ET CORRIGEZ VOS CLÉS ⚠️
  BIN_ID: '6923efd643b1c97be9c14970', // ✅ Retiré l'espace en fin
  API_KEY: '$2a$10$3r7kDRCHHLsIWHqYZEujdOMqezQCN0gR7FbVhoj2CoVKkgIxN48.C', // ⚠️ CORRIGÉ : retiré le Y du début et la répétition
  BASE_URL: 'https://api.jsonbin.io/v3/b'
}

// Service pour interagir avec JSONBin.io
class JSONBinService {
  static async getData() {
    console.log('🔍 Tentative de chargement depuis JSONBin.io...')
    console.log('📡 BIN_ID:', JSONBIN_CONFIG.BIN_ID)
    console.log('🔑 API_KEY présente:', JSONBIN_CONFIG.API_KEY ? 'Oui' : 'Non')

    const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/${JSONBIN_CONFIG.BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_CONFIG.API_KEY
      }
    })
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('✅ Données chargées depuis JSONBin')
    return result.record // JSONBin.io encapsule les données dans 'record'
  }

  static async updateData(newData) {
    console.log('💾 Tentative de sauvegarde sur JSONBin.io...')
    console.log('📡 BIN_ID:', JSONBIN_CONFIG.BIN_ID)
    console.log('🔑 API_KEY présente:', JSONBIN_CONFIG.API_KEY ? 'Oui' : 'Non')

    const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/${JSONBIN_CONFIG.BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_CONFIG.API_KEY
      },
      body: JSON.stringify(newData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`)
    }

    const result = await response.json()
    console.log('✅ Données mises à jour sur JSONBin')
    return result
  }

  static async createBin(data) {
    try {
      const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_CONFIG.API_KEY,
          'X-Bin-Name': 'Portfolio Data'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du bin')
      }

      const result = await response.json()
      console.log('Bin créé avec l\'ID:', result.metadata.id)
      return result
    } catch (error) {
      console.error('Erreur createBin:', error)
      throw error
    }
  }
}

export { JSONBinService, JSONBIN_CONFIG }