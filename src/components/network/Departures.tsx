// revidovano OK

import {IconButton} from "@mui/material"
import {
  CloseFullscreen as CloseFullscreenIcon,
  OpenInFull as OpenInFullIcon,
} from "@mui/icons-material"
import React, {useMemo, useState} from "react"
import {useFleetStore} from "../../store/fleetStore.ts"
import {SearchBar} from "./ui/SearchBar.tsx"
import DepartureTable from "./ui/DepartureTable.tsx"

export default function Departures() {
  const {units} = useFleetStore()

  const [isExpanded, setIsExpanded] = useState(false)
  const [filterText, setFilterText] = useState("")

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value)
  }

  const filteredUnits = useMemo(() => {
    const q = filterText.toLowerCase()
    return units.filter(u => !q || [u.id, u.line, u.currentStation].some(f => f.toLowerCase().includes(q)))
  }, [units, filterText])

  return (
    <section
      className={`absolute bottom-0 left-0 right-0 z-300 bg-white border-t border-gray-200 flex flex-col transition-all duration-300
       ${isExpanded ? "h-[80%]" : "h-64"}`}>

      <div className="flex justify-between items-center px-6 py-2 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-4 h-10">
          <span className="text-xs font-black uppercase tracking-widest text-black">Odjezdy</span>
          <SearchBar search={filterText} setSearch={handleFilter}/>
        </div>
        <div className="text-gray-400 flex items-center gap-1">
          <IconButton size="small" color="inherit" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ?
              <CloseFullscreenIcon fontSize="small"/> : <OpenInFullIcon fontSize="small"/>
            }
          </IconButton>
        </div>
      </div>

      <DepartureTable filteredUnits={filteredUnits}/>
    </section>
  )
}