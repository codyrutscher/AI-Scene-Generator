// Command handling utilities with Zustand integration
import { ModelSearch } from './modelSearch.js'
import { useSceneStore } from '../stores/sceneStore.js'
import { useSelectionStore } from '../stores/selectionStore.js'
import { useModelSearchStore } from '../stores/modelSearchStore.js'
import { claudeService } from './claudeService.js'

// Initialize model search instance
const modelSearch = new ModelSearch()

// Helper function to generate random position
const generateRandomPosition = () => [
  (Math.random() - 0.5) * 8,
  Math.random() * 2,
  (Math.random() - 0.5) * 8
]

// Parse command and execute appropriate action
export const handleCommand = async (command) => {
  const originalCommand = command.trim()

  // Try to use Claude if initialized
  if (claudeService.isInitialized()) {
    try {
      const { objects } = useSceneStore.getState()
      const { selectedObjects } = useSelectionStore.getState()

      // Build scene context for Claude
      const sceneContext = {
        objectCount: objects.length,
        objectNames: objects.map((obj) => obj.name),
        selectedCount: selectedObjects.size,
        selectedNames: Array.from(selectedObjects)
      }

      // Parse natural language with Claude
      const parsedCommand = await claudeService.parseCommand(originalCommand, sceneContext)
      console.log('Claude parsed:', originalCommand, '→', parsedCommand)

      // Execute the parsed command
      command = parsedCommand
    } catch (error) {
      console.error('Claude parsing failed:', error)
      useSelectionStore.getState().setLastAction(`AI parsing failed: ${error.message}`)
      return
    }
  } else {
    // If Claude is not enabled, normalize the command format
    // Remove commas and parentheses from coordinates
    command = command.replace(/[(),]/g, ' ').replace(/\s+/g, ' ').trim()
  }

  // Parse command - preserve case for model search terms
  const parts = command.trim().split(/\s+/)

  if (parts.length === 0) return

  const action = parts[0].toLowerCase()

  switch (action) {
    case 'create':
      await handleCreateCommand(parts)
      break
    case 'clone':
    case 'duplicate':
    case 'copy':
      handleCloneCommand(parts)
      break
    case 'select':
      handleSelectCommand(parts)
      break
    case 'delete':
    case 'remove':
      handleDeleteCommand(parts)
      break
    case 'scale':
      handleScaleCommand(parts)
      break
    case 'rotate':
      handleRotateCommand(parts)
      break
    case 'move':
      handleMoveCommand(parts)
      break
    case 'change':
      handleChangeCommand(parts)
      break
    case 'clear':
      handleClearCommand()
      break
    case 'reset':
      handleResetCommand()
      break
    default:
      useSelectionStore.getState().setLastAction(`Unknown command: ${action}`)
  }
}

// Handle create commands
const handleCreateCommand = async (parts) => {
  if (parts.length < 2) {
    useSelectionStore.getState().setLastAction('Create command requires an object type')
    return
  }

  const objectType = parts[1].toLowerCase()

  if (objectType === 'model') {
    await handleCreateModelCommand(parts)
  } else if (objectType === 'terrain') {
    handleCreateTerrainCommand(parts)
  } else {
    handleCreateBasicObject(parts)
  }
}

