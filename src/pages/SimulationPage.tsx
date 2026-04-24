import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Grid, IconButton, Tooltip, TextField, InputAdornment, List, ListItem, ListItemText } from '@mui/material';
import { useSimulationStore } from '../store/simulationStore';
import { calculateNextMetrics, estimateStopDelay } from '../services/simulationService';
import { useAppStore } from '../store/appStore';
import type { Stop } from '../types/transit';

// Components
import { SimulationMap } from '../components/simulation/SimulationMap';
import { SimulationWizard } from '../components/simulation/SimulationWizard';

// Icons
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SearchIcon from '@mui/icons-material/Search';
import TimerIcon from '@mui/icons-material/Timer';

export const SimulationPage: React.FC = () => {
  const { network, fetchNetworkData } = useAppStore();
  const { 
    isActive, setIsActive, metrics, setMetrics, 
    weather, passengerLoad, disruptions,
    setMapInjectionMode, clearDisruptions
  } = useSimulationStore();

  const [stopSearch, setStopSearch] = useState('');
  const [filteredStops, setFilteredStops] = useState<Stop[]>([]);

  // Load data
  useEffect(() => {
    fetchNetworkData();
  }, [fetchNetworkData]);

  // Simulation Loop
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      const next = calculateNextMetrics(metrics, { weather, passengerLoad, disruptions });
      setMetrics(next);
    }, 2000);
    return () => clearInterval(interval);
  }, [isActive, metrics, weather, passengerLoad, disruptions, setMetrics]);

  // Filter stops
  useEffect(() => {
    if (!stopSearch) {
      setFilteredStops([]);
      return;
    }
    const query = stopSearch.toLowerCase();
    const matches = network.stops.filter(s => s.name.toLowerCase().includes(query)).slice(0, 5);
    setFilteredStops(matches);
  }, [stopSearch, network.stops]);

  return (
    <Box className="h-full w-full bg-white flex overflow-hidden text-slate-900">
      {/* Sidebar Controls */}
      <Box className="w-[380px] border-r border-slate-200 bg-white flex flex-col h-full z-20 shadow-sm">
        <Box className="flex-1 overflow-y-auto">
          {!isActive ? (
            <SimulationWizard />
          ) : (
            <Box className="p-6 space-y-8">
              <Box>
                <Typography variant="overline" className="font-black text-slate-400 tracking-widest mb-3 block leading-none">System Intelligence</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Paper elevation={0} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                      <Typography variant="caption" className="font-bold text-slate-500 uppercase block mb-1">Congestion</Typography>
                      <Typography variant="h4" className="font-black text-blue-600 leading-none">{metrics.congestion.toFixed(0)}%</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Paper elevation={0} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                      <Typography variant="caption" className="font-bold text-slate-500 uppercase block mb-1">Efficiency</Typography>
                      <Typography variant="h4" className="font-black text-green-600 leading-none">{metrics.efficiency.toFixed(0)}%</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Paper elevation={0} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                      <Typography variant="caption" className="font-bold text-slate-500 uppercase">System Latency</Typography>
                      <Typography variant="h5" className="font-black text-slate-900 leading-none">+{metrics.delay.toFixed(0)}m</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              <Box>
                <Typography variant="overline" className="font-black text-slate-400 tracking-widest mb-3 block leading-none">Stop Estimator</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search stop..."
                  value={stopSearch}
                  onChange={(e) => setStopSearch(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      className: "bg-slate-50 rounded-xl font-bold border-none",
                      sx: { '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }
                    }
                  }}
                />
                <List className="mt-2 space-y-1">
                  {filteredStops.map(stop => {
                    const lateTime = estimateStopDelay(stop.lat, stop.lng, metrics.delay, disruptions);
                    return (
                      <ListItem key={stop.id} className="bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-sm">
                        <ListItemText 
                          primary={stop.name} 
                          secondary={`${stop.type.toUpperCase()}`}
                          primaryTypographyProps={{ className: "font-black text-xs text-slate-800" }}
                          secondaryTypographyProps={{ className: "text-[10px] font-bold text-slate-400 uppercase" }}
                        />
                        <Box className="text-right">
                          <Box className="flex items-center gap-1 text-red-600">
                            <TimerIcon sx={{ fontSize: 12 }} />
                            <Typography className="font-black text-xs">+{lateTime}m</Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>

              <Box>
                <Typography variant="overline" className="font-black text-slate-400 tracking-widest mb-3 block leading-none">Action Menu</Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setMapInjectionMode(true)}
                  startIcon={<WarningAmberIcon />}
                  className="border-slate-200 text-slate-900 font-black rounded-xl py-3 hover:bg-slate-50"
                >
                  Inject Live Point
                </Button>
              </Box>

              <Box className="pb-8">
                <Typography variant="overline" className="font-black text-slate-400 tracking-widest mb-3 block leading-none">Active Incidents ({disruptions.length})</Typography>
                <Box className="space-y-2">
                  {disruptions.map(d => (
                    <Box key={d.id} className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                      <Box>
                        <Typography className="text-[11px] font-black text-red-900 uppercase mb-1">{d.label}</Typography>
                        <Typography className="text-[9px] font-bold text-red-700 uppercase">{d.severity} IMPACT</Typography>
                      </Box>
                      <Box className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </Box>
                  ))}
                  {disruptions.length === 0 && <Typography className="text-xs text-slate-400 font-medium italic">Clear skies.</Typography>}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Map Area */}
      <Box className="flex-1 relative h-full bg-slate-50">
        <SimulationMap />
        
        {/* Floating Control Box */}
        <Box className="absolute top-6 right-6 z-[1000] flex gap-2">
          <Paper className="p-1.5 flex gap-2 rounded-2xl shadow-2xl border border-slate-200/50 bg-white/90 backdrop-blur-md">
            <Button
              variant="contained"
              disableElevation
              onClick={() => setIsActive(!isActive)}
              startIcon={isActive ? <PauseIcon /> : <PlayArrowIcon />}
              className={`${isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'} rounded-xl font-black px-6 py-2 transition-all`}
            >
              {isActive ? 'PAUSE' : 'RUN'}
            </Button>
            <Tooltip title="Reset Simulation">
              <IconButton 
                onClick={() => { setIsActive(false); clearDisruptions(); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl"
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Paper>
        </Box>

        {/* HUD Overlays */}
        <Box className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-xl min-w-[200px]">
          <Typography variant="caption" className="font-black text-slate-500 uppercase tracking-widest mb-3 block text-center">Flow Gradient</Typography>
          <Box className="h-2 w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full mb-2" />
          <Box className="flex justify-between text-[9px] font-black text-slate-400 uppercase">
            <span>Congested</span>
            <span>Optimal</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
