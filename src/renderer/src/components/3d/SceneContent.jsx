/* eslint-disable react/prop-types */
import { useEffect, Suspense } from 'react'
import { useThree } from '@react-three/fiber'
import SelectableObject from './SelectableObject'

// Scene content component
export default function SceneContent({ objects, selectedObjects, onObjectSelect, onEmptyClick }) {
  const { gl } = useThree()

  // Handle clicks on empty space
  const handleCanvasClick = (event) => {
    // Only deselect if clicking on the canvas background
    if (event.target === gl.domElement) {
      onEmptyClick()
    }
  }

  useEffect(() => {
    gl.domElement.addEventListener('click', handleCanvasClick)
    return () => {
      gl.domElement.removeEventListener('click', handleCanvasClick)
    }
  }, [gl.domElement])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Objects */}
      {objects.map((obj) => (
        <Suspense
          key={obj.id}
          fallback={
            <mesh position={obj.position}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial color="#888888" transparent opacity={0.5} />
            </mesh>
          }
        >
          <SelectableObject
            name={obj.name}
            position={obj.position}
            geometry={obj.geometry}
            color={obj.color}
            scale={obj.scale}
            rotation={obj.rotation}
            isSelected={selectedObjects.has(obj.name)}
            onSelect={onObjectSelect}
            modelData={obj.modelData}
          />
        </Suspense>
      ))}

      {/* Grid helper */}
      <gridHelper args={[100, 100]} position={[0, -1, 0]} />
    </>
  )
}