// Handle terrain creation
const handleCreateTerrainCommand = (parts) => {
  const { objects, setObjects, objectCounter, setObjectCounter } = useSceneStore.getState()
  const { setLastAction, clearSelection, selectObject } = useSelectionStore.getState()

  let variant = 'heightmap1' // default variant
  let heightmapIndex = 1 // default heightmap
  let position = null
  // Use undefined to let Terrain component choose first available texture
  let grassTexture = undefined
  let mudTexture = undefined
  let rockTexture = undefined

  // Parse variant and position
  if (parts.length >= 3) {
    const variantCandidate = parts[2].toLowerCase()

    // Check for heightmap variants (heightmap1-5)
    const heightmapMatch = variantCandidate.match(/^heightmap(\d)$/)
    if (heightmapMatch) {
      const index = parseInt(heightmapMatch[1])
      if (index >= 1 && index <= 5) {
        variant = variantCandidate
        heightmapIndex = index
      }
    }

    // Parse additional texture parameters
    for (let i = 3; i < parts.length; i++) {
      if (parts[i] === 'grass' && i + 1 < parts.length) {
        grassTexture = parts[i + 1]
        i++ // skip next part as it's consumed
      } else if (parts[i] === 'mud' && i + 1 < parts.length) {
        mudTexture = parts[i + 1]
        i++
      } else if (parts[i] === 'rock' && i + 1 < parts.length) {
        rockTexture = parts[i + 1]
        i++
      } else if (parts[i] === 'heightmap' && i + 1 < parts.length) {
        const index = parseInt(parts[i + 1])
        if (!isNaN(index) && index >= 1 && index <= 5) {
          heightmapIndex = index
        }
        i++
      }
    }
  }

  // Parse position
  const atIndex = parts.indexOf('at')
  if (atIndex !== -1 && atIndex + 3 < parts.length) {
    const x = parseFloat(parts[atIndex + 1])
    const y = parseFloat(parts[atIndex + 2])
    const z = parseFloat(parts[atIndex + 3])
    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
      position = [x, y, z]
    }
  }

  // Create terrain object
  const newId = crypto.randomUUID()
  const newName = `terrain${objectCounter}`

  const newObject = {
    id: newId,
    name: newName,
    position: position || [0, 0, 0],
    geometry: 'terrain',
    variant,
    heightmapIndex,
    grassTexture,
    mudTexture,
    rockTexture,
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    type: 'terrain'
  }

  setObjects([...objects, newObject])
  setObjectCounter(objectCounter + 1)

  // Create success message
  let message = `Created ${variant} terrain with heightmap ${heightmapIndex}`
  message += ` (grass: ${grassTexture}, mud: ${mudTexture}, rock: ${rockTexture})`
  message += ` at position [${newObject.position.join(', ')}]`

  setLastAction(message)

  // Auto-select the new terrain
  clearSelection()
  selectObject(newName)
}

// Handle basic object creation (cube, sphere, etc.)
const handleCreateBasicObject = (parts) => {
  const { addObject } = useSceneStore.getState()
  const { setLastAction, clearSelection, selectObject } = useSelectionStore.getState()

  const objectType = parts[1]
  let color = '#4a90e2'
  let position = null

  // Parse color and position
  let i = 2
  while (i < parts.length) {
    if (parts[i] === 'at' && i + 3 < parts.length) {
      const x = parseFloat(parts[i + 1])
      const y = parseFloat(parts[i + 2])
      const z = parseFloat(parts[i + 3])
      if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        position = [x, y, z]
      }
      break
    } else if (
      parts[i].startsWith('#') ||
      ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'].includes(parts[i])
    ) {
      color = parts[i]
    }
    i++
  }

  const newObject = addObject(objectType, color, position)
  setLastAction(`Created ${newObject.name} at position [${newObject.position.join(', ')}]`)

  // Auto-select the new object
  clearSelection()
  selectObject(newObject.name)
}

