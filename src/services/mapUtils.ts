/*
Finalni revize - 100%
 */

import {TYPE_COLORS} from '../types/design'
import type {Segment, TransitType} from '../types/transit'

export const hexToRgb = (hex: string, alpha = 255): [number, number, number, number] => {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, alpha]
}

export const typeColor = (type: TransitType, alpha = 255) =>
  hexToRgb(TYPE_COLORS[type], alpha)

export const isBus = (seg: Segment) => seg.isBus || (!seg.isTram && !seg.isTrol)

export const isVisible = (seg: Segment, layers: any) =>
  (seg.isTram && layers.showTrams) || (seg.isTrol && layers.showTrolleys) || (isBus(seg) && layers.showBuses)

export const matchesLine = (seg: Segment, type: TransitType) =>
  (type === 'tram' && seg.isTram) || (type === 'trolley' && seg.isTrol) || (type === 'bus' && isBus(seg))

