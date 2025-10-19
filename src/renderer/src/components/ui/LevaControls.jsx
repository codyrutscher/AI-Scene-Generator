import { useEffect, useMemo, useCallback, useState } from 'react'
import { useControls } from 'leva'
import { useSceneStore } from '../../stores/sceneStore'
import { useSelectionStore } from '../../stores/selectionStore'
import {
  TERRAIN_VARIANTS,
  TEXTURES,
  getTextureCount,
  getTextureByIndex,
  getTextureIndexByKey,
  getTextureKeys
} from '../3d/Terrain'
import { textureService } from '../../utils/textureService'

export default function LevaControls() {
  // API texture state management
  const [apiTextures, setApiTextures] = useState({
    grass: [],
    mud: [],
    rock: []
  })
  const [texturesLoading, setTexturesLoading] = useState(false)

  // Get store functions with selective subscriptions for performance
  const updateObject = useSceneStore((state) => state.updateObject)
  const objects = useSceneStore((state) => state.objects)

  const selectedObjects = useSelectionStore((state) => state.selectedObjects)
  const getSelectedObjects = useSelectionStore((state) => state.getSelectedObjects)

  // Get selected objects data
  const selectedObjectsData = useMemo(() => {
    return getSelectedObjects(objects)
  }, [objects, selectedObjects, getSelectedObjects])

  // Only show controls when objects are selected
  const hasSelection = selectedObjectsData.length > 0

  // Get the first selected object for controls (multi-selection uses first object as reference)
  const primaryObject = selectedObjectsData[0]

  // Fetch API textures for terrain controls
  const getAvailableTextures = useCallback(async () => {
    if (texturesLoading) return

    setTexturesLoading(true)
    try {
      console.log('[LevaControls] Fetching API textures...')
      
      // Fetch textures for all categories in parallel
      const [grassResult, mudResult, rockResult] = await Promise.all([
        textureService.fetchTexturesByCategory('grass', { limit: 20 }),
        textureService.fetchTexturesByCategory('mud', { limit: 20 }),
        textureService.fetchTexturesByCategory('rock', { limit: 20 })
      ])

      setApiTextures({
        grass: grassResult.textures || [],
        mud: mudResult.textures || [],
        rock: rockResult.textures || []
      })

      console.log('[LevaControls] API textures loaded:', {
        grass: grassResult.textures?.length || 0,
        mud: mudResult.textures?.length || 0,
        rock: rockResult.textures?.length || 0
      })
    } catch (error) {
      console.error('[LevaControls] Error fetching API textures:', error)
      setApiTextures({ grass: [], mud: [], rock: [] })
    } finally {
      setTexturesLoading(false)
    }
  }, [texturesLoading])

  // Load API textures on component mount
  useEffect(() => {
    getAvailableTextures()
  }, [])

  // Simple transform change handler - updates objects immediately
  const handleTransformChange = useCallback(
    (updates) => {
      console.log(
        `[LevaControls] handleTransformChange called with:`,
        updates,
        'primaryObject:',
        primaryObject?.name
      )

      if (!primaryObject) {
        return
      }

      // Apply to all selected objects immediately for visual feedback
      selectedObjectsData.forEach((obj) => {
        const success = updateObject(obj.name, updates)
        console.log(`[LevaControls] Updated ${obj.name} with:`, updates, 'Success:', success)
      })
    },
    [primaryObject, selectedObjectsData, updateObject]
  )

  // Helper function to check if scale values are uniform (all equal)
  const isUniformScale = useCallback((scale) => {
    if (!scale || scale.length !== 3) return false
    const [x, y, z] = scale
    const tolerance = 0.001 // Small tolerance for floating point comparison
    return Math.abs(x - y) < tolerance && Math.abs(y - z) < tolerance && Math.abs(x - z) < tolerance
  }, [])

  // Get current control values from store (always fresh)
  const getCurrentControlValues = useCallback(() => {
    if (!primaryObject) return null

    return {
      position: [primaryObject.position[0], primaryObject.position[1], primaryObject.position[2]],
      rotation: [
        (primaryObject.rotation[0] * 180) / Math.PI,
        (primaryObject.rotation[1] * 180) / Math.PI,
        (primaryObject.rotation[2] * 180) / Math.PI
      ],
      scale: [primaryObject.scale[0], primaryObject.scale[1], primaryObject.scale[2]],
      uniformScaling: isUniformScale(primaryObject.scale)
    }
  }, [primaryObject, isUniformScale])

  // Leva controls configuration - recreate when object changes to show fresh values
  const [controls, setControls] = useControls(() => {
    if (!hasSelection || !primaryObject) {
      return {}
    }

    const currentValues = getCurrentControlValues()
    if (!currentValues) return {}

    const baseControls = {
      // Object Info
      selectedObject: {
        value:
          selectedObjectsData.length === 1
            ? primaryObject.name
            : `${selectedObjectsData.length} objects selected`,
        editable: false
      },

      // Position Controls
      position: {
        value: currentValues.position,
        step: 0.1,
        onChange: (value) => {
          handleTransformChange({ position: value })
        }
      },

      // Rotation Controls (in degrees)
      rotation: {
        value: currentValues.rotation,
        step: 1,
        min: -180,
        max: 180,
        onChange: (value) => {
          // Convert degrees back to radians
          const radians = value.map((deg) => (deg * Math.PI) / 180)
          handleTransformChange({ rotation: radians })
        }
      },

      // Scale Controls
      uniformScaling: {
        value: currentValues.uniformScaling
      },

      // Scale Controls
      scale: {
        value: currentValues.scale,
        step: 0.01,
        min: 0.01,
        max: 100,
        onChange: (value, path, { get }) => {
          const uniform = get('uniformScaling')

          if (uniform) {
            // During dragging: apply uniform scaling immediately
            const uniformValue = value[0] // Use X value for all axes
            const uniformScale = [uniformValue, uniformValue, uniformValue]
            handleTransformChange({ scale: uniformScale })
          } else {
            // Apply non-uniform scaling immediately
            handleTransformChange({ scale: value })
          }
        },
        onEditEnd: (value, path, { get }) => {
          const uniform = get('uniformScaling')

          if (uniform) {
            // On mouse release: ensure Y and Z axes match X for uniform scaling
            const uniformValue = value[0] // Use X value for all axes
            const uniformScale = [uniformValue, uniformValue, uniformValue]

            // Apply uniform scaling to objects
            handleTransformChange({ scale: uniformScale })

            // Update Leva controls to show uniform values
            setTimeout(() => {
              setControls({ scale: uniformScale })
            }, 0)
          }
        }
      },

      // Quick Actions
      resetTransform: {
        value: false,
        onChange: () => {
          const resetValues = {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1]
          }

          handleTransformChange(resetValues)

          // Update Leva controls to show reset values
          setControls({
            position: resetValues.position,
            rotation: resetValues.rotation,
            scale: resetValues.scale
          })
        }
      }
    }

    // Add terrain-specific controls if the selected object is terrain
    if (primaryObject.geometry === 'terrain') {
      // Create options object with variant names as labels
      const variantOptions = Object.keys(TERRAIN_VARIANTS).reduce((acc, key) => {
        acc[TERRAIN_VARIANTS[key].name] = key
        return acc
      }, {})

      baseControls.terrainVariant = {
        value: primaryObject.variant || 'heightmap1',
        options: variantOptions,
        onChange: (value) => {
          console.log(`[LevaControls] Terrain variant changed to: ${value}`)
          handleTransformChange({ variant: value })
        }
      }

      // Add texture controls for heightmap terrains
      const currentVariant = TERRAIN_VARIANTS[primaryObject.variant || 'heightmap1']
      if (currentVariant && currentVariant.type === 'heightmap') {
        // API Texture Dropdowns
        if (apiTextures.grass.length > 0) {
          // Create options object for grass textures with keys that match Terrain component
          const grassOptions = apiTextures.grass.reduce((acc, texture, index) => {
            // Create a clean key from the texture name (same logic as in Terrain.jsx)
            const key = texture.name
              .toLowerCase()
              .replace(/\s+/g, '_')
              .replace(/[^a-z0-9_]/g, '')
              .replace(/_texture$/i, '')
              .replace(/^grass_/i, '')
            const finalKey = key || `grass${index + 1}`
            acc[texture.name] = finalKey // Display name -> key mapping
            return acc
          }, {})

          // Get current texture key from the first available if not set
          const currentGrassKey = primaryObject.grassTexture || Object.values(grassOptions)[0] || ''

          baseControls.grassTexture = {
            value: currentGrassKey,
            options: grassOptions,
            label: 'Grass Texture',
            onChange: (value) => {
              console.log(`[LevaControls] Grass texture changed to key: ${value}`)
              handleTransformChange({ grassTexture: value })
            }
          }
        }

        if (apiTextures.mud.length > 0) {
          // Create options object for mud textures with keys that match Terrain component
          const mudOptions = apiTextures.mud.reduce((acc, texture, index) => {
            // Create a clean key from the texture name (same logic as in Terrain.jsx)
            const key = texture.name
              .toLowerCase()
              .replace(/\s+/g, '_')
              .replace(/[^a-z0-9_]/g, '')
              .replace(/_texture$/i, '')
              .replace(/^mud_/i, '')
            const finalKey = key || `mud${index + 1}`
            acc[texture.name] = finalKey // Display name -> key mapping
            return acc
          }, {})

          // Get current texture key from the first available if not set
          const currentMudKey = primaryObject.mudTexture || Object.values(mudOptions)[0] || ''

          baseControls.mudTexture = {
            value: currentMudKey,
            options: mudOptions,
            label: 'Mud Texture',
            onChange: (value) => {
              console.log(`[LevaControls] Mud texture changed to key: ${value}`)
              handleTransformChange({ mudTexture: value })
            }
          }
        }

        if (apiTextures.rock.length > 0) {
          // Create options object for rock textures with keys that match Terrain component
          const rockOptions = apiTextures.rock.reduce((acc, texture, index) => {
            // Create a clean key from the texture name (same logic as in Terrain.jsx)
            const key = texture.name
              .toLowerCase()
              .replace(/\s+/g, '_')
              .replace(/[^a-z0-9_]/g, '')
              .replace(/_texture$/i, '')
              .replace(/^rock_/i, '')
              .replace(/^stone_/i, '')
            const finalKey = key || `rock${index + 1}`
            acc[texture.name] = finalKey // Display name -> key mapping
            return acc
          }, {})

          // Get current texture key from the first available if not set
          const currentRockKey = primaryObject.rockTexture || Object.values(rockOptions)[0] || ''

          baseControls.rockTexture = {
            value: currentRockKey,
            options: rockOptions,
            label: 'Rock Texture',
            onChange: (value) => {
              console.log(`[LevaControls] Rock texture changed to key: ${value}`)
              handleTransformChange({ rockTexture: value })
            }
          }
        }

        // Add refresh button for textures
        baseControls.refreshTextures = {
          value: false,
          label: 'Refresh Textures',
          onChange: () => {
            console.log('[LevaControls] Refreshing API textures...')
            getAvailableTextures()
          }
        }

        // Add heightmap selector for heightmap terrains
        baseControls.heightmapIndex = {
          value: primaryObject.heightmapIndex || 1,
          min: 1,
          max: 5,
          step: 1,
          label: 'Heightmap',
          onChange: (value) => {
            console.log(`[LevaControls] Heightmap index changed to: ${value}`)
            handleTransformChange({ heightmapIndex: value })
          }
        }
      }
    }

    return baseControls
  }, [
    // Only recreate when selection changes, not when transform values change
    hasSelection,
    primaryObject?.name,
    primaryObject?.geometry,
    primaryObject?.variant,
    primaryObject?.grassTexture,
    primaryObject?.mudTexture,
    primaryObject?.rockTexture,
    primaryObject?.heightmapIndex,
    selectedObjectsData.length,
    // Add API textures to dependencies so UI updates when API textures load
    // apiTextures.grass.length,
    // apiTextures.mud.length,
    // apiTextures.rock.length,
    // texturesLoading,
    // getAvailableTextures
  ])

  // Update control values when object transforms change (without recreating controls)
  useEffect(() => {
    if (!hasSelection || !primaryObject) return

    const currentValues = getCurrentControlValues()
    if (!currentValues) return

    // Update control values to reflect current object state
    setControls({
      position: currentValues.position,
      rotation: currentValues.rotation,
      scale: currentValues.scale,
      uniformScaling: currentValues.uniformScaling
    })
  }, [
    hasSelection,
    primaryObject?.position?.[0],
    primaryObject?.position?.[1],
    primaryObject?.position?.[2],
    primaryObject?.rotation?.[0],
    primaryObject?.rotation?.[1],
    primaryObject?.rotation?.[2],
    primaryObject?.scale?.[0],
    primaryObject?.scale?.[1],
    primaryObject?.scale?.[2],
    getCurrentControlValues,
    setControls
  ])

  // This component doesn't render anything visible - Leva handles the UI
  return null
}