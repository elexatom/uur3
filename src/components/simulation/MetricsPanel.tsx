import React from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';

interface MetricsPanelProps {
  congestion: number;
  efficiency: number;
  delay: number;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ congestion, efficiency, delay }) => {
  const getCongestionColor = (val: number) => {
    if (val < 40) return 'bg-green-500';
    if (val < 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Box className="space-y-4">
      <Box className="grid grid-cols-2 gap-4">
        <Paper className="p-4 bg-white/5 border border-white/5 rounded-2xl">
          <Typography variant="caption" className="text-gray-500 font-bold uppercase tracking-tighter">
            System Delay
          </Typography>
          <Typography variant="h4" className="font-black text-blue-400">
            +{delay.toFixed(0)}m
          </Typography>
        </Paper>
        <Paper className="p-4 bg-white/5 border border-white/5 rounded-2xl">
          <Typography variant="caption" className="text-gray-500 font-bold uppercase tracking-tighter">
            Congestion
          </Typography>
          <Typography variant="h4" className="font-black">
            {congestion.toFixed(0)}%
          </Typography>
        </Paper>
      </Box>

      <Paper className="p-5 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-900/20">
        <Box className="flex justify-between items-center mb-2">
          <Typography className="font-black uppercase tracking-widest text-[10px] opacity-80">
            Efficiency Prediction
          </Typography>
          <Typography className="font-black text-xl">
            {efficiency.toFixed(1)}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={efficiency} 
          className="h-2 rounded-full bg-black/20"
          sx={{ '& .MuiLinearProgress-bar': { bgcolor: 'white' } }}
        />
      </Paper>

      <Box className="space-y-1">
        <Box className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
          <span>Traffic Density</span>
          <span>{congestion > 70 ? 'CRITICAL' : congestion > 40 ? 'NOMINAL' : 'FLUID'}</span>
        </Box>
        <Box className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <Box 
            className={`h-full transition-all duration-1000 ${getCongestionColor(congestion)}`}
            style={{ width: `${congestion}%` }}
          />
        </Box>
      </Box>
    </Box>
  );
};