// Handle model creation
const handleCreateModelCommand = async (parts) => {
  if (parts.length < 3) {
    useSelectionStore.getState().setLastAction('Create model command requires a model type')
    return
  }

  const searchTerm = parts[2]
  let position = [0, 0, 0]

  // Parse position if provided
  const atIndex = parts.indexOf('at')
  if (atIndex !== -1 && atIndex + 3 < parts.length) {
    const x = parseFloat(parts[atIndex + 1])
    const y = parseFloat(parts[atIndex + 2])
    const z = parseFloat(parts[atIndex + 3])
    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
      position = [x, y, z]
    }
  }

  try {
    const { setLastAction } = useSelectionStore.getState()
    const {
      setShowModelSearch,
      setModelSearchResults,
      setPendingModelPosition,
      setIsModelSearchLoading
    } = useModelSearchStore.getState()

    // Start model search loading
    setIsModelSearchLoading(true)
    setLastAction(`Searching for ${searchTerm} models...`)

    // Search for models
    const searchResults = await modelSearch.searchModels(searchTerm)

    if (!searchResults || !searchResults.models || searchResults.models.length === 0) {
      setLastAction(`No models found for: ${searchTerm}`)
      setIsModelSearchLoading(false)
      return
    }

    // Show search results for user to choose from
    setModelSearchResults(searchResults)
    setPendingModelPosition(position)
    setShowModelSearch(true)
    setIsModelSearchLoading(false)

    setLastAction(
      `Found ${searchResults.models.length} models for "${searchTerm}". Select one to place at position [${position.join(', ')}].`
    )
  } catch (error) {
    console.error('Model search error:', error)
    useSelectionStore.getState().setLastAction(`Failed to search for models: ${error.message}`)
    useModelSearchStore.getState().setIsModelSearchLoading(false)
  }
}

// Create model object (called when user selects a model from search results)
export const createModelObject = (modelData, position) => {
  const { addObject, objectCounter } = useSceneStore.getState()
  const { clearSelection, selectObject, setLastAction } = useSelectionStore.getState()

  console.log('Creating model object with data:', modelData)
  const newId = crypto.randomUUID()
  const newName = `${modelData.name.replace(/\s+/g, '_').toLowerCase()}${objectCounter}`

  const newObject = {
    id: newId,
    name: newName,
    position: position || generateRandomPosition(),
    geometry: 'model', // Special geometry type for 3D models
    modelData: {
      url: modelData.url || modelData.fileUrl,
      thumbnail: modelData.thumbnail,
      originalName: modelData.name,
      description: modelData.description,
      source: modelData.source
    },
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    type: 'model' // Mark as 3D model for special handling
  }

  // Use the scene store's addObject method but pass the complete object
  const { objects, setObjects, setObjectCounter } = useSceneStore.getState()
  setObjects([...objects, newObject])
  setObjectCounter(objectCounter + 1)

  setLastAction(`Created 3D model: ${newName} at position [${position.join(', ')}]`)

  // Auto-select the new model
  clearSelection()
  selectObject(newName)

  return newObject
}

// Handle clone/duplicate commands
const handleCloneCommand = (parts) => {
  const { objects, addObject, objectCounter, setObjects, setObjectCounter } =
    useSceneStore.getState()
  const { selectedObjects, clearSelection, selectObject, setLastAction } =
    useSelectionStore.getState()

  if (selectedObjects.size === 0) {
    setLastAction('No objects selected to clone')
    return
  }

  // Parse position if provided
  let position = null
  const atIndex = parts.findIndex((p) => p.toLowerCase() === 'at')
  if (atIndex !== -1 && atIndex + 3 < parts.length) {
    const x = parseFloat(parts[atIndex + 1])
    const y = parseFloat(parts[atIndex + 2])
    const z = parseFloat(parts[atIndex + 3])
    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
      position = [x, y, z]
    }
  }

  // If no position specified, offset by 2 units on X axis
  if (!position) {
    position = [2, 0, 0]
  }

  const clonedObjects = []
  const newObjects = [...objects]
  let counter = objectCounter

  selectedObjects.forEach((selectedName) => {
    const originalObject = objects.find((obj) => obj.name === selectedName)
    if (!originalObject) return

    // Create a deep copy of the object
    const clonedObject = {
      ...originalObject,
      id: crypto.randomUUID(),
      name: `${originalObject.geometry}${counter}`,
      position: position || [
        originalObject.position[0] + 2,
        originalObject.position[1],
        originalObject.position[2]
      ],
      // Deep copy arrays
      scale: [...originalObject.scale],
      rotation: [...originalObject.rotation]
    }

    // If it's a model, deep copy modelData
    if (originalObject.modelData) {
      clonedObject.modelData = { ...originalObject.modelData }
    }

    newObjects.push(clonedObject)
    clonedObjects.push(clonedObject.name)
    counter++
  })

  setObjects(newObjects)
  setObjectCounter(counter)

  // Select the cloned objects
  clearSelection()
  clonedObjects.forEach((name) => selectObject(name))

  setLastAction(`Cloned ${clonedObjects.length} object(s): ${clonedObjects.join(', ')}`)
}

