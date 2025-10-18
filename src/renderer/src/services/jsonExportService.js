// JSON Export Service for scene state serialization and import

export class JSONExportService {
  static VERSION = "1.0";
  static APP_VERSION = "1.0.0";
  static MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  /**
   * Export scene data to JSON format
   * @param {Object} sceneData - The scene state data to export
   * @param {Object} options - Export options
   * @param {boolean} [options.includeCamera] - Whether to include camera data
   * @param {boolean} [options.includeLighting] - Whether to include lighting data
   * @returns {Promise<Blob>} The exported JSON blob
   */
  static async exportScene(sceneData, options) {
    try {
      const exportData = {
        version: this.VERSION,
        timestamp: new Date().toISOString(),
        metadata: {
          appVersion: this.APP_VERSION,
          totalObjects: sceneData.objects.length,
          exportDate: new Date().toISOString(),
          exportOptions: options
        },
        scene: {
          objects: sceneData.objects,
          ...(options.includeCamera && sceneData.camera && { camera: sceneData.camera }),
          ...(options.includeLighting && sceneData.lighting && { lighting: sceneData.lighting })
        }
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Validate file size
      if (blob.size > this.MAX_FILE_SIZE) {
        throw new Error(`Export file size (${Math.round(blob.size / 1024 / 1024)}MB) exceeds maximum limit (10MB)`);
      }

      return blob;
    } catch (error) {
      console.error('JSON export failed:', error);
      throw new Error(`Failed to export scene: ${error.message}`);
    }
  }

  /**
   * Validate imported JSON file
   * @param {File} file - The file to validate
   * @returns {Promise<Object>} Validation result with isValid, errors, and warnings
   */
  static async validateImport(file) {
    const errors = [];
    const warnings = [];

    try {
      // Check file size
      if (file.size > this.MAX_FILE_SIZE) {
        errors.push(`File size (${Math.round(file.size / 1024 / 1024)}MB) exceeds maximum limit (10MB)`);
      }

      // Check file type
      if (!file.type.includes('json') && !file.name.toLowerCase().endsWith('.json')) {
        errors.push('File must be a JSON file');
      }

      if (errors.length > 0) {
        return { isValid: false, errors, warnings };
      }

      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate required fields
      if (!data.version) {
        errors.push("Missing version field");
      }
      
      if (!data.scene) {
        errors.push("Missing scene data");
      } else {
        if (!data.scene.objects || !Array.isArray(data.scene.objects)) {
          errors.push("Missing or invalid objects array");
        } else {
          // Validate object structure
          data.scene.objects.forEach((obj, index) => {
            if (!obj.id || !obj.name || !obj.geometry) {
              errors.push(`Object at index ${index} missing required fields (id, name, geometry)`);
            }
            if (!obj.position || !Array.isArray(obj.position) || obj.position.length !== 3) {
              errors.push(`Object at index ${index} has invalid position array`);
            }
          });
        }
      }

      // Version compatibility warnings
      if (data.version !== this.VERSION) {
        warnings.push(`File version (${data.version}) differs from current version (${this.VERSION}). Import may have compatibility issues.`);
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    } catch (error) {
      return {
        isValid: false,
        errors: ["Invalid JSON format: " + error.message],
        warnings: []
      };
    }
  }

  /**
   * Import scene from JSON file
   * @param {File} file - The JSON file to import
   * @returns {Promise<Object>} The imported scene state
   */
  static async importScene(file) {
    try {
      const validation = await this.validateImport(file);
      
      if (!validation.isValid) {
        throw new Error(`Import validation failed: ${validation.errors.join(', ')}`);
      }

      const text = await file.text();
      const data = JSON.parse(text);
      
      // Transform imported data to current scene state format
      const sceneState = {
        objects: data.scene.objects.map(obj => ({
          ...obj,
          // Ensure all required fields have defaults
          scale: obj.scale || [1, 1, 1],
          rotation: obj.rotation || [0, 0, 0],
          color: obj.color || '#4a90e2',
          visible: obj.visible !== false, // Default to true
          // Preserve terrain-specific properties
          ...(obj.geometry === 'terrain' && {
            preset: obj.preset || 'flat',
            displacementScale: obj.displacementScale || 1,
            displacementOffset: obj.displacementOffset || 0,
            widthScale: obj.widthScale || 20,
            heightScale: obj.heightScale || 20,
            segments: obj.segments || 64,
            textureRepeat: obj.textureRepeat || 10,
            seed: obj.seed || 0
          }),
          // Preserve model-specific properties
          ...(obj.geometry === 'model' && {
            modelData: obj.modelData || {}
          })
        })),
        camera: data.scene.camera,
        lighting: data.scene.lighting,
        metadata: data.metadata
      };

      return sceneState;
    } catch (error) {
      console.error('JSON import failed:', error);
      throw new Error(`Failed to import scene: ${error.message}`);
    }
  }

  /**
   * Create scene preview data for import dialog
   * @param {File} file - The JSON file to preview
   * @returns {Promise<Object>} Preview data with object count, types, and features
   */
  static async createPreviewData(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const objectTypes = {};
      data.scene.objects.forEach(obj => {
        const displayType = obj.geometry === 'terrain' ? `terrain (${obj.preset || 'flat'})` : obj.geometry;
        objectTypes[displayType] = (objectTypes[displayType] || 0) + 1;
      });

      return {
        objectCount: data.scene.objects.length,
        objectTypes: Object.keys(objectTypes).map(type => `${type} (${objectTypes[type]})`),
        hasCamera: !!data.scene.camera,
        hasLighting: !!data.scene.lighting,
        appVersion: data.metadata?.appVersion || 'Unknown',
        fileSize: this.formatFileSize(file.size)
      };
    } catch (error) {
      throw new Error(`Failed to create preview: ${error.message}`);
    }
  }

  /**
   * Format file size for display
   * @param {number} bytes - The file size in bytes
   * @returns {string} The formatted file size string
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}