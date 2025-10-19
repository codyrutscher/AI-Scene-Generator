/**
 * Texture Service utility for fetching textures from external API
 * Fetches textures based on category from the provided API endpoint
 */

// API Configuration 
const API_BASE_URL = 'https://3-dai-app.vercel.app/api/textures';

/**
 * Transform API texture data to a simpler format
 * @param {Object} apiTexture - Raw texture data from API
 * @returns {Object} Transformed texture data
 */
const transformApiTexture = (apiTexture) => {
  return {
    id: apiTexture._id,
    name: apiTexture.name,
    description: apiTexture.description,
    category: apiTexture.category,
    tags: apiTexture.tags || [],
    url: apiTexture.file?.url || '',
    thumbnailUrl: apiTexture.thumbnail?.url || '',
    originalName: apiTexture.file?.originalName || '',
    mimeType: apiTexture.file?.mimeType || '',
    size: apiTexture.file?.size || 0,
    uploadedBy: apiTexture.uploadedBy?.username || 'Unknown',
    uploadedAt: apiTexture.uploadedAt
  }
}

export class TextureService {
  constructor() {
    this.apiBaseUrl = API_BASE_URL
    this.cache = new Map() // Cache textures to avoid redundant API calls
  }

  /**
   * Fetch textures by category
   * @param {string} category - The texture category (grass, rock, mud, heightmap, etc.)
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Texture results
   */
  async fetchTexturesByCategory(category, options = {}) {
    const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = options

    // Check cache first
    const cacheKey = `${category}_${page}_${limit}_${sortBy}_${sortOrder}`
    if (this.cache.has(cacheKey)) {
      console.log(`[TextureService] Returning cached textures for: ${category}`)
      return this.cache.get(cacheKey)
    }

    try {
      // Build API URL with query parameters
      const url = new URL(this.apiBaseUrl)
      url.searchParams.append('page', page.toString())
      url.searchParams.append('limit', limit.toString())
      url.searchParams.append('category', category)
      url.searchParams.append('sortBy', sortBy)
      url.searchParams.append('sortOrder', sortOrder)

      console.log(`[TextureService] Fetching textures from: ${url.toString()}`)

      // Make API request
      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'API request was not successful')
      }

      // Transform API textures to our format
      const transformedTextures = data.data.map(transformApiTexture)

      const result = {
        textures: transformedTextures,
        total: data.pagination?.total || transformedTextures.length,
        page: data.pagination?.page || page,
        pages: data.pagination?.pages || 1,
        category,
        source: 'External API'
      }

      // Cache the result
      this.cache.set(cacheKey, result)

      return result
    } catch (error) {
      console.error(`[TextureService] Error fetching textures for category "${category}":`, error)

      return {
        textures: [],
        total: 0,
        page,
        pages: 0,
        category,
        source: 'External API',
        error: error.message || 'Failed to fetch textures'
      }
    }
  }

  /**
   * Fetch a single texture from a category (returns the first one)
   * @param {string} category - The texture category
   * @param {Object} options - Fetch options
   * @returns {Promise<Object|null>} Single texture or null
   */
  async fetchSingleTexture(category, options = {}) {
    const result = await this.fetchTexturesByCategory(category, { ...options, limit: 1 })

    if (result.textures && result.textures.length > 0) {
      return result.textures[0]
    }

    return null
  }

  /**
   * Fetch multiple textures for terrain (grass, rock, mud/sand, heightmap)
   * @param {Object} categories - Object with category names
   * @returns {Promise<Object>} Object with texture URLs for each category
   */
  async fetchTerrainTextures(categories = {}) {
    const { grass = 'grass', rock = 'rock', sand = 'mud', heightmap = 'heightmap' } = categories

    try {
      console.log('[TextureService] Fetching terrain textures...')

      // Fetch all textures in parallel
      const [grassResult, rockResult, sandResult, heightmapResult] = await Promise.all([
        this.fetchSingleTexture(grass),
        this.fetchSingleTexture(rock),
        this.fetchSingleTexture(sand),
        this.fetchSingleTexture(heightmap)
      ])

      // Check if any fetch failed
      const errors = []
      if (!grassResult) errors.push('grass')
      if (!rockResult) errors.push('rock')
      if (!sandResult) errors.push('sand')
      if (!heightmapResult) errors.push('heightmap')

      if (errors.length > 0) {
        console.warn(`[TextureService] Failed to fetch textures for: ${errors.join(', ')}`)
      }

      return {
        success: errors.length === 0,
        textures: {
          grass: grassResult,
          rock: rockResult,
          sand: sandResult,
          heightmap: heightmapResult
        },
        errors: errors.length > 0 ? errors : null
      }
    } catch (error) {
      console.error('[TextureService] Error fetching terrain textures:', error)

      return {
        success: false,
        textures: {
          grass: null,
          rock: null,
          sand: null,
          heightmap: null
        },
        error: error.message || 'Failed to fetch terrain textures'
      }
    }
  }

  /**
   * Clear the texture cache
   */
  clearCache() {
    this.cache.clear()
    console.log('[TextureService] Cache cleared')
  }

  /**
   * Get cache size
   */
  getCacheSize() {
    return this.cache.size
  }
}

// Export singleton instance
export const textureService = new TextureService()
export default textureService