// Handle select commands
const handleSelectCommand = (parts) => {
  const { objects } = useSceneStore.getState()
  const { setSelectedObjects, setLastAction } = useSelectionStore.getState()

  if (parts.length < 2) {
    setLastAction('Select command requires a target')
    return
  }

  const target = parts[1].toLowerCase()
  const objectNames = objects.map((obj) => obj.name)

  if (target === 'all') {
    setSelectedObjects(new Set(objectNames))
    setLastAction(`Selected all ${objectNames.length} objects`)
  } else if (target === 'none') {
    setSelectedObjects(new Set())
    setLastAction('Deselected all objects')
  } else if (target === 'cubes') {
    const cubes = objects.filter((obj) => obj.geometry === 'cube').map((obj) => obj.name)
    setSelectedObjects(new Set(cubes))
    setLastAction(`Selected ${cubes.length} cubes`)
  } else if (target === 'spheres') {
    const spheres = objects.filter((obj) => obj.geometry === 'sphere').map((obj) => obj.name)
    setSelectedObjects(new Set(spheres))
    setLastAction(`Selected ${spheres.length} spheres`)
  } else if (target === 'cylinders') {
    const cylinders = objects.filter((obj) => obj.geometry === 'cylinder').map((obj) => obj.name)
    setSelectedObjects(new Set(cylinders))
    setLastAction(`Selected ${cylinders.length} cylinders`)
  } else if (objectNames.includes(target)) {
    setSelectedObjects(new Set([target]))
    setLastAction(`Selected ${target}`)
  } else {
    setLastAction(`Object not found: ${target}`)
  }
}

// Handle delete commands
const handleDeleteCommand = (parts) => {
  const { objects, removeObject } = useSceneStore.getState()
  const { selectedObjects, setSelectedObjects, setLastAction } = useSelectionStore.getState()

  if (parts.length < 2) {
    setLastAction('Delete command requires a target')
    return
  }

  const target = parts[1]

  if (target === 'selected') {
    if (selectedObjects.size === 0) {
      setLastAction('No objects selected to delete')
      return
    }

    const deletedObjects = []
    selectedObjects.forEach((name) => {
      if (removeObject(name)) {
        deletedObjects.push(name)
      }
    })

    setSelectedObjects(new Set())
    setLastAction(`Deleted ${deletedObjects.length} objects: ${deletedObjects.join(', ')}`)
  } else {
    const objectExists = objects.some((obj) => obj.name === target)
    if (!objectExists) {
      setLastAction(`Object not found: ${target}`)
      return
    }

    if (removeObject(target)) {
      // Remove from selection if it was selected
      const newSelection = new Set(selectedObjects)
      newSelection.delete(target)
      setSelectedObjects(newSelection)
      setLastAction(`Deleted ${target}`)
    }
  }
}

