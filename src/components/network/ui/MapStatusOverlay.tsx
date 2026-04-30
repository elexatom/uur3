/*
Finalni revize - 100%
 */

import {useAppStore} from "../../../store/appStore.ts"

export const MapStatusOverlay = () => {
  const {network} = useAppStore()

  if (!network.isLoading && !network.error) return null

  return (
    <div className="absolute inset-0 z-2000 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm">
      {network.isLoading ? (
        <span className="text-gray-500 text-sm animate-pulse font-medium">Načítám data sítě...</span>
      ) : (
        <div className="text-center bg-white p-6 rounded-2xl shadow-xl border border-red-100">
          <div className="text-red-500 font-bold mb-2">Chyba při načítání dat</div>
          <div className="text-gray-500 text-xs">{network.error}</div>
        </div>
      )}
    </div>
  )
}