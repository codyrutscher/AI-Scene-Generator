import { useState } from 'react'
import { getInitialObjects } from '../utils/objectUtils'
import { handleCommand } from '../utils/commandHandler'

// Custom hook for managing scene objects and their state
export const useSceneObjects = () => {
  const [selectedObjects, setSelectedObjects] = useState(new Set())
  const [objects, setObjects] = useState(getInitialObjects())
  const [lastAction, setLastAction] = useState('')
  const [objectCounter, setObjectCounter] = useState(1) // Start from 1 for new objects
  
  // Model search related state
  const [showModelSearch, setShowModelSearch] = useState(false)
  const [modelSearchResults, setModelSearchResults] = useState(null)
  const [modelSearchQuery, setModelSearchQuery] = useState('')
  const [pendingModelPosition, setPendingModelPosition] = useState([0, 0, 0])
  const [isModelSearchLoading, setIsModelSearchLoading] = useState(false)

  // Handle object selection
  const handleObjectSelect = (name) => {
    setSelectedObjects((prev) => {
      const newSelection = new Set(prev)
      if (newSelection.has(name)) {
        newSelection.delete(name)
        setLastAction(`Deselected ${name}`)
      } else {
        newSelection.add(name)
        setLastAction(`Selected ${name}`)
      }
      return newSelection
    })
  }

  // Handle empty space click
  const handleEmptyClick = () => {
    setSelectedObjects(new Set())
    setLastAction('Deselected all objects')
  }

  // Handle text commands
  const handleTextCommand = (command) => {
    handleCommand(
      command,
      objects,
      selectedObjects,
      setObjects,
      setSelectedObjects,
      setLastAction,
      setObjectCounter,
      objectCounter,
      setShowModelSearch,
      setModelSearchResults,
      setModelSearchQuery,
      setPendingModelPosition,
      setIsModelSearchLoading
    )
  }

  // Clear selection
  const clearSelection = () => {
    setSelectedObjects(new Set())
    setLastAction('Cleared selection')
  }

  // Select all objects
  const selectAll = () => {
    const allNames = objects.map(obj => obj.name)
    setSelectedObjects(new Set(allNames))
    setLastAction(`Selected all ${allNames.length} objects`)
  }

  // Get selected object names as array
  const getSelectedObjectNames = () => {
    return Array.from(selectedObjects)
  }

  // Get selected objects data
  const getSelectedObjects = () => {
    return objects.filter(obj => selectedObjects.has(obj.name))
  }

  // Check if object is selected
  const isObjectSelected = (name) => {
    return selectedObjects.has(name)
  }

  // Get object count by type
  const getObjectCountByType = (geometry) => {
    return objects.filter(obj => obj.geometry === geometry).length
  }

  // Get total object count
  const getTotalObjectCount = () => {
    return objects.length
  }

  // Add new object programmatically
  const addObject = (geometry, color, position) => {
    const newId = crypto.randomUUID()
    const newName = `${geometry}${objectCounter}`
    const newObject = {
      id: newId,
      name: newName,
      position: position || [(Math.random() - 0.5) * 8, Math.random() * 2, (Math.random() - 0.5) * 8],
      geometry,
      color: color || '#4a90e2',
      scale: [1, 1, 1],
      rotation: [0, 0, 0]
    }

    setObjects(prev => [...prev, newObject])
    setObjectCounter(prev => prev + 1)
    setLastAction(`Added ${newName}`)
    
    // Auto-select the new object
    setSelectedObjects(new Set([newName]))
    
    return newObject
  }

  // Remove object by name
  const removeObject = (name) => {
    const objectExists = objects.some(obj => obj.name === name)
    if (!objectExists) {
      setLastAction(`Object not found: ${name}`)
      return false
    }

    setObjects(prev => prev.filter(obj => obj.name !== name))
    setSelectedObjects(prev => {
      const newSelection = new Set(prev)
      newSelection.delete(name)
      return newSelection
    })
    setLastAction(`Removed ${name}`)
    return true
  }

  // Update object properties
  const updateObject = (name, updates) => {
    const objectExists = objects.some(obj => obj.name === name)
    if (!objectExists) {
      setLastAction(`Object not found: ${name}`)
      return false
    }

    setObjects(prev => prev.map(obj => 
      obj.name === name ? { ...obj, ...updates } : obj
    ))
    setLastAction(`Updated ${name}`)
    return true
  }

  // Reset scene to initial state
  const resetScene = () => {
    setObjects(getInitialObjects())
    setSelectedObjects(new Set())
    setObjectCounter(1)
    setLastAction('Scene reset to initial state')
  }

  return {
    // State
    objects,
    selectedObjects,
    lastAction,
    objectCounter,
    
    // Model search state
    showModelSearch,
    modelSearchResults,
    modelSearchQuery,
    pendingModelPosition,
    isModelSearchLoading,
    
    // Selection methods
    handleObjectSelect,
    handleEmptyClick,
    clearSelection,
    selectAll,
    isObjectSelected,
    getSelectedObjectNames,
    getSelectedObjects,
    
    // Command handling
    handleTextCommand,
    
    // Object management
    addObject,
    removeObject,
    updateObject,
    
    // Utility methods
    getObjectCountByType,
    getTotalObjectCount,
    resetScene,
    
    // State setters (for advanced usage)
    setObjects,
    setSelectedObjects,
    setLastAction,
    setObjectCounter,
    setShowModelSearch,
    setModelSearchResults,
    setModelSearchQuery,
    setPendingModelPosition,
    setIsModelSearchLoading
  }
}

export default useSceneObjects