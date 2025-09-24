/* eslint-disable react/prop-types */
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// Import modular components
import SceneContent from './3d/SceneContent'
import CommandInput from './3d/CommandInput'
import SelectionInfo from './3d/SelectionInfo'

// Import custom hook
import { useSceneObjects } from '../hooks/useSceneObjects'

// Main component
export default function Scene3D() {
  // Use the custom hook for all scene object management
  const {
    objects,
    selectedObjects,
    lastAction,
    handleObjectSelect,
    handleEmptyClick,
    handleTextCommand
  } = useSceneObjects()

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 75 }}
        style={{ background: '#1a1a1a' }}
        onPointerMissed={handleEmptyClick}
      >
        <SceneContent
          objects={objects}
          selectedObjects={selectedObjects}
          onObjectSelect={handleObjectSelect}
        />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>

      {/* UI Overlay */}
      <div>
        <SelectionInfo
          selectedObjects={selectedObjects}
          selectedCount={selectedObjects.size}
          totalCount={objects.length}
          lastAction={lastAction}
        />
      </div>

      <div style={{ position: 'absolute',maxWidth:800, bottom: '20px', left: 0, right: 0,margin:"auto", zIndex: 100 }}>
        <CommandInput onCommand={handleTextCommand} />
      </div>
    </div>
  )
}
