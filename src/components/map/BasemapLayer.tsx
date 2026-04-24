import React from "react"
import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material"
import { TileLayer } from "react-leaflet"
import type { SelectChangeEvent } from "@mui/material/Select"
import { useAppStore } from "../../store/appStore"

const getLayerLabel = (url: string, index: number): string => {
  try {
    const host = new URL(url.replace("{s}.", "a.")).host
    return `Layer ${index + 1} (${host})`
  } catch {
    return `Layer ${index + 1}`
  }
}

export const BasemapTileLayer: React.FC = () => {
  const settings = useAppStore((s) => s.settings)

  const activeLayer = settings.basemapLayers.find((layer) => layer.id === settings.activeBasemapId)
    ?? settings.basemapLayers[0]

  return (
    <TileLayer
      key={activeLayer.id}
      url={activeLayer.url}
      attribution={activeLayer.attribution}
      maxZoom={19}
    />
  )
}

interface BasemapSelectorProps {
  className?: string;
}

export const BasemapSelector: React.FC<BasemapSelectorProps> = ({ className }) => {
  const settings = useAppStore((s) => s.settings)
  const updateSettings = useAppStore((s) => s.updateSettings)

  const handleChange = (event: SelectChangeEvent<string>) => {
    updateSettings({ activeBasemapId: event.target.value })
  }

  return (
    <Box
      className={className}
      sx={{
        minWidth: 220,
        p: 1.25,
        borderRadius: 2,
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        border: "1px solid rgba(148, 163, 184, 0.3)",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Typography
        variant="caption"
        sx={{ display: "block", mb: 0.75, fontWeight: 700, color: "text.secondary", letterSpacing: "0.05em" }}
      >
        BASEMAP
      </Typography>
      <FormControl fullWidth size="small">
        <Select
          value={settings.activeBasemapId}
          onChange={handleChange}
          sx={{ backgroundColor: "#fff", fontSize: 12, fontWeight: 600 }}
        >
          {settings.basemapLayers.map((layer, index) => (
            <MenuItem key={layer.id} value={layer.id} sx={{ fontSize: 12 }}>
              {getLayerLabel(layer.url, index)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

