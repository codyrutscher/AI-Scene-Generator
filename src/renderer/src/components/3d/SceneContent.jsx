/* eslint-disable react/prop-types */
import { useEffect, Suspense } from 'react'
import { useThree } from '@react-three/fiber' 
import SelectableObject from './SelectableObject'
import GridArea from './GridArea'
import { Sky } from '@react-three/drei'

// Scene content component
export default function SceneContent({ objects, selectedObjects, onObjectSelect, onEmptyClick, onSceneRef }) {
  const { gl, scene } = useThree()

  // Pass scene reference to parent component for export functionality
  useEffect(() => {
    if (onSceneRef && scene) {
      onSceneRef(scene)
    }
  }, [scene, onSceneRef])

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

 

      {/* Objects */}
      {objects.map((obj) => {
        return (
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
              isSelected={selectedObjects.has ? selectedObjects.has(obj.name) : selectedObjects.includes(obj.name)}
              onSelect={onObjectSelect}
              modelData={obj} // Pass the entire object as modelData so variant is accessible
              terrainProps={obj.terrainProps}
            />
          </Suspense>
        )
      })}
      <GridArea />
{/* <Sky sunPosition={[10, 10, 5]} /> */}
 
    </>
  )
}