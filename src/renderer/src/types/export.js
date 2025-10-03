// Export functionality type definitions
// This file contains JSDoc type definitions for export functionality

/**
 * @typedef {Object} ExportOptions
 * @property {'json' | 'glb'} format - Export format
 * @property {string} filename - Output filename
 * @property {boolean} includeCamera - Whether to include camera data
 * @property {boolean} includeLighting - Whether to include lighting data
 * @property {boolean} includeMetadata - Whether to include metadata
 * @property {boolean} [binary] - For GLB format
 * @property {THREE.AnimationClip[]} [animations] - For GLB with animations
 * @property {boolean} [onlyVisible] - Export only visible objects
 * @property {boolean} [trs] - Export transform as separate position/rotation/scale
 */

/**
 * @typedef {Object} ObjectData
 * @property {string} id - Unique identifier
 * @property {string} name - Object name
 * @property {string} geometry - Geometry type
 * @property {[number, number, number]} position - Position coordinates
 * @property {[number, number, number]} rotation - Rotation values
 * @property {[number, number, number]} scale - Scale values
 * @property {string} color - Object color
 * @property {MaterialData} [material] - Material data
 * @property {boolean} [visible] - Visibility state
 * @property {Object} [modelData] - Model-specific data
 * @property {string} modelData.url - Model URL
 * @property {string} modelData.name - Model name
 * @property {string} [modelData.description] - Model description
 * @property {string[]} [modelData.tags] - Model tags
 */

/**
 * @typedef {Object} MaterialData
 * @property {string} type - Material type
 * @property {Record<string, any>} properties - Material properties
 */

/**
 * @typedef {Object} CameraData
 * @property {[number, number, number]} position - Camera position
 * @property {[number, number, number]} target - Camera target
 * @property {number} fov - Field of view
 * @property {number} [near] - Near clipping plane
 * @property {number} [far] - Far clipping plane
 */

/**
 * @typedef {Object} LightingData
 * @property {string} ambient - Ambient light color
 * @property {Object} [directional] - Directional light data
 * @property {string} directional.color - Light color
 * @property {[number, number, number]} directional.position - Light position
 * @property {number} [directional.intensity] - Light intensity
 */

/**
 * @typedef {Object} SceneMetadata
 * @property {string} appVersion - Application version
 * @property {number} totalObjects - Total object count
 * @property {string} exportDate - Export date
 * @property {Partial<ExportOptions>} exportOptions - Export options used
 */

/**
 * @typedef {Object} SceneState
 * @property {ObjectData[]} objects - Scene objects
 * @property {CameraData} [camera] - Camera data
 * @property {LightingData} [lighting] - Lighting data
 * @property {SceneMetadata} [metadata] - Scene metadata
 */

/**
 * @typedef {Object} SceneExportData
 * @property {string} version - Export format version
 * @property {string} timestamp - Export timestamp
 * @property {SceneMetadata} metadata - Export metadata
 * @property {Object} scene - Scene data
 * @property {ObjectData[]} scene.objects - Scene objects
 * @property {CameraData} [scene.camera] - Camera data
 * @property {LightingData} [scene.lighting] - Lighting data
 */

/**
 * @typedef {Object} ImportValidation
 * @property {boolean} isValid - Whether import is valid
 * @property {string[]} errors - Validation errors
 * @property {string[]} warnings - Validation warnings
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} canExport - Whether export is possible
 * @property {string[]} warnings - Export warnings
 * @property {string[]} unsupportedFeatures - Unsupported features
 */

/**
 * @typedef {Object} ExportDialogProps
 * @property {boolean} isOpen - Whether dialog is open
 * @property {Function} onClose - Close handler
 * @property {THREE.Scene} [scene] - Three.js scene
 * @property {SceneState} sceneData - Scene data
 */

/**
 * @typedef {Object} ImportDialogProps
 * @property {boolean} isOpen - Whether dialog is open
 * @property {Function} onClose - Close handler
 * @property {Function} onImport - Import handler
 */

/**
 * @typedef {Object} ExportProgress
 * @property {'preparing' | 'processing' | 'generating' | 'complete'} stage - Current stage
 * @property {number} progress - Progress percentage (0-100)
 * @property {string} message - Progress message
 */

// Export empty object to make this a module
export {};