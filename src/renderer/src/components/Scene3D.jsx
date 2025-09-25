/* eslint-disable react/prop-types */
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// Import modular components
import SceneContent from './3d/SceneContent'
import CommandInput from './3d/CommandInput'
import SelectionInfo from './3d/SelectionInfo'
import ModelSearchResults from './ModelSearchResults'

// Import custom hook and utilities
import { useSceneObjects } from '../hooks/useSceneObjects'
import { createModelObject } from '../utils/commandHandler'

// Main component
export default function Scene3D() {
  // Use the custom hook for all scene object management
  const {
    objects,
    selectedObjects,
    lastAction,
    handleObjectSelect,
    handleEmptyClick,
    handleTextCommand,
    showModelSearch,
    modelSearchResults,
    modelSearchQuery,
    pendingModelPosition,
    isModelSearchLoading,
    setObjects,
    setObjectCounter,
    setLastAction,
    setSelectedObjects,
    setShowModelSearch,
    objectCounter
  } = useSceneObjects()

  // Handle model selection from search results
  const handleModelSelect = (modelData) => {
    // Map fileUrl to url for compatibility with createModelObject
    const mappedModelData = {
      ...modelData,
      url: modelData.fileUrl || modelData.url // Use fileUrl from API, fallback to url
    }
    
    console.log('Model selected:', mappedModelData)
    console.log('Original model data:', modelData)
    
    createModelObject(
      mappedModelData,
      pendingModelPosition,
      setObjects,
      setObjectCounter,
      setLastAction,
      setSelectedObjects,
      objectCounter
    )
    setShowModelSearch(false)
  }

  // Handle model search close
  const handleModelSearchClose = () => {
    setShowModelSearch(false)
  }

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
          onEmptyClick={handleEmptyClick}
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

      {/* Model Search Results Modal */}
      <ModelSearchResults
        searchResults={modelSearchResults}
        searchQuery={modelSearchQuery}
        isVisible={showModelSearch}
        isLoading={isModelSearchLoading}
        onModelSelect={handleModelSelect}
        onClose={handleModelSearchClose}
      />
    </div>
  )
}
