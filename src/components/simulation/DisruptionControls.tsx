import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import BuildIcon from '@mui/icons-material/Build';
import EventIcon from '@mui/icons-material/Event';

interface DisruptionControlsProps {
  onInjectDisruption: () => void;
  onInjectDefect: () => void;
  onInjectEvent: () => void;
}

export const DisruptionControls: React.FC<DisruptionControlsProps> = ({ 
  onInjectDisruption, 
  onInjectDefect, 
  onInjectEvent 
}) => {
  return (
    <Box className="space-y-4">
      <Typography variant="overline" className="font-black text-gray-500 tracking-widest">
        Event Injection
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onInjectDisruption}
          startIcon={<WarningIcon className="text-orange-500" />}
          className="flex-col py-4 border-white/10 hover:bg-orange-500/5 rounded-xl text-[10px] font-black uppercase"
        >
          Disruption
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={onInjectDefect}
          startIcon={<BuildIcon className="text-red-500" />}
          className="flex-col py-4 border-white/10 hover:bg-red-500/5 rounded-xl text-[10px] font-black uppercase"
        >
          Vehicle Defect
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={onInjectEvent}
          startIcon={<EventIcon className="text-blue-500" />}
          className="flex-col py-4 border-white/10 hover:bg-blue-500/5 rounded-xl text-[10px] font-black uppercase"
        >
          City Event
        </Button>
      </Stack>
    </Box>
  );
};
