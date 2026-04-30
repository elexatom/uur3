/*
Finalni revize - 100%
 */

import {create} from "zustand"
import {persist} from "zustand/middleware"
import type {AppState} from '../types/slicesTypes.ts'
import {
  createAuthSlice,
  createEditorSlice,
  createMapSlice,
  createNetworkSlice,
  createSettingsSlice,
  normalizeSettings
} from "./appSlices.ts"

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createMapSlice(...a),
      ...createNetworkSlice(...a),
      ...createEditorSlice(...a),
      ...createSettingsSlice(...a),
    }),
    {
      name: "pilsen-pulse-store",
      partialize: (state) => ({
        layers: state.layers,
        settings: state.settings,
        isAuthenticated: state.isAuthenticated,
        mapMode: state.mapMode
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as Partial<AppState>) ?? {}
        return {
          ...currentState,
          ...persisted,
          settings: persisted.settings
            ? normalizeSettings({...currentState.settings, ...persisted.settings})
            : currentState.settings,
        }
      }
    }
  )
)