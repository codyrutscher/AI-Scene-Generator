import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getInitialObjects } from '../utils/objectUtils'

// Helper function to generate random position
const generateRandomPosition = () => [
  (Math.random() - 0.5) * 8,
  Math.random() * 2,
  (Math.random() - 0.5) * 8
]

export const useSceneStore = create()(
  devtools(
    (set, get) => ({
      // State
      objects: getInitialObjects(),
      objectCounter: 1,
      
      // Actions
      setObjects: (objects) => set({ objects }),
      
      setObjectCounter: (counter) => set({ objectCounter: counter }),
      
      addObject: (geometry, color, position) => {
        const { objectCounter } = get()
        const newId = crypto.randomUUID()
        const newName = `${geometry}${objectCounter}`
        const newObject = {
          id: newId,
          name: newName,
          position: position || generateRandomPosition(),
          geometry,
          color: color || '#4a90e2',
          scale: [1, 1, 1],
          rotation: [0, 0, 0]
        }
        
        set((state) => ({
          objects: [...state.objects, newObject],
          objectCounter: state.objectCounter + 1
        }))
        
        return newObject
      },
      
      removeObject: (name) => {
        const { objects } = get()
        const objectExists = objects.some(obj => obj.name === name)
        
        if (!objectExists) {
          return false
        }
        
        set((state) => ({
          objects: state.objects.filter(obj => obj.name !== name)
        }))
        
        return true
      },
      
      updateObject: (name, updates) => {
        console.log(`[SceneStore] updateObject called for ${name} with:`, updates);
        
        const { objects } = get()
        const objectExists = objects.some(obj => obj.name === name)
        
        if (!objectExists) {
          console.log(`[SceneStore] Object ${name} not found`);
          return false
        }
        
        set((state) => ({
          objects: state.objects.map(obj => {
            if (obj.name === name) {
              const updatedObj = { ...obj, ...updates };
              console.log(`[SceneStore] Updated object ${name}:`, updatedObj);
              return updatedObj;
            }
            return obj;
          })
        }))
        
        return true
      },
      
      resetScene: () => {
        set({
          objects: getInitialObjects(),
          objectCounter: 1
        })
      },
      
      // Computed values
      getObjectByName: (name) => {
        const { objects } = get()
        return objects.find(obj => obj.name === name)
      },
      
      getObjectsByType: (geometry) => {
        const { objects } = get()
        return objects.filter(obj => obj.geometry === geometry)
      },
      
      getTotalObjectCount: () => {
        const { objects } = get()
        return objects.length
      },
      
      getObjectCountByType: (geometry) => {
        const { objects } = get()
        return objects.filter(obj => obj.geometry === geometry).length
      }
    }),
    { name: 'scene-store' }
  )
)

export default useSceneStore