/* eslint-disable react/prop-types */
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// Import modular components
import SceneContent from './3d/SceneContent'
import CommandInput from './3d/CommandInput'
import SelectionInfo from './3d/SelectionInfo'
import ModelSearchResults from './ModelSearchResults'

// Import Zustand stores and utilities
import { useSceneStore } from '../stores/sceneStore'
import { useSelectionStore } from '../stores/selectionStore'
import { useModelSearchStore } from '../stores/modelSearchStore'
import { createModelObject, handleCommand } from '../utils/commandHandlerZustand'

// Main component
export default function Scene3D() {
  // Use Zustand stores for state management
  const { objects } = useSceneStore()
  const { selectedObjects, lastAction, selectObject, clearSelection } = useSelectionStore()
  const { 
    showModelSearch, 
    modelSearchResults, 
    modelSearchQuery, 
    pendingModelPosition, 
    isModelSearchLoading,
    setShowModelSearch
  } = useModelSearchStore()

  // Handle object selection
  const handleObjectSelect = (objectName) => {
    selectObject(objectName)
  }

  // Handle empty space click
  const handleEmptyClick = () => {
    clearSelection()
  }

  // Handle text commands
  const handleTextCommand = async (command) => {
    await handleCommand(command)
  }

  // Handle model selection from search results
  const handleModelSelect = (modelData) => {
    const { pendingModelPosition, setShowModelSearch } = useModelSearchStore.getState()
    
    // Map fileUrl to url for compatibility with createModelObject
    const mappedModelData = {
      ...modelData,
      url: modelData.fileUrl || modelData.url // Use fileUrl from API, fallback to url
    }
    
    console.log('Model selected:', mappedModelData)
    console.log('Pending position:', pendingModelPosition)
    
    createModelObject(mappedModelData, pendingModelPosition)
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
        {/* <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} /> */}
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
