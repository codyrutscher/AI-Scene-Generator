import { useEffect, useMemo, useCallback, } from 'react'
import { useControls } from 'leva'
import { useSceneStore } from '../../stores/sceneStore'
import { useSelectionStore } from '../../stores/selectionStore'

export default function LevaControls() {
  // Get store functions with selective subscriptions for performance
  const updateObject = useSceneStore(state => state.updateObject)
  const objects = useSceneStore(state => state.objects)
  
  const selectedObjects = useSelectionStore(state => state.selectedObjects)
  const getSelectedObjects = useSelectionStore(state => state.getSelectedObjects)

  // Get selected objects data
  const selectedObjectsData = useMemo(() => {
    return getSelectedObjects(objects)
  }, [objects, selectedObjects, getSelectedObjects])

  // Only show controls when objects are selected
  const hasSelection = selectedObjectsData.length > 0

  // Get the first selected object for controls (multi-selection uses first object as reference)
  const primaryObject = selectedObjectsData[0]

  // Simple transform change handler - updates objects immediately
  const handleTransformChange = useCallback((updates) => {
    if (!primaryObject) {
      return
    }

    // Apply to all selected objects immediately for visual feedback
    selectedObjectsData.forEach(obj => {
      updateObject(obj.name, updates)
    })
  }, [primaryObject, selectedObjectsData, updateObject])

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

    return {
      // Object Info
      selectedObject: {
        value: selectedObjectsData.length === 1 
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
          const radians = value.map(deg => (deg * Math.PI) / 180)
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
  }, [
    // Only recreate when selection changes, not when transform values change
    hasSelection, 
    primaryObject?.name,
    selectedObjectsData.length
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
    primaryObject?.position?.[0], primaryObject?.position?.[1], primaryObject?.position?.[2],
    primaryObject?.rotation?.[0], primaryObject?.rotation?.[1], primaryObject?.rotation?.[2],
    primaryObject?.scale?.[0], primaryObject?.scale?.[1], primaryObject?.scale?.[2],
    getCurrentControlValues,
    setControls
  ])

  // This component doesn't render anything visible - Leva handles the UI
  return null
}