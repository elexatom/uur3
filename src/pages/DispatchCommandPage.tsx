import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  Button,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Slider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {DataGrid, type GridColDef} from '@mui/x-data-grid'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import GavelIcon from '@mui/icons-material/Gavel';
import WarningIcon from '@mui/icons-material/Warning';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TramIcon from '@mui/icons-material/Tram';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MapIcon from '@mui/icons-material/Map';

import { useFleetStore } from '../store/fleetStore';
import { useAppStore } from '../store/appStore';

// --- TYPY A KONSTANTY ---

interface Intervention {
  id: string;
  type: 'replacement' | 'reinforcement';
  title: string;
  status: 'active' | 'completed';
  timestamp: string;
  details: string;
}

const DEPOTS = [
  {
    id: 'slovany',
    name: 'Vozovna Slovany',
    backups: [
      { id: 'TR-BK1', type: 'tram', model: 'Škoda 15T', status: 'ready' },
      { id: 'TR-BK2', type: 'tram', model: 'Škoda 15T', status: 'ready' },
    ],
  },
  {
    id: 'skvrnany',
    name: 'Vozovna Skvrňany',
    backups: [
      { id: 'BS-BK1', type: 'bus', model: 'SOR NS 12', status: 'ready' },
      { id: 'TL-BK1', type: 'trolley', model: 'Škoda 26Tr', status: 'ready' },
    ],
  },
  {
    id: 'finishing',
    name: 'Končící směny',
    backups: [
      { id: 'TR-4055', type: 'tram', model: 'Škoda 15T', status: 'ending-soon' },
    ],
  },
];

const EVENT_AREAS = [
  { id: 'struncovy', name: 'Štruncovy sady (Fotbal)' },
  { id: 'namesti', name: 'Náměstí Republiky (Pilsner Fest)' },
  { id: 'depo2015', name: 'DEPO2015 (Kulturní akce)' },
  { id: 'lochotin', name: 'Amfiteátr Lochotín' },
];

// --- KOMPONENTA ---

