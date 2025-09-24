/**
 * Model Search utility for finding 3D models based on object type
 * Currently uses mock data, can be extended to use real APIs later
 */

// Mock model database
const mockModels = {
  car: [
    {
      id: 'car_001',
      name: 'Sports Car',
      type: 'car',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZmY2NjAwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPlNwb3J0cyBDYXI8L3RleHQ+Cjwvc3ZnPg==',
      source: 'Mock Data',
      downloadable: true,
      color: '#ff6600',
      description: 'A sleek sports car model'
    },
    {
      id: 'car_002',
      name: 'Family Car',
      type: 'car',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDQ4OGZmIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkZhbWlseSBDYXI8L3RleHQ+Cjwvc3ZnPg==',
      source: 'Mock Data',
      downloadable: true,
      color: '#4488ff',
      description: 'A comfortable family sedan'
    },
    {
      id: 'car_003',
      name: 'Pickup Truck',
      type: 'car',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjOGI0NTEzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPlBpY2t1cCBUcnVjazwvdGV4dD4KPHN2Zz4=',
      source: 'Mock Data',
      downloadable: true,
      color: '#8b4513',
      description: 'A sturdy pickup truck'
    }
  ],
  house: [
    {
      id: 'house_001',
      name: 'Modern House',
      type: 'house',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjY2NjY2NjIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk1vZGVybiBIb3VzZTwvdGV4dD4KPHN2Zz4=',
      source: 'Mock Data',
      downloadable: true,
      color: '#cccccc',
      description: 'A contemporary modern house'
    },
    {
      id: 'house_002',
      name: 'Cottage',
      type: 'house',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZmY0NDQ0Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkNvdHRhZ2U8L3RleHQ+Cjwvc3ZnPg==',
      source: 'Mock Data',
      downloadable: true,
      color: '#ff4444',
      description: 'A cozy cottage house'
    },
    {
      id: 'house_003',
      name: 'Mansion',
      type: 'house',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZmZkNzAwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk1hbnNpb248L3RleHQ+Cjwvc3ZnPg==',
      source: 'Mock Data',
      downloadable: true,
      color: '#ffd700',
      description: 'A luxurious mansion'
    }
  ],
  tree: [
    {
      id: 'tree_001',
      name: 'Oak Tree',
      type: 'tree',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNGNhZjUwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk9hayBUcmVlPC90ZXh0Pgo8L3N2Zz4=',
      source: 'Mock Data',
      downloadable: true,
      color: '#4caf50',
      description: 'A large oak tree'
    },
    {
      id: 'tree_002',
      name: 'Pine Tree',
      type: 'tree',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMjI4YjIyIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPlBpbmUgVHJlZTwvdGV4dD4KPHN2Zz4=',
      source: 'Mock Data',
      downloadable: true,
      color: '#228b22',
      description: 'A tall pine tree'
    }
  ],
  furniture: [
    {
      id: 'furniture_001',
      name: 'Chair',
      type: 'furniture',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjOGI0NTEzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkNoYWlyPC90ZXh0Pgo8L3N2Zz4=',
      source: 'Mock Data',
      downloadable: true,
      color: '#8b4513',
      description: 'A wooden chair'
    },
    {
      id: 'furniture_002',
      name: 'Table',
      type: 'furniture',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZGViODg3Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPlRhYmxlPC90ZXh0Pgo8L3N2Zz4=',
      source: 'Mock Data',
      downloadable: true,
      color: '#deb887',
      description: 'A wooden table'
    }
  ],
  person: [
    {
      id: 'person_001',
      name: 'Character',
      type: 'person',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZmZjMGNiIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkNoYXJhY3RlcjwvdGV4dD4KPHN2Zz4=',
      source: 'Mock Data',
      downloadable: true,
      color: '#ffc0cb',
      description: 'A human character'
    }
  ],
  animal: [
    {
      id: 'animal_001',
      name: 'Dog',
      type: 'animal',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZGFhNTIwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkRvZzwvdGV4dD4KPHN2Zz4=',
      source: 'Mock Data',
      downloadable: true,
      color: '#daa520',
      description: 'A friendly dog'
    }
  ]
};

export class ModelSearch {
  constructor() {
    this.models = mockModels;
  }

  /**
   * Search for models based on object type
   * @param {string} objectType - The type of object to search for
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async searchModels(objectType, options = {}) {
    const {
      limit = 10,
      color = null,
      source = null
    } = options;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (!objectType || !this.models[objectType]) {
      return {
        models: [],
        total: 0,
        source: 'Mock Data',
        error: `No models found for type: ${objectType}`
      };
    }

    let results = [...this.models[objectType]];

    // Apply color filter if specified
    if (color) {
      results = results.filter(model => 
        model.color && model.color.toLowerCase().includes(color.toLowerCase())
      );
    }

    // Apply source filter if specified
    if (source) {
      results = results.filter(model => 
        model.source && model.source.toLowerCase().includes(source.toLowerCase())
      );
    }

    // Apply limit
    const limitedResults = results.slice(0, limit);

    return {
      models: limitedResults,
      total: results.length,
      source: 'Mock Data',
      searchQuery: objectType,
      appliedFilters: { color, source, limit }
    };
  }

  /**
   * Get a specific model by ID
   * @param {string} modelId - The model ID
   * @returns {Object|null} Model object or null if not found
   */
  getModelById(modelId) {
    for (const [type, models] of Object.entries(this.models)) {
      const model = models.find(m => m.id === modelId);
      if (model) {
        return model;
      }
    }
    return null;
  }

  /**
   * Get all available object types
   * @returns {Array} Array of object types
   */
  getAvailableTypes() {
    return Object.keys(this.models);
  }

  /**
   * Get model count for each type
   * @returns {Object} Object with type counts
   */
  getTypeCounts() {
    const counts = {};
    for (const [type, models] of Object.entries(this.models)) {
      counts[type] = models.length;
    }
    return counts;
  }

  /**
   * Search across all model types with a general query
   * @param {string} query - General search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async searchAll(query, options = {}) {
    const { limit = 20 } = options;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const allResults = [];
    const queryLower = query.toLowerCase();

    // Search through all model types
    for (const [type, models] of Object.entries(this.models)) {
      for (const model of models) {
        if (
          model.name.toLowerCase().includes(queryLower) ||
          model.type.toLowerCase().includes(queryLower) ||
          model.description.toLowerCase().includes(queryLower)
        ) {
          allResults.push(model);
        }
      }
    }

    // Sort by relevance (simple name match first)
    allResults.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(queryLower);
      const bNameMatch = b.name.toLowerCase().includes(queryLower);
      
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      return 0;
    });

    return {
      models: allResults.slice(0, limit),
      total: allResults.length,
      source: 'Mock Data',
      searchQuery: query
    };
  }
}

// Export singleton instance
export const modelSearch = new ModelSearch();
export default modelSearch;