/* eslint-disable react/prop-types */
import { useRef, useState } from 'react'

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
  rotation = [0, 0, 0]
}) {
  const meshRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  // Handle click
  const handleClick = (event) => {
    event.stopPropagation()
    onSelect(name)
  }

  // Create geometry based on type
  const createGeometry = () => {
    if (geometry === 'box') {
      return <boxGeometry args={[1, 1, 1]} />
    } else if (geometry === 'sphere') {
      return <sphereGeometry args={[0.5, 32, 32]} />
    } else if (geometry === 'cylinder') {
      return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
    }
    return <boxGeometry args={[1, 1, 1]} />
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {createGeometry()}
      <meshStandardMaterial
        color={isSelected ? selectedColor : hovered ? '#7bb3f0' : color}
        transparent={hovered && !isSelected}
        opacity={hovered && !isSelected ? 0.8 : 1}
      />
      {/* Selection outline */}
      {isSelected && (
        <mesh>
          {createGeometry()}
          <meshBasicMaterial color={selectedColor} wireframe transparent opacity={0.5} />
        </mesh>
      )}
    </mesh>
  )
}