export const DispatchCommandPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { units } = useFleetStore();
  const [activeInterventions, setActiveInterventions] = useState<Intervention[]>([]);

  // Stepper stavy pro Nasazení zálohy
  const [replStep, setReplStep] = useState(0);
  const [selectedBrokenVessel, setSelectedBrokenVessel] = useState<string | null>(null);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [selectedTargetStop, setSelectedTargetStop] = useState('');

  // Stepper stavy pro Posilovou dopravu
  const [reinfStep, setReinStep] = useState(0);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [expectedPeople, setExpectedPeople] = useState(5000);
  const [reinfFreq, setReinfReinFreq] = useState(5);

  const replVesselData = useMemo(() => {
    return units.find(u => u.id === selectedBrokenVessel);
  }, [units, selectedBrokenVessel]);

  const handleAddIntervention = (intervention: Intervention) => {
    setActiveInterventions(prev => [intervention, ...prev]);
  };

  const removeIntervention = (id: string) => {
    setActiveInterventions(prev => prev.filter(i => i.id !== id));
  };

  // --- RENDERING KROKŮ: NASAZENÍ ZÁLOHY ---

  const renderReplacementStep = () => {
    switch (replStep) {
      case 0: // Identifikace závady
        const columns: GridColDef[] = [
          { field: 'id', headerName: 'Vůz', width: 100 },
          { field: 'line', headerName: 'Linka', width: 150 },
          { field: 'currentStation', headerName: 'Pozice', width: 180 },
          { 
            field: 'maintenanceStatus', 
            headerName: 'Stav', 
            width: 150,
            renderCell: (params) => (
              <Chip 
                label={params.value} 
                color={params.value !== 'optimal' ? 'error' : 'success'} 
                size="small" 
              />
            )
          },
        ];
        return (
          <Box sx={{ height: 300, width: '100%', mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Krok 1: Vyberte vůz s hlášenou závadou</Typography>
            <DataGrid
              rows={units}
              columns={columns}
              onRowClick={(params) => setSelectedBrokenVessel(params.row.id as string)}
              density="compact"
              hideFooter
              sx={{ bgcolor: 'background.paper' }}
            />
          </Box>
        );
      case 1: // Výběr náhrady
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Krok 2: Vyberte náhradní vozidlo ze záloh</Typography>
            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
              <SimpleTreeView
                onSelectedItemsChange={(_, itemId) => setSelectedBackup(itemId)}
              >
                {DEPOTS.map(depot => (
                  <TreeItem key={depot.id} itemId={depot.id} label={depot.name}>
                    {depot.backups.map(backup => (
                      <TreeItem 
                        key={backup.id} 
                        itemId={backup.id} 
                        label={`${backup.id} - ${backup.model} (${backup.type})`} 
                      />
                    ))}
                  </TreeItem>
                ))}
              </SimpleTreeView>
            </Paper>
          </Box>
        );
      case 2: // Výpočet dojezdu
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Krok 3: Plánování setkání a výpočet ETA</Typography>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <TextField
                  fullWidth
                  label="Cílová stanice setkání"
                  variant="outlined"
                  value={selectedTargetStop}
                  onChange={(e) => setSelectedTargetStop(e.target.value)}
                  placeholder="Např. U Práce"
                  size="small"
                />
              </Grid>
              <Grid xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.dark' }}>
                  <TimerIcon sx={{ color: 'white', mb: 1 }} />
                  <Typography variant="h5" color="white">12 min</Typography>
                  <Typography variant="caption" color="white">Předpokládaný dojezd zálohy</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      case 3: // Nasazení
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h6">Připraveno k nasazení</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Vůz <strong>{selectedBackup}</strong> převezme jízdní řád linky 
              <strong> {replVesselData?.line}</strong> od zastávky <strong>{selectedTargetStop}</strong>.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary">
              Původní vůz {selectedBrokenVessel} bude po uvolnění cestujících navigován do nejbližší vozovny.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  // --- RENDERING KROKŮ: POSILOVÁ DOPRAVA ---

  const renderReinforcementStep = () => {
    const chartData = [
      { name: 'Standard', vozy: 12, ridici: 12 },
      { name: 'S posilou', vozy: Math.ceil(12 + (expectedPeople / 1000) * (10 / reinfFreq)), ridici: Math.ceil(12 + (expectedPeople / 1000) * (10 / reinfFreq)) },
    ];

    switch (reinfStep) {
      case 0: // Cíl
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Krok 1: Vyberte oblast konání akce</Typography>
            <Grid container spacing={1}>
              {EVENT_AREAS.map(area => (
                <Grid xs={6} key={area.id}>
                  <Button
                    fullWidth
                    variant={selectedArea === area.id ? 'contained' : 'outlined'}
                    onClick={() => setSelectedArea(area.id)}
                    sx={{ height: 60 }}
                  >
                    {area.name}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 1: // Parametry
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Krok 2: Nastavte parametry akce</Typography>
            <Box sx={{ px: 2 }}>
              <Typography variant="caption">Očekávaná návštěvnost: {expectedPeople.toLocaleString()} lidí</Typography>
              <Slider
                value={expectedPeople}
                min={500}
                max={20000}
                step={500}
                onChange={(_, val) => setExpectedPeople(val as number)}
                valueLabelDisplay="auto"
              />
              <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>Požadovaná frekvence spojů: každých {reinfFreq} min</Typography>
              <Slider
                value={reinfFreq}
                min={2}
                max={15}
                step={1}
                onChange={(_, val) => setReinfReinFreq(val as number)}
                valueLabelDisplay="auto"
              />
            </Box>
          </Box>
        );
      case 2: // Vizualizace
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Krok 3: Kalkulace potřebných kapacit</Typography>
            <Box sx={{ height: 200, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="vozy" fill="#10a4ff" name="Potřebné vozy" />
                  <Bar dataKey="ridici" fill="#8264ce" name="Potřební řidiči" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
              Zvýšení kapacity o {((chartData[1].vozy / chartData[0].vozy - 1) * 100).toFixed(0)}% oproti běžnému stavu.
            </Typography>
          </Box>
        );
      case 3: // Schválení
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h6">Plán posílení připraven</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Oblast: <strong>{EVENT_AREAS.find(a => a.id === selectedArea)?.name}</strong><br/>
              Dodatečná kapacita: <strong>{chartData[1].vozy - chartData[0].vozy} vozů</strong>
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary">
              Po schválení budou do systému automaticky vloženy posilové spoje.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 4, height: '100%', overflowY: 'auto', bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <GavelIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -1 }}>Dispatch Command</Typography>
          <Typography variant="body2" color="text.secondary">Operativní řešení krizových situací a plánování mimořádností</Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* LEVÁ ČÁST: PRŮVODCI */}
        <Grid xs={12} lg={7}>
          <Paper sx={{ bgcolor: 'background.paper', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Tabs 
              value={activeTab} 
              onChange={(_, val) => setActiveTab(val)} 
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<WarningIcon />} label="NASAZENÍ ZÁLOHY" />
              <Tab icon={<AddCircleIcon />} label="POSILOVÁ DOPRAVA" />
            </Tabs>

            <Box sx={{ p: 4 }}>
              {activeTab === 0 ? (
                <Box>
                  <Stepper activeStep={replStep} alternativeLabel>
                    {['Závada', 'Záloha', 'Dojezd', 'Nasazení'].map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  
                  <Box sx={{ minHeight: 320 }}>
                    {renderReplacementStep()}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button 
                      disabled={replStep === 0} 
                      onClick={() => setReplStep(s => s - 1)}
                    >
                      Zpět
                    </Button>
                    {replStep < 3 ? (
                      <Button 
                        variant="contained" 
                        onClick={() => setReplStep(s => s + 1)}
                        disabled={(replStep === 0 && !selectedBrokenVessel) || (replStep === 1 && !selectedBackup) || (replStep === 2 && !selectedTargetStop)}
                      >
                        Pokračovat
                      </Button>
                    ) : (
                      <Button 
                        variant="contained" 
                        color="success"
                        onClick={() => {
                          handleAddIntervention({
                            id: `INT-${Date.now()}`,
                            type: 'replacement',
                            title: `Záloha za ${selectedBrokenVessel}`,
                            status: 'active',
                            timestamp: new Date().toLocaleTimeString(),
                            details: `Vůz ${selectedBackup} nasazen na linku ${replVesselData?.line}.`,
                          });
                          setReplStep(0);
                          setSelectedBrokenVessel(null);
                          setSelectedBackup(null);
                          setSelectedTargetStop('');
                        }}
                      >
                        POTVRDIT NASAZENÍ
                      </Button>
                    )}
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Stepper activeStep={reinfStep} alternativeLabel>
                    {['Cíl', 'Parametry', 'Kapacita', 'Schválení'].map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>

                  <Box sx={{ minHeight: 320 }}>
                    {renderReinforcementStep()}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button 
                      disabled={reinfStep === 0} 
                      onClick={() => setReinStep(s => s - 1)}
                    >
                      Zpět
                    </Button>
                    {reinfStep < 3 ? (
                      <Button 
                        variant="contained" 
                        onClick={() => setReinStep(s => s + 1)}
                        disabled={reinfStep === 0 && !selectedArea}
                      >
                        Pokračovat
                      </Button>
                    ) : (
                      <Button 
                        variant="contained" 
                        color="success"
                        onClick={() => {
                          handleAddIntervention({
                            id: `REI-${Date.now()}`,
                            type: 'reinforcement',
                            title: `Posila: ${EVENT_AREAS.find(a => a.id === selectedArea)?.name}`,
                            status: 'active',
                            timestamp: new Date().toLocaleTimeString(),
                            details: `Frekvence ${reinfFreq} min pro ${expectedPeople} osob.`,
                          });
                          setReinStep(0);
                          setSelectedArea('');
                        }}
                      >
                        SCHVÁLIT PLÁN
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* PRAVÁ ČÁST: REGISTR INTERVENCÍ */}
        <Grid xs={12} lg={5}>
          <Paper sx={{ bgcolor: 'background.paper', borderRadius: 4, p: 3, border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Aktivní opatření</Typography>
              <Chip label={activeInterventions.length} size="small" color="primary" />
            </Box>

            {activeInterventions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, opacity: 0.5 }}>
                <CheckCircleIcon sx={{ fontSize: 48, mb: 2 }} />
                <Typography>Žádná aktivní opatření</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {activeInterventions.map((item) => (
                  <Paper 
                    key={item.id} 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255,255,255,0.02)', 
                      border: '1px solid rgba(255,255,255,0.05)',
                      position: 'relative'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" color="primary">{item.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.timestamp}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2 }}>{item.details}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        icon={item.type === 'replacement' ? <WarningIcon fontSize="small" /> : <MapIcon fontSize="small" />}
                        label={item.type === 'replacement' ? 'Nasazení zálohy' : 'Posila'} 
                        size="small" 
                        variant="outlined" 
                      />
                      <Button 
                        size="small" 
                        color="error" 
                        startIcon={<DeleteIcon />}
                        onClick={() => removeIntervention(item.id)}
                      >
                        Zrušit
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
