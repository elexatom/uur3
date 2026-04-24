import React, { useState } from 'react';
import { 
  Box, Typography, Button, Stepper, Step, StepLabel, 
  Slider, MenuItem, Select, TextField, 
  InputAdornment, IconButton, List, ListItem, ListItemText, Divider, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloudIcon from '@mui/icons-material/Cloud';
import GroupIcon from '@mui/icons-material/Group';
import WarningIcon from '@mui/icons-material/Warning';
import { useSimulationStore } from '../../store/simulationStore';
import type { WeatherType } from '../../store/simulationStore';

const WEATHER_OPTIONS: WeatherType[] = ['Clear', 'Rain', 'Snow', 'Storm', 'Fog', 'Heatwave'];

export const SimulationWizard: React.FC = () => {
  const { 
    setupStep, setSetupStep, 
    weather, setWeather, passengerLoad, setPassengerLoad,
    addDisruption, setIsActive
  } = useSimulationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      // Nominatim requires a User-Agent. Using a generic but identifying one.
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ' Plzeň, CZ')}&accept-language=cs`, {
        headers: {
          'User-Agent': 'PulseSim-Transit-Simulator/1.0'
        }
      });
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setIsSearching(false);
    }
  };

  const steps = ['Environment', 'Incidents'];

  return (
    <Box className="h-full flex flex-col p-8 overflow-hidden">
      <Box className="mb-8 shrink-0">
        <Typography variant="h5" className="font-black text-slate-900 tracking-tight">Configuration</Typography>
        <Typography variant="body2" className="text-slate-500 font-medium">Setup your simulation baseline.</Typography>
      </Box>

      <Stepper activeStep={setupStep} className="mb-10 shrink-0" alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', mt: 1 } }}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box className="flex-1 overflow-y-auto pr-2 min-h-0">
        {setupStep === 0 && (
          <Box className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
            <Box>
              <Box className="flex items-center gap-2 mb-4 text-blue-600">
                <CloudIcon fontSize="small" />
                <Typography variant="caption" className="font-black uppercase tracking-widest">Weather State</Typography>
              </Box>
              <Select 
                fullWidth 
                value={weather} 
                onChange={(e) => setWeather(e.target.value as WeatherType)}
                className="bg-slate-50 rounded-2xl border-none font-bold text-slate-700"
                sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& .MuiSelect-select': { py: 2 } }}
              >
                {WEATHER_OPTIONS.map(w => <MenuItem key={w} value={w} className="font-bold text-sm">{w}</MenuItem>)}
              </Select>
            </Box>

            <Box>
              <Box className="flex items-center gap-2 mb-4 text-orange-600">
                <GroupIcon fontSize="small" />
                <Typography variant="caption" className="font-black uppercase tracking-widest">Passenger Density ({passengerLoad}%)</Typography>
              </Box>
              <Slider 
                value={passengerLoad} 
                onChange={(_, v) => setPassengerLoad(v as number)} 
                min={0} max={200} 
                className="text-orange-500"
              />
              <Box className="flex justify-between mt-2 text-[10px] font-black text-slate-400 uppercase">
                <span>Low</span>
                <span>Normal</span>
                <span>Peak</span>
              </Box>
            </Box>
          </Box>
        )}

        {setupStep === 1 && (
          <Box className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4 flex flex-col h-full min-h-0">
            <Box className="flex items-center gap-2 text-red-600 mb-2 shrink-0">
              <WarningIcon fontSize="small" />
              <Typography variant="caption" className="font-black uppercase tracking-widest">Initial Disruptions</Typography>
            </Box>
            
            <TextField
              fullWidth
              placeholder="Search eg. CAN, Náměstí..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleSearch} 
                        disabled={isSearching}
                        size="small" 
                        className="bg-blue-600 text-white hover:bg-blue-700 p-1.5"
                      >
                        {isSearching ? <CircularProgress size={16} color="inherit" /> : <SearchIcon sx={{ fontSize: 16 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  className: "bg-slate-50 rounded-2xl font-bold border-none",
                  sx: { '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, py: 0.5 }
                }
              }}
              className="shrink-0"
            />

            <Box className="flex-1 overflow-y-auto bg-slate-50 rounded-2xl min-h-[200px]">
              <List className="p-2 space-y-1">
                {searchResults.map((res, i) => (
                  <ListItem 
                    key={i} 
                    className="rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => {
                      addDisruption({
                        id: `place-${Date.now()}`,
                        lat: parseFloat(res.lat),
                        lng: parseFloat(res.lon),
                        label: res.display_name.split(',')[0],
                        severity: 'Medium',
                        radius: 350
                      });
                      setSearchResults([]);
                      setSearchQuery('');
                    }}
                  >
                    <ListItemText 
                      primary={res.display_name.split(',')[0]} 
                      secondary={res.display_name.split(',').slice(1, 4).join(',')}
                      primaryTypographyProps={{ className: "font-black text-slate-800 text-sm leading-tight" }}
                      secondaryTypographyProps={{ className: "text-[10px] font-bold text-slate-400 truncate" }}
                    />
                  </ListItem>
                ))}
                {!isSearching && searchResults.length === 0 && (
                  <Box className="p-8 text-center text-slate-400">
                    <Typography className="text-xs font-black uppercase opacity-60">Search for locations in Pilsen</Typography>
                    <Typography variant="caption" className="mt-1 block">eg. "Náměstí Republiky" or "Depo 2015"</Typography>
                  </Box>
                )}
              </List>
            </Box>

            <Divider className="my-2 shrink-0" />
            <Typography variant="caption" className="text-slate-400 text-center block font-black uppercase tracking-tighter opacity-60 shrink-0">Click map later for manual injection</Typography>
          </Box>
        )}
      </Box>

      <Box className="pt-8 flex justify-between gap-4 mt-auto shrink-0 border-t border-slate-100">
        <Button 
          disabled={setupStep === 0} 
          onClick={() => setSetupStep(setupStep - 1)}
          className="rounded-xl font-black text-slate-400 hover:text-slate-900"
        >
          Back
        </Button>
        {setupStep < 1 ? (
          <Button 
            variant="contained" 
            disableElevation
            onClick={() => setSetupStep(setupStep + 1)}
            className="bg-slate-900 text-white rounded-xl px-10 font-black"
          >
            Next
          </Button>
        ) : (
          <Button 
            variant="contained" 
            disableElevation
            onClick={() => {
              setIsActive(true);
              setSetupStep(0);
            }}
            className="bg-blue-600 text-white rounded-xl px-10 font-black shadow-lg shadow-blue-100"
          >
            Launch Engine
          </Button>
        )}
      </Box>
    </Box>
  );
};
