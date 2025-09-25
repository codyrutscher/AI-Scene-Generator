/**
 * Model Search utility for finding 3D models from external API
 * Fetches real 3D models from the provided API endpoint
 */

// API Configuration
const API_BASE_URL = 'https://3-dai-app.vercel.app/api/assets';

/**
 * Transform API response to match our internal model format
 * @param {Object} apiModel - Model data from API
 * @returns {Object} Transformed model object
 */
const transformApiModel = (apiModel) => {
  return {
    id: apiModel._id,
    name: apiModel.name,
    description: apiModel.description,
    category: apiModel.category,
    tags: apiModel.tags,
    license: apiModel.license,
    thumbnail: apiModel.thumbnail?.url || null,
    fileUrl: apiModel.file?.url || null,
    fileName: apiModel.file?.originalName || apiModel.file?.fileName || null,
    fileSize: apiModel.file?.size || null,
    mimeType: apiModel.file?.mimeType || null,
    uploadedAt: apiModel.uploadedAt,
    source: 'External API',
    downloadable: true,
    type: 'model' // Mark as 3D model
  };
};

export class ModelSearch {
  constructor() {
    this.apiBaseUrl = API_BASE_URL;
  }

  /**
   * Search for models based on search term
   * @param {string} searchTerm - The search term to look for
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async searchModels(searchTerm, options = {}) {
    const {
      limit = 10,
      category = null
    } = options;

    try {
      // Build API URL with search parameters
      const url = new URL(this.apiBaseUrl);
      url.searchParams.append('search', searchTerm);
      
      if (limit) {
        url.searchParams.append('limit', limit.toString());
      }
      
      if (category) {
        url.searchParams.append('category', category);
      }

      console.log('Fetching models from:', url.toString());
      
      // Make API request
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API request was not successful');
      }
      
      // Transform API models to our format
      const transformedModels = data.data.assets.map(transformApiModel);
      
      return {
        models: transformedModels,
        total: data.data.pagination?.totalItems || transformedModels.length,
        source: 'External API',
        searchQuery: searchTerm,
        pagination: data.data.pagination,
        appliedFilters: { category, limit }
      };
      
    } catch (error) {
      console.error('Model search error:', error);
      
      return {
        models: [],
        total: 0,
        source: 'External API',
        searchQuery: searchTerm,
        error: error.message || 'Failed to fetch models',
        appliedFilters: { category, limit }
      };
    }
  }
}

// Export singleton instance
export const modelSearch = new ModelSearch();
export default modelSearch;