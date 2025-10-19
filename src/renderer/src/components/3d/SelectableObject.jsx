/* eslint-disable react/prop-types */
import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import Terrain from './Terrain'

// Simple object component with selection handling
export default function SelectableObject({
  position,
  geometry,
  name,
  color = '#4a90e2',
  selectedColor = '#ff6b6b',
  isSelected,
  onSelect,
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
  modelData, // For 3D models
  terrainProps // For terrain-specific properties
}) {
  const meshRef = useRef(null)

  // Handle click
  const handleClick = (event) => {
    event.stopPropagation()
    onSelect(name)
  }

  // Load 3D model using Drei's useGLTF hook for better performance and caching
  const modelUrl = geometry === 'model' ? modelData?.modelData?.url || modelData?.url : null
  const gltf = modelUrl ? useGLTF(modelUrl) : null

  // Create centered model with simple wireframe selection
  const createCenteredModel = () => {
    if (!gltf || !gltf.scene) return { scene: null, outlineScene: null }

    const clonedScene = gltf.scene.clone()

    // Calculate bounding box and center the model
    const box = new THREE.Box3().setFromObject(clonedScene)
    const center = box.getCenter(new THREE.Vector3())
    clonedScene.position.sub(center)

    // Create simple wireframe outline for selection
    let outlineScene = null
    if (isSelected) {
      outlineScene = clonedScene.clone()
      outlineScene.traverse((child) => {
        if (child.isMesh && child.geometry) {
          child.material = new THREE.MeshBasicMaterial({
            color: selectedColor,
            wireframe: true,
            transparent: true,
            opacity: 0.6
          })
        }
      })
    }

    return { scene: clonedScene, outlineScene }
  }

  // Create geometry based on type
  const createGeometry = () => {
    if (geometry === 'box') {
      return <boxGeometry args={[1, 1, 1]} />
    } else if (geometry === 'sphere') {
      return <sphereGeometry args={[0.5, 32, 32]} />
    } else if (geometry === 'cylinder') {
      return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
    } else if (geometry === 'model') {
      // For models, we don't return geometry here as we use primitive
      return null
    }
    return <boxGeometry args={[1, 1, 1]} />
  }

  // Render terrain
  if (geometry === 'terrain') {
    // Debug: Log all terrain-related props
 

    // For terrain objects, pass variant and texture customization props
    return (
      <Terrain
        ref={meshRef}
        name={name}
        position={position}
        scale={scale}
        rotation={rotation}
        isSelected={isSelected}
        onSelect={onSelect}
        variant={terrainProps?.variant || modelData?.variant || 'heightmap1'}
        heightmapIndex={terrainProps?.heightmapIndex || modelData?.heightmapIndex || 1}
        grassTexture={terrainProps?.grassTexture || modelData?.grassTexture}
        mudTexture={terrainProps?.mudTexture || modelData?.mudTexture}
        rockTexture={terrainProps?.rockTexture || modelData?.rockTexture}
      />
    )
  }

  // Render 3D model
  if (geometry === 'model') {
    const centeredModel = createCenteredModel()

    if (!centeredModel.scene) {
      // Fallback to a box if model fails to load or is loading
      return (
        <mesh
          ref={meshRef}
          position={position}
          scale={scale}
          rotation={rotation}
          onClick={handleClick}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff0000" transparent opacity={0.5} />
        </mesh>
      )
    }

    return (
      <group
        ref={meshRef}
        position={position}
        scale={scale}
        rotation={rotation}
        onClick={handleClick}
      >
        <primitive object={centeredModel.scene} />
        {/* Simple wireframe selection outline */}
        {isSelected && centeredModel.outlineScene && (
          <group scale={[1.01, 1.01, 1.01]}>
            <primitive object={centeredModel.outlineScene} />
          </group>
        )}
      </group>
    )
  }

  return (
    <group
      ref={meshRef}
      position={position}
      scale={scale}
      rotation={rotation}
      onClick={handleClick}
    >
      {/* Main object */}
      <mesh>
        {createGeometry()}
        <meshStandardMaterial color={isSelected ? selectedColor : color} />
      </mesh>

      {/* Simple wireframe selection outline */}
      {isSelected && (
        <mesh scale={[1.02, 1.02, 1.02]}>
          {createGeometry()}
          <meshBasicMaterial color={selectedColor} wireframe transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}
