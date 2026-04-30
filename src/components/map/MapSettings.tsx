/*
Finalni revize - 100%
 */

import {useAppStore} from "../../store/appStore.ts"
import {Box, ToggleButton, ToggleButtonGroup, Tooltip} from "@mui/material"
import MapIcon from "@mui/icons-material/Map"
import ViewInArIcon from "@mui/icons-material/ViewInAr"

export const MapSettings: React.FC = () => {
  const {mapMode, setMapMode} = useAppStore()

  return (
    <Box
      className="absolute top-3 left-3 z-1000 shadow-lg">

      <ToggleButtonGroup
        value={mapMode}
        exclusive
        onChange={(_, val) => val && setMapMode(val)}
        size="small"
        className="bg-white"
      >
        <Tooltip title="2D Klasická mapa" placement="left">
          <ToggleButton value="2d" className={mapMode === '2d' ? 'bg-blue-50 text-blue-600' : ''}>
            <MapIcon fontSize="small" className="mr-1"/> <span className="font-bold text-xs">2D</span>
          </ToggleButton>
        </Tooltip>
        <Tooltip title="3D Akcelerovaná mapa" placement="left">
          <ToggleButton value="3d" className={mapMode === '3d' ? 'bg-blue-50 text-blue-600' : ''}>
            <ViewInArIcon fontSize="small" className="mr-1"/> <span className="font-bold text-xs">3D</span>
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </Box>
  )
}