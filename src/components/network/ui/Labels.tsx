/*
Finalni revize - 100%
 */

import type {Line, Stop, TransitType} from "../../../types/transit.ts"
import {TYPE_COLORS, TYPE_ICONS, TYPE_LABELS} from "../../../types/design.tsx"

export const GroupLabel = ({type, count}: { type: TransitType; count: number }) => (
  <div className="flex items-center gap-2 py-1">
    <span style={{color: TYPE_COLORS[type]}}>{TYPE_ICONS[type]}</span>
    <span className="font-semibold text-[13px]">{TYPE_LABELS[type]}</span>
    <span className="ml-auto text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
  </div>
)

interface ItemLabelProps {
  item: Stop | Line;
  type: TransitType;
  selected: boolean;
  isStop: boolean
}

export const ItemLabel = ({item, type, selected, isStop}: ItemLabelProps) => (
  <div
    className={`flex items-center gap-2 py-1 pl-2 border-l-2 transition-colors ${
      selected ? 'text-gray-900 dark:text-white font-semibold' : 'border-transparent text-gray-500 dark:text-gray-400'
    }`}
    style={{borderLeftColor: selected ? TYPE_COLORS[type] : 'transparent'}}
  >
    {isStop ? (
      <div className="w-1.5 h-1.5 rounded-full shrink-0"
           style={{backgroundColor: selected ? TYPE_COLORS[type] : '#9ca3af'}}/>
    ) : (
      <span
        className="inline-flex items-center justify-center w-5 h-5 rounded text-white text-[10px] font-black shrink-0"
        style={{backgroundColor: TYPE_COLORS[type]}}>
        {(item as Line).number}
      </span>
    )}
    <span className="text-xs text-black">
      {isStop ? item.name : (item as Line).longName}
    </span>
  </div>
)