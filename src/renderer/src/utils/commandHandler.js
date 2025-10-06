// Command handling utilities
import { ModelSearch } from './modelSearch.js';

// Initialize model search instance
const modelSearch = new ModelSearch();

// Parse command and execute appropriate action
export const handleCommand = (command, objects, selectedObjects, setObjects, setSelectedObjects, setLastAction, setObjectCounter, objectCounter, setShowModelSearch, setModelSearchResults, setModelSearchQuery, setPendingModelPosition, setIsModelSearchLoading) => {
  console.log('Command received:', command)
  const parts = command.split(' ')
  const action = parts[0]

  // Creation commands
  if (action === 'create' && parts.length >= 2) {
    return handleCreateCommand(parts, setObjects, setObjectCounter, setLastAction, setSelectedObjects, objectCounter, setShowModelSearch, setModelSearchResults, setModelSearchQuery, setPendingModelPosition, setIsModelSearchLoading)
  }

  // Selection commands
  const objectNames = objects.map((obj) => obj.name)

  if (command === 'select all') {
    setSelectedObjects(new Set(objectNames))
    setLastAction(`Selected all ${objectNames.length} objects`)
  } else if (command === 'deselect' || command === 'deselect all') {
    setSelectedObjects(new Set())
    setLastAction('Deselected all objects')
  } else if (command.startsWith('select cube')) {
    const cubes = objects.filter((obj) => obj.geometry === 'box').map((obj) => obj.name)
    setSelectedObjects(new Set(cubes))
    setLastAction(`Selected ${cubes.length} cubes`)
  } else if (command.startsWith('select sphere')) {
    const spheres = objects.filter((obj) => obj.geometry === 'sphere').map((obj) => obj.name)
    setSelectedObjects(new Set(spheres))
    setLastAction(`Selected ${spheres.length} spheres`)
  } else if (command.startsWith('select cylinder')) {
    const cylinders = objects.filter((obj) => obj.geometry === 'cylinder').map((obj) => obj.name)
    setSelectedObjects(new Set(cylinders))
    setLastAction(`Selected ${cylinders.length} cylinders`)
  } else if (command.startsWith('select ')) {
    const objectName = command.replace('select ', '')
    if (objectNames.includes(objectName)) {
      setSelectedObjects(new Set([objectName]))
      setLastAction(`Selected ${objectName}`)
    } else {
      setLastAction(`Object not found: ${objectName}`)
    }
  }
  // Scale commands
  else if (action === 'scale') {
    handleScaleCommand(parts, objects, selectedObjects, setObjects, setLastAction)
  }
  // Rotate commands
  else if (action === 'rotate') {
    handleRotateCommand(parts, objects, selectedObjects, setObjects, setLastAction)
  }
  // Move commands
  else if (action === 'move') {
    handleMoveCommand(parts, objects, selectedObjects, setObjects, setLastAction)
  }
  // Delete commands
  else if (action === 'delete') {
    handleDeleteCommand(parts, objects, selectedObjects, setObjects, setSelectedObjects, setLastAction)
  } else {
    setLastAction(`Unknown command: ${command}`)
  }
}

// Handle create commands
const handleCreateCommand = (parts, setObjects, setObjectCounter, setLastAction, setSelectedObjects, objectCounter, setShowModelSearch, setModelSearchResults, setModelSearchQuery, setPendingModelPosition, setIsModelSearchLoading) => {
  const shapeType = parts[1]
  let color
  let position

  // Handle create model commands
  if (shapeType === 'model' && parts.length >= 3) {
    return handleCreateModelCommand(parts, setLastAction, setShowModelSearch, setModelSearchResults, setModelSearchQuery, setPendingModelPosition, setIsModelSearchLoading)
  }
  
  // Handle test model command
  if (shapeType === 'test' && parts[2] === 'model') {
    // Parse position (e.g., "create test model at 2 0 0")
    const atIndex = parts.indexOf('at')
    let position = [0, 0, 0] // default position
    
    if (atIndex !== -1 && parts.length >= atIndex + 4) {
      const x = parseFloat(parts[atIndex + 1])
      const y = parseFloat(parts[atIndex + 2])
      const z = parseFloat(parts[atIndex + 3])
      if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        position = [x, y, z]
      }
    }
    
    createTestModel(position, setObjects, setObjectCounter, setLastAction, setSelectedObjects, objectCounter)
    return
  }

  // Parse optional color (e.g., "create red cube")
  const colorKeywords = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan']
  const colorMap = {
    red: '#ff4444',
    blue: '#4444ff',
    green: '#44ff44',
    yellow: '#ffff44',
    purple: '#ff44ff',
    orange: '#ff8844',
    pink: '#ff88cc',
    cyan: '#44ffff'
  }

  for (let i = 1; i < parts.length; i++) {
    if (colorKeywords.includes(parts[i])) {
      color = colorMap[parts[i]]
      break
    }
  }

  // Parse position (e.g., "create cube at 2 0 0")
  const atIndex = parts.indexOf('at')
  if (atIndex !== -1 && parts.length >= atIndex + 4) {
    const x = parseFloat(parts[atIndex + 1])
    const y = parseFloat(parts[atIndex + 2])
    const z = parseFloat(parts[atIndex + 3])
    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
      position = [x, y, z]
    }
  }

  // Create the shape
  if (shapeType === 'cube' || shapeType === 'box') {
    createObject('box', color, position, setObjects, setObjectCounter, setLastAction, setSelectedObjects, objectCounter)
  } else if (shapeType === 'sphere') {
    createObject('sphere', color, position, setObjects, setObjectCounter, setLastAction, setSelectedObjects, objectCounter)
  } else if (shapeType === 'cylinder') {
    createObject('cylinder', color, position, setObjects, setObjectCounter, setLastAction, setSelectedObjects, objectCounter)
  } else if (shapeType === 'model') {
    // Handle model creation - delegate to handleCreateModelCommand
    handleCreateModelCommand(parts, setLastAction, setShowModelSearch, setModelSearchResults, setModelSearchQuery, setPendingModelPosition, setIsModelSearchLoading)
  } else {
    setLastAction(`Unknown shape type: ${shapeType}`)
  }
}

