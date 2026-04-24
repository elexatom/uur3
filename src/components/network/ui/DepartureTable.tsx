// revidovano OK TODO: live data zkontrolovat, centralizovat?
import { DEP_STATUS_CFG, DEP_T_HEAD } from "../../../types/design.tsx"
import { useEffect } from "react"
import { useAppStore } from "../../../store/appStore.ts"
import { useFleetStore } from "../../../store/fleetStore.ts"
import type { FleetUnit } from "../../../types/transit.ts"

export default function DepartureTable({ filteredUnits }: { filteredUnits: FleetUnit[] }) {
  const { fetchNetworkData } = useAppStore()
  const { tickLive } = useFleetStore()

  useEffect(() => {
    fetchNetworkData()
    const int = setInterval(tickLive, 1000)
    return () => clearInterval(int)
  }, [fetchNetworkData, tickLive])


  return (
    <div className="overflow-y-auto flex-1 custom-scrollbar">
      <table className="w-full text-left border-collapse text-xs">
        <thead
          className="sticky top-0 bg-gray-50/95 backdrop-blur z-10 text-[10px] uppercase font-black text-gray-400 tracking-widest">
        <tr>{DEP_T_HEAD.map(h => <th key={h} className="py-3 px-6 border-b border-gray-200">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
        {filteredUnits.map(u => {
          const s = DEP_STATUS_CFG[u.status]
          return (
            <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
              <td className="py-3 px-6 font-bold text-blue-600">{u.id}</td>
              <td className="py-3 px-6 text-gray-800 font-medium">{u.line}</td>
              <td className="py-3 px-6 text-gray-500">{u.currentStation}</td>
              <td className="py-3 px-6 text-gray-400">{u.scheduledTime}</td>
              <td className={`py-3 px-6 font-bold ${s.color}`}>{u.actualTime}</td>
              <td className="py-3 px-6">
                <span
                  className={`px-2 py-1 rounded text-[9px] font-black tracking-wider ${s.bg} ${s.color} shadow-sm border border-current/10`}>
                    {u.status === "delayed" ? `+${u.delayMinutes}M ` + s.label : s.label}
                </span>
              </td>
            </tr>
          )
        })}

        {filteredUnits.length === 0 && (
          <tr>
            <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
              Žádné vozy neodpovídají vyhledávacímu filtru.
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  )
}