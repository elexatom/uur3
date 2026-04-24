/*
Revidovano
TODO: portebuje dodelat - centrovani na linku, nekompletni linky z JSONu, duplikaty zastavek (jsou 2 ve smerech)
 */

import React, { useMemo, useState } from "react"
import { Box, Tab, Tabs } from "@mui/material"
import { useAppStore } from "../../store/appStore.ts"
import { SearchBar } from "./ui/SearchBar.tsx"
import { Tree } from "./ui/Tree.tsx"


// grouping objektu podle typu
const groupByType = (items: any[]) => {
  return items.reduce((acc, item) => {
    const t = ["tram", "bus", "trolley"].includes(item.type) ? item.type : "bus"
    acc[t] = [...(acc[t] || []), item]
    return acc
  }, { tram: [], bus: [], trolley: [] })
}

export function NetworkTreeView() {
  const [activeTab, setActiveTab] = useState<"LINKY" | "ZASTÁVKY">("LINKY") //aktualni zvolena karta
  const [search, setSearch] = useState("")                                  // hledany vyraz

  const { network } = useAppStore()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  // filtrovani a grouping
  const activeData = useMemo(() => {
    const query = search.toLowerCase()

    if (activeTab === "ZASTÁVKY") {
      const filteredStops = network.stops.filter(s =>
        !query || s.name.toLowerCase().includes(query)
      )
      return groupByType(filteredStops)
    }

    if (activeTab === "LINKY") {
      const filteredLines = (network.lines || []).filter(l =>
        !query ||
        l.name.toLowerCase().includes(query) ||
        l.number.toString().includes(query)
      )
      return groupByType(filteredLines)
    }
  }, [network.stops, network.lines, search, activeTab])

  return (
    <Box className="flex flex-col h-full">
      <Box className="border-b border-gray-200">
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="fullWidth"
        >
          <Tab value="LINKY" label="LINKY" className="min-h-10" sx={{ fontSize: 12, fontWeight: 600 }}/>
          <Tab value="ZASTÁVKY" label="ZASTÁVKY" className="min-h-10" sx={{ fontSize: 12, fontWeight: 600 }}/>
        </Tabs>
      </Box>


      <SearchBar setSearch={handleSearch} search={search}/>
      <Tree activeData={activeData} activeTab={activeTab} search={search}/>
    </Box>
  )
}