// Generate random position for new objects
const generateRandomPosition = () => {
  return [
    (Math.random() - 0.5) * 8, // x: -4 to 4
    Math.random() * 2, // y: 0 to 2
    (Math.random() - 0.5) * 8 // z: -4 to 4
  ]
}

// Create new object
const createObject = (geometry, color, position, setObjects, setObjectCounter, setLastAction, setSelectedObjects, objectCounter) => {
  const newId = crypto.randomUUID()
  const newName = `${geometry}${objectCounter}`
  const newObject = {
    id: newId,
    name: newName,
    position: position || generateRandomPosition(),
    geometry,
    color,
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  }

  setObjects((prev) => [...prev, newObject])
  setObjectCounter((prev) => prev + 1)
  setLastAction(`Created ${newName}`)

  // Auto-select the new object
  setSelectedObjects(new Set([newName]))

  return newObject
}

// Handle create model commands
const handleCreateModelCommand = async (parts, setLastAction, setShowModelSearch, setModelSearchResults, setModelSearchQuery, setPendingModelPosition, setIsModelSearchLoading) => {
  // Parse command: "create model <search_term> at <x> <y> <z>"
  const searchTerm = parts[2]
  
  // Parse position (e.g., "create model house at 2 0 0")
  const atIndex = parts.indexOf('at')
  let position = [0, 0, 0] // default position
  
  if (atIndex !== -1 && parts.length >= atIndex + 4) {
    const x = parseFloat(parts[atIndex + 1])
    const y = parseFloat(parts[atIndex + 2])
    const z = parseFloat(parts[atIndex + 3])
    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
      position = [x, y, z]
    }
  }
  
  try {
    setLastAction(`Searching for models: ${searchTerm}...`)
    setIsModelSearchLoading(true)
    
    // Search for models using the API
    const searchResults = await modelSearch.searchModels(searchTerm)
    
    if (searchResults.error) {
      setLastAction(`Model search failed: ${searchResults.error}`)
      setIsModelSearchLoading(false)
      return
    }
    
    if (searchResults.models.length === 0) {
      setLastAction(`No models found for: ${searchTerm}`)
      setIsModelSearchLoading(false)
      return
    }
    
    // Store the search results and position for later use
    setModelSearchResults(searchResults)
    setModelSearchQuery(searchTerm)
    setPendingModelPosition(position)
    setShowModelSearch(true)
    setIsModelSearchLoading(false)
    
    setLastAction(`Found ${searchResults.models.length} models for "${searchTerm}". Select one to place at position [${position.join(', ')}].`)
    
  } catch (error) {
    console.error('Model search error:', error)
    setLastAction(`Failed to search for models: ${error.message}`)
    setIsModelSearchLoading(false)
  }
}



