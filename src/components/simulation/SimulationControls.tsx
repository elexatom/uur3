import React from 'react';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import MapIcon from '@mui/icons-material/Map';
import { useAppStore } from '../../store/appStore';

interface SimulationControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({ isRunning, onToggle, onReset }) => {
  const { layers, toggleLayer } = useAppStore();

  return (
    <Box className="flex items-center gap-2">
      <Tooltip title={isRunning ? 'Pause Simulation' : 'Start Simulation'}>
        <Button
          variant="contained"
          color={isRunning ? 'warning' : 'primary'}
          onClick={onToggle}
          startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
          className="rounded-full px-6 font-bold shadow-lg shadow-blue-500/20"
        >
          {isRunning ? 'PAUSE' : 'RUN'}
        </Button>
      </Tooltip>

      <Tooltip title="Reset Simulation">
        <IconButton onClick={onReset} className="bg-white/5 hover:bg-white/10">
          <RefreshIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Toggle Heatmap Visualization">
        <IconButton 
          onClick={() => toggleLayer('showHeatmap')}
          className={`transition-colors ${layers.showHeatmap ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5'}`}
        >
          <MapIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