// Handle scale commands
const handleScaleCommand = (parts) => {
  const { objects, updateObject } = useSceneStore.getState()
  const { selectedObjects, setLastAction } = useSelectionStore.getState()

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

      objects.forEach((obj) => {
        if (selectedObjects.has(obj.name)) {
          updateObject(obj.name, {
            scale: [obj.scale[0] * scaleX, obj.scale[1] * scaleY, obj.scale[2] * scaleZ]
          })
        }
      })

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

      updateObject(targetObject.name, {
        scale: [
          targetObject.scale[0] * scaleX,
          targetObject.scale[1] * scaleY,
          targetObject.scale[2] * scaleZ
        ]
      })

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
const handleRotateCommand = (parts) => {
  const { objects, updateObject } = useSceneStore.getState()
  const { selectedObjects, setLastAction } = useSelectionStore.getState()

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

      objects.forEach((obj) => {
        if (selectedObjects.has(obj.name)) {
          updateObject(obj.name, {
            rotation: [obj.rotation[0] + rotX, obj.rotation[1] + rotY, obj.rotation[2] + rotZ]
          })
        }
      })

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

      updateObject(targetObject.name, {
        rotation: [
          targetObject.rotation[0] + rotX,
          targetObject.rotation[1] + rotY,
          targetObject.rotation[2] + rotZ
        ]
      })

      const rotationDesc =
        rotationValues.length === 1
          ? `${rotationValues[0]}° (Y-axis)`
          : `${rotationValues[0]}°, ${rotationValues[1]}°, ${rotationValues[2]}° (X, Y, Z)`
      setLastAction(`Rotated ${target} by ${rotationDesc}`)
    }
  } else {
    setLastAction(
      'Rotation command requires target and rotation values (e.g., "rotate selected 45" or "rotate cube1 90")'
    )
  }
}

// Handle move commands
const handleMoveCommand = (parts) => {
  const { objects, updateObject } = useSceneStore.getState()
  const { selectedObjects, setLastAction } = useSelectionStore.getState()

  if (parts.length >= 5) {
    const target = parts[1]
    const moveType = parts[2] // 'to' or 'by'
    const moveValues = parts
      .slice(3)
      .map(parseFloat)
      .filter((n) => !isNaN(n))

    if (moveValues.length !== 3) {
      setLastAction('Move command requires 3 coordinate values (x y z)')
      return
    }

    const [moveX, moveY, moveZ] = moveValues
    const isAbsolute = moveType === 'to'

    if (target === 'selected') {
      if (selectedObjects.size === 0) {
        setLastAction('No objects selected to move')
        return
      }

      objects.forEach((obj) => {
        if (selectedObjects.has(obj.name)) {
          const newPosition = isAbsolute
            ? [moveX, moveY, moveZ]
            : [obj.position[0] + moveX, obj.position[1] + moveY, obj.position[2] + moveZ]

          updateObject(obj.name, { position: newPosition })
        }
      })

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

      const newPosition = isAbsolute
        ? [moveX, moveY, moveZ]
        : [
            targetObject.position[0] + moveX,
            targetObject.position[1] + moveY,
            targetObject.position[2] + moveZ
          ]

      updateObject(targetObject.name, { position: newPosition })

      const moveDesc = isAbsolute
        ? `to position (${moveX}, ${moveY}, ${moveZ})`
        : `by offset (${moveX}, ${moveY}, ${moveZ})`
      setLastAction(`Moved ${target} ${moveDesc}`)
    }
  } else {
    setLastAction(
      'Move command requires target, type, and coordinates (e.g., "move selected to 1 2 3" or "move cube1 by 0 1 0")'
    )
  }
}

