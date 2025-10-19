/* eslint-disable react/prop-types */
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState, useRef } from 'react'
import { Box, Fab } from '@mui/material'
import { Download, Upload } from '@mui/icons-material'

// Import modular components
import SceneContent from './3d/SceneContent'
import CommandInput from './3d/CommandInput'
import SelectionInfo from './3d/SelectionInfo'
import ModelSearchResults from './ModelSearchResults'
import LevaControls from './ui/LevaControls'
import ExportDialog from './dialogs/ExportDialog'
import ImportDialog from './dialogs/ImportDialog'

// Import Zustand stores and utilities
import { useSceneStore } from '../stores/sceneStore'
import { useSelectionStore } from '../stores/selectionStore'
import { useModelSearchStore } from '../stores/modelSearchStore'
import { createModelObject, handleCommand } from '../utils/commandHandlerZustand' 
// Main component
export default function Scene3D() {
  // Use Zustand stores for state management
  const { objects, setObjects } = useSceneStore()
  const { selectedObjects, lastAction, selectObject, clearSelection } = useSelectionStore()
  const { 
    showModelSearch, 
    modelSearchResults, 
    modelSearchQuery, 
    pendingModelPosition, 
    isModelSearchLoading,
    setShowModelSearch
  } = useModelSearchStore()

  // Local state for dialogs and scene reference
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const sceneRef = useRef(null)

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

  // Handle scene reference from SceneContent
  const handleSceneRef = (scene) => {
    sceneRef.current = scene
  }

  // Handle import
  const handleImport = (sceneData) => {
    try {
      // Clear current selection
      clearSelection()
      
      // Update scene with imported data
      setObjects(sceneData.objects || [])
      
      console.log('Scene imported successfully:', sceneData)
    } catch (error) {
      console.error('Failed to import scene:', error)
    }
  }

  // Prepare scene data for export
  const getSceneData = () => {
    return {
      objects,
      metadata: {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        appVersion: '1.0.0',
        objectCount: objects.length
      }
    }
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
          onSceneRef={handleSceneRef}
        />
        {/* <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} /> */}
     
      </Canvas>

      {/* Export/Import Buttons */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          gap: 1,
          zIndex: 50
        }}
      >
        <Fab
          color="primary"
          onClick={() => setShowExportDialog(true)}
          title="Export Scene"
          size="medium"
          sx={{ 
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' }
          }}
        >
          <Download />
        </Fab>
        <Fab
          color="secondary"
          onClick={() => setShowImportDialog(true)}
          title="Import Scene"
          size="medium"
          sx={{ 
            backgroundColor: '#388e3c',
            '&:hover': { backgroundColor: '#2e7d32' }
          }}
        >
          <Upload />
        </Fab>
      </Box>

      {/* UI Overlay */}
      <div>
        <SelectionInfo
          selectedObjects={selectedObjects}
          selectedCount={selectedObjects.size}
          totalCount={objects.length}
          lastAction={lastAction}
        />
      </div>

      <div style={{ position: 'absolute',maxWidth:800, bottom: '20px', left: 0, right: 0,margin:"auto", zIndex: 100, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <CommandInput onCommand={handleTextCommand} />
        </div>
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

      {/* Leva Controls for Transform Manipulation */}
      <LevaControls />

      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        scene={sceneRef.current}
        sceneData={getSceneData()}
      />

      {/* Import Dialog */}
      <ImportDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={handleImport}
      />
    </div>
  )
}
