/*
Finalni revize - 100%
 */

import {useEffect, useRef, useState} from 'react'
import {Box} from '@mui/material'
import {SimpleTreeView} from '@mui/x-tree-view/SimpleTreeView'
import {TreeItem} from '@mui/x-tree-view/TreeItem'
import {useAppStore} from '../../../store/appStore'
import type {Line, Stop, TransitType} from '../../../types/transit'
import {GroupLabel, ItemLabel} from "./Labels.tsx"

const TYPES = ['tram', 'bus', 'trolley'] as const
const PAGE = 50

interface Props {
  activeData: Record<TransitType, (Stop | Line)[]>
  activeTab: 'LINKY' | 'ZASTÁVKY'
  search?: string
}

export function Tree({activeData, activeTab, search}: Props) {
  const {selectedStopId, selectStop, selectedLineId, selectLine, setMapCenter} = useAppStore()

  const [limits, setLimits] = useState<Record<TransitType, number>>({tram: PAGE, bus: PAGE, trolley: PAGE})
  const [expanded, setExpanded] = useState<string[]>([])
  const isStopTab = activeTab === 'ZASTÁVKY'

  // reset pri prepnuti tabu
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLimits({tram: PAGE, bus: PAGE, trolley: PAGE})
    setExpanded([])
  }, [activeTab])

  // expand skupin pri vyhledavani
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (!search?.trim()) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpanded(TYPES.filter(t => activeData[t]?.length > 0))
  }, [activeData, search])

  // expand skupiny pri vybrane zastavce
  useEffect(() => {
    if (!isStopTab || !selectedStopId) return
    const stop = Object.values(activeData).flat().find((s: any) => s.id === selectedStopId) as Stop | undefined
    if (!stop) return
    const type: TransitType = TYPES.includes(stop.type as TransitType) ? stop.type as TransitType : 'bus'
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpanded(prev => prev.includes(type) ? prev : [...prev, type])
  }, [selectedStopId, isStopTab, activeData])

  const handleClick = (item: Stop | Line) => {
    if (isStopTab) {
      const s = item as Stop
      selectStop(s.id)
      setMapCenter([s.lat, s.lng], 15)
    } else {
      selectLine((item as Line).id)
    }
  }

  const loadMore = (e: React.MouseEvent, type: TransitType, remaining: number) => {
    e.stopPropagation()
    setLimits(prev => ({...prev, [type]: prev[type] + Math.min(100, remaining)}))
  }

  return (
    <Box className="flex-1 overflow-y-auto py-2">
      <SimpleTreeView expandedItems={expanded} onExpandedItemsChange={(_, ids) => setExpanded(ids)}>
        {TYPES.map(type => {
          const items = activeData[type]
          if (!items?.length) return null
          const visible = items.slice(0, limits[type])
          const remaining = items.length - limits[type]

          return (
            <TreeItem
              key={type}
              itemId={type}
              sx={{'& .MuiTreeItem-content': {padding: '2px 8px'}}}
              label={<GroupLabel type={type} count={items.length}/>}
            >
              {visible.map(item => {
                const id = isStopTab ? String(item.id) : `l-${item.id}`
                const selected = item.id === (isStopTab ? selectedStopId : selectedLineId)
                return (
                  <TreeItem
                    key={id}
                    itemId={id}
                    sx={{'& .MuiTreeItem-content': {padding: '1px 8px'}}}
                    onClick={() => handleClick(item)}
                    label={<ItemLabel item={item} type={type} selected={selected} isStop={isStopTab}/>}
                  />
                )
              })}

              {remaining > 0 && (
                <TreeItem
                  key={`more-${type}`}
                  itemId={`more-${type}`}
                  onClick={(e) => loadMore(e, type, remaining)}
                  label={
                    <div
                      className="py-2 flex justify-center gap-1 text-[11px] font-bold text-blue-600 opacity-80 hover:opacity-100">
                      <span className="material-symbols-outlined" style={{fontSize: 16}}>expand_more</span>
                      Zobrazit dalších {Math.min(100, remaining)} položek...
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