// TODO: tohle je humus

import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView"
import { TreeItem } from "@mui/x-tree-view/TreeItem"
import { TYPE_COLORS, TYPE_ICONS, TYPE_LABELS } from "../../../types/design.tsx"
import type { Line, Stop } from "../../../types/transit.ts"
import { Box } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { useAppStore } from "../../../store/appStore.ts"

interface TreeProps {
  activeData: Record<string, never[]>
  activeTab: "LINKY" | "ZASTÁVKY"
  search?: string
}

export function Tree({ activeData, activeTab, search }: TreeProps) {
  const {
    selectedStopId,
    selectStop,
    selectedLineId,
    selectLine,
    setMapCenter,
  } = useAppStore()

  const [visibleLimits, setVisibleLimits] = useState({
    tram: 50,
    bus: 50,
    trolley: 50,
  })

  const [expanded, setExpanded] = useState<string[]>([])

  const isFirstRender = useRef(true)

  // reset při změně tabu
  useEffect(() => {
    setVisibleLimits({ tram: 50, bus: 50, trolley: 50 })
    setExpanded([])
  }, [activeTab])

  // 🔥 hlavní logika (search + data změna)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // jen při searchi expanduj
    if (search) {
      if (search.trim().length > 0) {
        const typesWithData = (["tram", "bus", "trolley"] as const)
          .filter((type) => activeData[type]?.length > 0)

        setExpanded(typesWithData)
      }
    }
  }, [activeData, search])

  // expand při výběru stopky
  useEffect(() => {
    if (activeTab !== "ZASTÁVKY" || !selectedStopId) return

    const stop = Object.values(activeData)
      .flat()
      .find((s: any) => s.id === selectedStopId)

    if (!stop) return

    const type = ["tram", "bus", "trolley"].includes(stop.type)
      ? stop.type
      : "bus"

    setExpanded((prev) =>
      prev.includes(type) ? prev : [...prev, type]
    )
  }, [selectedStopId, activeTab, activeData])

  const isStopTab = activeTab === "ZASTÁVKY"

  const selectedItemId =
    isStopTab && selectedStopId
      ? String(selectedStopId)
      : !isStopTab && selectedLineId
        ? `l-${selectedLineId}`
        : undefined

  const handleItemClick = (item: Stop | Line) => {
    if (isStopTab) {
      const stop = item as Stop
      selectStop(stop.id)
      setMapCenter([stop.lat, stop.lng], 15)
    } else {
      const line = item as Line
      selectLine(line.id)
    }
  }

  return (
    <Box className="flex-1 overflow-y-auto py-2">
      <SimpleTreeView
        expandedItems={expanded}

        onExpandedItemsChange={(_event, itemIds) => setExpanded(itemIds)}
      >
        {(["tram", "bus", "trolley"] as const).map((type) => {
          const items = activeData[type]
          if (!items?.length) return null

          return (
            <TreeItem
              key={type}
              itemId={type}
              sx={{ "& .MuiTreeItem-content": { padding: "2px 8px" } }}
              label={
                <div className="flex items-center gap-2 py-1">
                  <span style={{ color: TYPE_COLORS[type] }}>{TYPE_ICONS[type]}</span>
                  <span className="font-semibold text-[13px]">{TYPE_LABELS[type]}</span>
                  <span className="ml-auto text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </div>
              }
            >
              {items.slice(0, visibleLimits[type]).map((item) => {
                const id = isStopTab ? String(item.id) : `l-${item.id}`
                const isSelected = item.id === (isStopTab ? selectedStopId : selectedLineId)

                return (
                  <TreeItem
                    key={id}
                    itemId={id}
                    onClick={() => handleItemClick(item)}
                    sx={{ "& .MuiTreeItem-content": { padding: "1px 8px" } }}
                    label={
                      <div
                        className={`flex items-center gap-2 py-1 pl-2 border-l-2 transition-colors ${isSelected ? "text-gray-900 dark:text-white font-semibold" : "border-transparent text-gray-500 dark:text-gray-400"}`}
                        style={{ borderLeftColor: isSelected ? TYPE_COLORS[type] : "transparent" }}
                      >
                        {isStopTab ? (
                          <div
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: isSelected ? TYPE_COLORS[type] : "#9ca3af" }}
                          />
                        ) : (
                          <span
                            className="inline-flex items-center justify-center w-5 h-5 rounded text-white text-[10px] font-black shrink-0"
                            style={{ backgroundColor: (item as Line).color || TYPE_COLORS[type] }}>
                              {(item as Line).number}
                          </span>
                        )}
                        <span className="text-xs text-black">{item.name}</span>
                      </div>
                    }
                  />
                )
              })}

              {items.length > visibleLimits[type] && (
                <TreeItem
                  key={`load-more-${type}`}
                  itemId={`load-more-${type}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setVisibleLimits(prev => ({ ...prev, [type]: prev[type] + 100 }))
                  }}
                  label={
                    <div
                      className="py-2 flex justify-center items-center gap-1 text-[11px] font-bold text-blue-600 opacity-80 hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>expand_more</span>
                      Zobrazit dalších {Math.min(100, items.length - visibleLimits[type])} položek...
                    </div>
                  }
                />
              )}
            </TreeItem>
          )
        })}
      </SimpleTreeView>
    </Box>
  )
}