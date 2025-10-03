import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useModelSearchStore = create()(
  devtools(
    (set, get) => ({
      // State
      showModelSearch: false,
      modelSearchResults: null,
      modelSearchQuery: '',
      pendingModelPosition: [0, 0, 0],
      isModelSearchLoading: false,
      
      // Actions
      setShowModelSearch: (show) => set({ showModelSearch: show }),
      
      setModelSearchResults: (results) => set({ modelSearchResults: results }),
      
      setModelSearchQuery: (query) => set({ modelSearchQuery: query }),
      
      setPendingModelPosition: (position) => set({ pendingModelPosition: position }),
      
      setIsModelSearchLoading: (loading) => set({ isModelSearchLoading: loading }),
      
      // Clear all model search state
      clearModelSearch: () => set({
        showModelSearch: false,
        modelSearchResults: null,
        modelSearchQuery: '',
        pendingModelPosition: [0, 0, 0],
        isModelSearchLoading: false
      }),
      
      // Start model search
      startModelSearch: (query, position) => set({
        showModelSearch: true,
        modelSearchQuery: query,
        pendingModelPosition: position,
        isModelSearchLoading: true,
        modelSearchResults: null
      }),
      
      // Complete model search
      completeModelSearch: (results) => set({
        modelSearchResults: results,
        isModelSearchLoading: false
      })
    }),
    { name: 'model-search-store' }
  )
)

export default useModelSearchStore