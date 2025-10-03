import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useSelectionStore = create()(
  devtools(
    (set, get) => ({
      // State
      selectedObjects: new Set(),
      lastAction: '',
      
      // Actions
      setSelectedObjects: (selectedObjects) => set({ selectedObjects }),
      
      setLastAction: (action) => set({ lastAction: action }),
      
      selectObject: (name) => {
        const { selectedObjects } = get()
        const newSelection = new Set(selectedObjects)
        
        if (newSelection.has(name)) {
          newSelection.delete(name)
          set({ 
            selectedObjects: newSelection,
            lastAction: `Deselected ${name}`
          })
        } else {
          newSelection.add(name)
          set({ 
            selectedObjects: newSelection,
            lastAction: `Selected ${name}`
          })
        }
      },
      
      clearSelection: () => {
        set({ 
          selectedObjects: new Set(),
          lastAction: 'Deselected all objects'
        })
      },
      
      selectAll: (objects) => {
        const allNames = objects.map(obj => obj.name)
        set({ 
          selectedObjects: new Set(allNames),
          lastAction: `Selected all ${allNames.length} objects`
        })
      },
      
      // Computed values
      getSelectedObjectNames: () => {
        const { selectedObjects } = get()
        return Array.from(selectedObjects)
      },
      
      getSelectedObjects: (objects) => {
        const { selectedObjects } = get()
        return objects.filter(obj => selectedObjects.has(obj.name))
      },
      
      isObjectSelected: (name) => {
        const { selectedObjects } = get()
        return selectedObjects.has(name)
      },
      
      getSelectedCount: () => {
        const { selectedObjects } = get()
        return selectedObjects.size
      }
    }),
    { name: 'selection-store' }
  )
)

export default useSelectionStore