// Create model object (called when user selects a model from search results)
export const createModelObject = (modelData, position, setObjects, setObjectCounter, setLastAction, setSelectedObjects, objectCounter) => {
  console.log('Creating model object with data:', modelData)
  const newId = crypto.randomUUID()
  const newName = `${modelData.name.replace(/\s+/g, '_').toLowerCase()}${objectCounter}`
  
  const newObject = {
    id: newId,
    name: newName,
    position: position || generateRandomPosition(),
    geometry: 'model', // Special geometry type for 3D models
    modelData: {
      url: modelData.url,
      thumbnail: modelData.thumbnail,
      originalName: modelData.name,
      description: modelData.description,
      source: modelData.source
    },
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    type: 'model' // Mark as 3D model for special handling
  }
  
  setObjects((prev) => [...prev, newObject])
  setObjectCounter((prev) => prev + 1)
  setLastAction(`Created 3D model: ${newName} at position [${position.join(', ')}]`)
  
  // Auto-select the new model
  setSelectedObjects(new Set([newName]))
  
  return newObject
}

// Handle scale commands
const handleScaleCommand = (parts, objects, selectedObjects, setObjects, setLastAction) => {
  if (parts.length >= 3) {
    const target = parts[1]
    const scaleValues = parts
      .slice(2)
      .map(parseFloat)
      .filter((n) => !isNaN(n))

    if (scaleValues.length === 0) {
      setLastAction('Invalid scale values')
      return
    }

    // Convert single value to uniform scale, or use provided values
    let scaleX, scaleY, scaleZ
    if (scaleValues.length === 1) {
      scaleX = scaleY = scaleZ = scaleValues[0]
    } else if (scaleValues.length === 3) {
      ;[scaleX, scaleY, scaleZ] = scaleValues
    } else {
      setLastAction('Scale requires 1 or 3 values (uniform or x y z)')
      return
    }

    if (target === 'selected') {
      if (selectedObjects.size === 0) {
        setLastAction('No objects selected to scale')
        return
      }

      setObjects((prev) =>
        prev.map((obj) => {
          if (selectedObjects.has(obj.name)) {
            return {
              ...obj,
              scale: [obj.scale[0] * scaleX, obj.scale[1] * scaleY, obj.scale[2] * scaleZ]
            }
          }
          return obj
        })
      )

      setLastAction(
        `Scaled ${selectedObjects.size} selected objects by ${scaleX}${scaleValues.length === 3 ? `, ${scaleY}, ${scaleZ}` : ''}`
      )
    } else {
      // Scale specific object by name
      const targetObject = objects.find((obj) => obj.name === target)
      if (!targetObject) {
        setLastAction(`Object not found: ${target}`)
        return
      }

      setObjects((prev) =>
        prev.map((obj) => {
          if (obj.name === target) {
            return {
              ...obj,
              scale: [obj.scale[0] * scaleX, obj.scale[1] * scaleY, obj.scale[2] * scaleZ]
            }
          }
          return obj
        })
      )

      setLastAction(
        `Scaled ${target} by ${scaleX}${scaleValues.length === 3 ? `, ${scaleY}, ${scaleZ}` : ''}`
      )
    }
  } else {
    setLastAction(
      'Scale command requires target and scale values (e.g., "scale selected 2" or "scale cube1 1.5")'
    )
  }
}

// Handle rotate commands
const handleRotateCommand = (parts, objects, selectedObjects, setObjects, setLastAction) => {
  if (parts.length >= 3) {
    const target = parts[1]
    const rotationValues = parts
      .slice(2)
      .map(parseFloat)
      .filter((n) => !isNaN(n))

    if (rotationValues.length === 0) {
      setLastAction('Invalid rotation values')
      return
    }

    // Convert degrees to radians and handle different input formats
    let rotX, rotY, rotZ
    if (rotationValues.length === 1) {
      // Single value rotates around Y axis (most common)
      rotX = 0
      rotY = (rotationValues[0] * Math.PI) / 180
      rotZ = 0
    } else if (rotationValues.length === 3) {
      // Three values for X, Y, Z rotation
      rotX = (rotationValues[0] * Math.PI) / 180
      rotY = (rotationValues[1] * Math.PI) / 180
      rotZ = (rotationValues[2] * Math.PI) / 180
    } else {
      setLastAction('Rotation requires 1 or 3 values (Y-axis or X Y Z)')
      return
    }

    if (target === 'selected') {
      if (selectedObjects.size === 0) {
        setLastAction('No objects selected to rotate')
        return
      }

      setObjects((prev) =>
        prev.map((obj) => {
          if (selectedObjects.has(obj.name)) {
            return {
              ...obj,
              rotation: [obj.rotation[0] + rotX, obj.rotation[1] + rotY, obj.rotation[2] + rotZ]
            }
          }
          return obj
        })
      )

      const rotationDesc =
        rotationValues.length === 1
          ? `${rotationValues[0]}° (Y-axis)`
          : `${rotationValues[0]}°, ${rotationValues[1]}°, ${rotationValues[2]}° (X, Y, Z)`
      setLastAction(`Rotated ${selectedObjects.size} selected objects by ${rotationDesc}`)
    } else {
      // Rotate specific object by name
      const targetObject = objects.find((obj) => obj.name === target)
      if (!targetObject) {
        setLastAction(`Object not found: ${target}`)
        return
      }

      setObjects((prev) =>
        prev.map((obj) => {
          if (obj.name === target) {
            return {
              ...obj,
              rotation: [obj.rotation[0] + rotX, obj.rotation[1] + rotY, obj.rotation[2] + rotZ]
            }
          }
          return obj
        })
      )

      const rotationDesc =
        rotationValues.length === 1
          ? `${rotationValues[0]}° (Y-axis)`
          : `${rotationValues[0]}°, ${rotationValues[1]}°, ${rotationValues[2]}° (X, Y, Z)`
      setLastAction(`Rotated ${target} by ${rotationDesc}`)
    }
  } else {
    setLastAction(
      'Rotate command requires target and rotation values (e.g., "rotate selected 45" or "rotate cube1 90 0 45")'
    )
  }
}

