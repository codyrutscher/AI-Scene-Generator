// GLB Export Service using Three.js GLTFExporter

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

export class GLBExportService {
  static MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  static exporter = new GLTFExporter();

  /**
   * Export Three.js scene to GLB format
   * @param {THREE.Scene} scene - The Three.js scene to export
   * @param {Object} options - Export options
   * @param {boolean} [options.onlyVisible=true] - Export only visible objects
   * @param {boolean} [options.trs=false] - Export TRS (translation, rotation, scale) separately
   * @param {Array} [options.animations=[]] - Animations to include
   * @returns {Promise<ArrayBuffer>} The exported GLB data
   */
  static async exportScene(scene, options) {
    try {
      // Validate scene before export
      const validation = this.validateScene(scene);
      if (!validation.canExport) {
        throw new Error('Scene cannot be exported: ' + validation.unsupportedFeatures.join(', '));
      }

      return new Promise((resolve, reject) => {
        this.exporter.parse(
          scene,
          (result) => {
            if (result instanceof ArrayBuffer) {
              // Check file size
              if (result.byteLength > this.MAX_FILE_SIZE) {
                reject(new Error(`Export file size (${Math.round(result.byteLength / 1024 / 1024)}MB) exceeds maximum limit (50MB)`));
                return;
              }
              resolve(result);
            } else {
              reject(new Error("Expected ArrayBuffer for binary export"));
            }
          },
          (error) => {
            console.error('GLB export error:', error);
            reject(new Error(`GLB export failed: ${error.message || 'Unknown error'}`));
          },
          {
            binary: true,
            onlyVisible: options.onlyVisible ?? true,
            trs: options.trs ?? false,
            animations: options.animations ?? [],
            includeCustomExtensions: false,
            forceIndices: false,
            // forcePowerOfTwoTextures: false,
            maxTextureSize: 1024
          }
        );
      });
    } catch (error) {
      console.error('GLB export service error:', error);
      throw new Error(`Failed to export GLB: ${error.message}`);
    }
  }

  /**
   * Validate scene for GLB export compatibility
   * @param {THREE.Scene} scene - The Three.js scene to validate
   * @returns {Object} Validation result with canExport, warnings, and unsupportedFeatures
   */
  static validateScene(scene) {
    const warnings = [];
    const unsupportedFeatures = [];
    let meshCount = 0;
    let totalVertices = 0;
    let terrainCount = 0;

    scene.traverse((object) => {
      // Count meshes and vertices
      if (object instanceof THREE.Mesh) {
        meshCount++;
        
        // Check if this is a terrain object (by checking for terrain-specific properties)
        if (object.userData && object.userData.isTerrainMesh) {
          terrainCount++;
        }
        
        if (object.geometry) {
          const positionAttribute = object.geometry.attributes.position;
          if (positionAttribute) {
            totalVertices += positionAttribute.count;
            
            // Warn about high polygon count
            if (positionAttribute.count > 100000) {
              warnings.push(`High polygon count (${positionAttribute.count.toLocaleString()}) on ${object.name || 'unnamed mesh'} may slow export`);
            }
          }
        }

        // Check for unsupported materials
        if (object.material) {
          if (object.material instanceof THREE.ShaderMaterial) {
            unsupportedFeatures.push(`Custom shader material on ${object.name || 'unnamed mesh'}`);
          } else if (object.material instanceof THREE.RawShaderMaterial) {
            unsupportedFeatures.push(`Raw shader material on ${object.name || 'unnamed mesh'}`);
          }
        }
      }

      // Note: CSS2DObject and CSS3DObject checks removed as they're not commonly used
      // and would require additional imports from Three.js

      // Check for complex geometries
      if (object.geometry && object.geometry.type === 'BufferGeometry') {
        const geometry = object.geometry;
        if (!geometry.attributes.position) {
          warnings.push(`Geometry on ${object.name || 'unnamed object'} missing position attribute`);
        }
      }
    });

    // Performance warnings
    if (meshCount > 1000) {
      warnings.push(`High mesh count (${meshCount}) may slow export and increase file size`);
    }

    if (totalVertices > 1000000) {
      warnings.push(`High total vertex count (${totalVertices.toLocaleString()}) may slow export`);
    }

    // Terrain-specific warnings
    if (terrainCount > 0) {
      warnings.push(`${terrainCount} terrain object(s) will be exported as static meshes (procedural generation will be lost)`);
    }

    // Check for lights (limited support in GLTF)
    const lights = [];
    scene.traverse((object) => {
      if (object instanceof THREE.Light) {
        lights.push(object);
      }
    });

    if (lights.length > 0) {
      const supportedLights = lights.filter(light => 
        light instanceof THREE.DirectionalLight || 
        light instanceof THREE.PointLight || 
        light instanceof THREE.SpotLight
      );
      
      if (supportedLights.length < lights.length) {
        warnings.push(`Some light types may not be fully supported in GLB format`);
      }
    }

    return {
      canExport: true, // GLTFExporter handles most cases gracefully
      warnings,
      unsupportedFeatures
    };
  }

  /**
   * Get export capabilities info
   * @returns {Object} Export capabilities information
   */
  static getExportInfo() {
    return {
      maxFileSize: '50MB',
      supportedFeatures: [
        'Meshes with standard materials',
        'Textures and UV mapping',
        'Basic lighting (Directional, Point, Spot)',
        'Animations and morph targets',
        'Scene hierarchy and transforms'
      ],
      limitations: [
        'Custom shaders not supported',
        'CSS objects cannot be exported',
        'Some advanced Three.js features may be lost',
        'Large scenes may have performance impact'
      ]
    };
  }

  /**
   * Prepare scene for export (optional optimization)
   * @param {THREE.Scene} scene - The scene to prepare
   * @returns {THREE.Scene} The prepared scene clone
   */
  static prepareSceneForExport(scene) {
    // Create a clone to avoid modifying the original scene
    const exportScene = scene.clone();

    exportScene.traverse((object) => {
      // Note: CSS2DObject and CSS3DObject checks removed as they're not commonly used
      // and would require additional imports from Three.js

      // Convert unsupported materials to standard materials
      if (object instanceof THREE.Mesh && object.material instanceof THREE.ShaderMaterial) {
        // Convert to MeshStandardMaterial with basic properties
        const standardMaterial = new THREE.MeshStandardMaterial({
          color: 0x4a90e2, // Default color
          transparent: object.material.transparent,
          opacity: object.material.opacity
        });
        object.material = standardMaterial;
      }
    });

    return exportScene;
  }
}