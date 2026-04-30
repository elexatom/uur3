/*
Finalni revize - 100%
 */

import { Polyline } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import { TYPE_COLORS } from '../../../types/design'
import type {Segment} from "../../../types/transit.ts"

interface Props {
  segments: Segment[]
  dimmed: boolean
}

export const SegmentLayer = ({ segments, dimmed }: Props) => (
  <>
    {segments.map((seg) => {
      if (!seg.coords || seg.coords.length < 2) return null
      const defaultColor = seg.isTram ? TYPE_COLORS.tram : seg.isTrol ? TYPE_COLORS.trolley : TYPE_COLORS.bus

      return (
        <Polyline
          key={seg.id}
          positions={seg.coords as LatLngExpression[]}
          pathOptions={{
            color:   dimmed ? '#cbd5e1' : defaultColor,
            weight:  seg.isTram ? 4 : 3,
            opacity: dimmed ? 0.3 : 0.7,
          }}
        />
      )
    })}
  </>
)