// Handle move commands
const handleMoveCommand = (parts, objects, selectedObjects, setObjects, setLastAction) => {
  if (parts.length >= 4) {
    const target = parts[1]

    // Check if it's absolute positioning (contains 'to')
    const toIndex = parts.indexOf('to')
    const isAbsolute = toIndex !== -1

    let moveValues
    if (isAbsolute) {
      // Absolute positioning: 'move selected to 2 1 0'
      moveValues = parts
        .slice(toIndex + 1)
        .map(parseFloat)
        .filter((n) => !isNaN(n))
    } else {
      // Relative movement: 'move selected 1 0 0'
      moveValues = parts
        .slice(2)
        .map(parseFloat)
        .filter((n) => !isNaN(n))
    }

    if (moveValues.length !== 3) {
      setLastAction('Move command requires 3 values (x y z)')
      return
    }

    const [moveX, moveY, moveZ] = moveValues

    if (target === 'selected') {
      if (selectedObjects.size === 0) {
        setLastAction('No objects selected to move')
        return
      }

      setObjects((prev) =>
        prev.map((obj) => {
          if (selectedObjects.has(obj.name)) {
            return {
              ...obj,
              position: isAbsolute
                ? [moveX, moveY, moveZ]
                : [obj.position[0] + moveX, obj.position[1] + moveY, obj.position[2] + moveZ]
            }
          }
          return obj
        })
      )

      const moveDesc = isAbsolute
        ? `to position (${moveX}, ${moveY}, ${moveZ})`
        : `by offset (${moveX}, ${moveY}, ${moveZ})`
      setLastAction(`Moved ${selectedObjects.size} selected objects ${moveDesc}`)
    } else {
      // Move specific object by name
      const targetObject = objects.find((obj) => obj.name === target)
      if (!targetObject) {
        setLastAction(`Object not found: ${target}`)
        return
      }

      setObjects((prev) =>
        prev.map((obj) => {
          if (obj.name === target) {
            return {
              ...obj,
              position: isAbsolute
                ? [moveX, moveY, moveZ]
                : [obj.position[0] + moveX, obj.position[1] + moveY, obj.position[2] + moveZ]
            }
          }
          return obj
        })
      )

      const moveDesc = isAbsolute
        ? `to position (${moveX}, ${moveY}, ${moveZ})`
        : `by offset (${moveX}, ${moveY}, ${moveZ})`
      setLastAction(`Moved ${target} ${moveDesc}`)
    }
  } else {
    setLastAction(
      'Move command requires target and position values (e.g., "move selected to 2 1 0" or "move cube1 1 0 0")'
    )
  }
}

// Handle delete commands
const handleDeleteCommand = (parts, objects, selectedObjects, setObjects, setSelectedObjects, setLastAction) => {
  if (parts.length >= 2) {
    const target = parts[1]

    if (target === 'selected') {
      if (selectedObjects.size === 0) {
        setLastAction('No objects selected to delete')
        return
      }

      const deletedCount = selectedObjects.size
      setObjects((prev) => prev.filter((obj) => !selectedObjects.has(obj.name)))
      setSelectedObjects(new Set())
      setLastAction(`Deleted ${deletedCount} selected objects`)
    } else {
      // Delete specific object by name
      const targetObject = objects.find((obj) => obj.name === target)
      if (!targetObject) {
        setLastAction(`Object not found: ${target}`)
        return
      }

      setObjects((prev) => prev.filter((obj) => obj.name !== target))
      setSelectedObjects((prev) => {
        const newSelection = new Set(prev)
        newSelection.delete(target)
        return newSelection
      })
      setLastAction(`Deleted ${target}`)
    }
  } else {
    setLastAction('Delete command requires a target (e.g., "delete selected" or "delete cube1")')
  }
}