// Handle change texture command
const handleChangeCommand = (parts) => {
  const { objects, updateObject } = useSceneStore.getState()
  const { selectedObjects, setLastAction } = useSelectionStore.getState()

  // Command format: change texture <type> <index|next|prev>
  // Example: change texture grass 2, change texture heightmap 3, change texture rock next
  if (parts.length < 3) {
    setLastAction('Change command requires type (e.g., "change texture grass 2")')
    return
  }

  // Check if this is a texture change command
  if (parts[1] !== 'texture') {
    setLastAction('Only texture changes are supported (e.g., "change texture grass 2")')
    return
  }

  if (parts.length < 4) {
    setLastAction('Texture change requires type and value (e.g., "change texture grass 2")')
    return
  }

  const textureType = parts[2].toLowerCase() // grass, mud, rock, heightmap
  const value = parts[3].toLowerCase() // index number, "next", or "prev"

  // Validate texture type
  if (!['grass', 'mud', 'rock', 'heightmap'].includes(textureType)) {
    setLastAction(`Invalid texture type: ${textureType}. Use grass, mud, rock, or heightmap`)
    return
  }

  // Check if any terrain objects are selected
  const selectedTerrains = objects.filter(
    (obj) => selectedObjects.has(obj.name) && obj.geometry === 'terrain'
  )

  if (selectedTerrains.length === 0) {
    setLastAction('No terrain objects selected. Select a terrain first.')
    return
  }

  // Import texture helper functions
  const {
    getTextureCount,
    getTextureByIndex,
    getTextureIndexByKey
  } = require('../components/3d/Terrain.jsx')

  // Process each selected terrain
  selectedTerrains.forEach((terrain) => {
    let newIndex

    if (textureType === 'heightmap') {
      // Handle heightmap changes (1-5)
      const currentIndex = terrain.heightmapIndex || 1

      if (value === 'next') {
        newIndex = currentIndex < 5 ? currentIndex + 1 : 1
      } else if (value === 'prev' || value === 'previous') {
        newIndex = currentIndex > 1 ? currentIndex - 1 : 5
      } else {
        newIndex = parseInt(value)
        if (isNaN(newIndex) || newIndex < 1 || newIndex > 5) {
          setLastAction('Heightmap index must be between 1 and 5')
          return
        }
      }

      updateObject(terrain.name, { heightmapIndex: newIndex })
      console.log(`[CommandHandler] Changed ${terrain.name} heightmap to ${newIndex}`)
    } else {
      // Handle grass, mud, rock texture changes
      const textureCount = getTextureCount(textureType)

      if (textureCount === 0) {
        setLastAction(`No ${textureType} textures available`)
        return
      }

      // Get current texture key
      const currentTextureKey = terrain[`${textureType}Texture`]
      const currentIndex = currentTextureKey
        ? getTextureIndexByKey(textureType, currentTextureKey)
        : 1

      if (value === 'next') {
        newIndex = currentIndex < textureCount ? currentIndex + 1 : 1
      } else if (value === 'prev' || value === 'previous') {
        newIndex = currentIndex > 1 ? currentIndex - 1 : textureCount
      } else {
        newIndex = parseInt(value)
        if (isNaN(newIndex) || newIndex < 1 || newIndex > textureCount) {
          setLastAction(`${textureType} texture index must be between 1 and ${textureCount}`)
          return
        }
      }

      // Get texture key by index
      const newTextureKey = getTextureByIndex(textureType, newIndex)

      if (!newTextureKey) {
        setLastAction(`Failed to get ${textureType} texture at index ${newIndex}`)
        return
      }

      // Update the terrain object
      const updateKey = `${textureType}Texture`
      updateObject(terrain.name, { [updateKey]: newTextureKey })
      console.log(
        `[CommandHandler] Changed ${terrain.name} ${textureType} texture to ${newTextureKey} (index ${newIndex})`
      )
    }
  })

  // Set success message
  const terrainNames = selectedTerrains.map((t) => t.name).join(', ')
  setLastAction(`Changed ${textureType} texture on ${terrainNames}`)
}

// Handle clear command
const handleClearCommand = () => {
  const { clearSelection } = useSelectionStore.getState()
  clearSelection()
}

// Handle reset command
const handleResetCommand = () => {
  const { resetScene } = useSceneStore.getState()
  const { clearSelection, setLastAction } = useSelectionStore.getState()
  const { clearModelSearch } = useModelSearchStore.getState()

  resetScene()
  clearSelection()
  clearModelSearch()
  setLastAction('Scene reset to initial state')
}

export default handleCommand