// Object creation and manipulation utilities

// Generate random position for new objects
export const generateRandomPosition = () => {
  return [
    (Math.random() - 0.5) * 8, // x: -4 to 4
    Math.random() * 2, // y: 0 to 2
    (Math.random() - 0.5) * 8 // z: -4 to 4
  ]
}

// Create new object with given parameters
export const createNewObject = (geometry, color, position, objectCounter) => {
  const newId = crypto.randomUUID()
  const newName = `${geometry}${objectCounter}`
  
  return {
    id: newId,
    name: newName,
    position: position || generateRandomPosition(),
    geometry,
    color: color || getDefaultColor(geometry),
    scale: [1, 1, 1],
    rotation: [0, 0, 0]
  }
}

// Get default color for geometry type
export const getDefaultColor = (geometry) => {
  const colorMap = {
    box: '#4a90e2',
    sphere: '#e74c3c',
    cylinder: '#2ecc71'
  }
  return colorMap[geometry] || '#4a90e2'
}

// Color mapping for command parsing
export const colorKeywords = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan']
export const colorMap = {
  red: '#ff4444',
  blue: '#4444ff',
  green: '#44ff44',
  yellow: '#ffff44',
  purple: '#ff44ff',
  orange: '#ff8844',
  pink: '#ff88cc',
  cyan: '#44ffff'
}

// Parse color from command parts
export const parseColorFromCommand = (parts) => {
  for (let i = 1; i < parts.length; i++) {
    if (colorKeywords.includes(parts[i])) {
      return colorMap[parts[i]]
    }
  }
  return null
}

// Parse position from command parts (e.g., "at 2 0 0")
export const parsePositionFromCommand = (parts) => {
  const atIndex = parts.indexOf('at')
  if (atIndex !== -1 && parts.length >= atIndex + 4) {
    const x = parseFloat(parts[atIndex + 1])
    const y = parseFloat(parts[atIndex + 2])
    const z = parseFloat(parts[atIndex + 3])
    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
      return [x, y, z]
    }
  }
  return null
}

// Validate geometry type
export const isValidGeometry = (geometry) => {
  const validGeometries = ['box', 'cube', 'sphere', 'cylinder', 'terrain', 'model']
  return validGeometries.includes(geometry)
}

// Normalize geometry name (cube -> box)
export const normalizeGeometry = (geometry) => {
  if (geometry === 'cube') return 'box'
  return geometry
}

// Filter objects by geometry type
export const filterObjectsByGeometry = (objects, geometry) => {
  const normalizedGeometry = normalizeGeometry(geometry)
  return objects.filter((obj) => obj.geometry === normalizedGeometry)
}

// Get object names from objects array
export const getObjectNames = (objects) => {
  return objects.map((obj) => obj.name)
}

// Find object by name
export const findObjectByName = (objects, name) => {
  return objects.find((obj) => obj.name === name)
}

// Transform object position
export const transformObjectPosition = (currentPosition, moveValues, isAbsolute = false) => {
  const [moveX, moveY, moveZ] = moveValues
  
  if (isAbsolute) {
    return [moveX, moveY, moveZ]
  } else {
    return [
      currentPosition[0] + moveX,
      currentPosition[1] + moveY,
      currentPosition[2] + moveZ
    ]
  }
}

// Transform object scale
export const transformObjectScale = (currentScale, scaleValues) => {
  let scaleX, scaleY, scaleZ
  
  if (scaleValues.length === 1) {
    scaleX = scaleY = scaleZ = scaleValues[0]
  } else if (scaleValues.length === 3) {
    [scaleX, scaleY, scaleZ] = scaleValues
  } else {
    throw new Error('Scale requires 1 or 3 values')
  }
  
  return [
    currentScale[0] * scaleX,
    currentScale[1] * scaleY,
    currentScale[2] * scaleZ
  ]
}

// Transform object rotation (degrees to radians)
export const transformObjectRotation = (currentRotation, rotationValues) => {
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
    throw new Error('Rotation requires 1 or 3 values')
  }
  
  return [
    currentRotation[0] + rotX,
    currentRotation[1] + rotY,
    currentRotation[2] + rotZ
  ]
}

// Initial objects data - start with empty scene
// Get initial objects for the scene
export const getInitialObjects = () => {
  return []
}