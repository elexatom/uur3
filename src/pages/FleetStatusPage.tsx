import React, { useEffect, useState } from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  IconButton,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import TramIcon from '@mui/icons-material/Tram';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import BoltIcon from '@mui/icons-material/Bolt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import MapIcon from '@mui/icons-material/Map';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import { useFleetStore } from '../store/fleetStore';
import type { FleetUnit } from '../types/transit';

const STATUS_CONFIG = {
  'optimal': { label: 'OPTIMAL', color: '#22c55e' },
  'service-required': { label: 'SERVICE REQUIRED', color: '#8264ce' }, // info.main
  'scheduled': { label: 'SCHEDULED (2H)', color: '#94acd3' },
};

const TYPE_VEHICLE: Record<string, string> = { tram: 'Kloubová tramvaj', bus: 'EV-Solo', trolley: 'Trolejbus' };
const TYPE_COLOR = { tram: '#fb8a00', bus: '#10a4ff', trolley: '#22c55e' };
const TYPE_ICONS = {
  tram: <TramIcon sx={{ fontSize: 20 }} />,
  bus: <DirectionsBusIcon sx={{ fontSize: 20 }} />,
  trolley: <ElectricBoltIcon sx={{ fontSize: 20 }} />,
};

export const FleetStatusPage: React.FC = () => {
  const units = useFleetStore((s) => s.units);
  const tickLive = useFleetStore((s) => s.tickLive);
  const [filter, setFilter] = useState<'all' | 'tram' | 'bus' | 'trolley'>('all');

  useEffect(() => {
    const interval = setInterval(tickLive, 3000);
    return () => clearInterval(interval);
  }, [tickLive]);

  const filtered = filter === 'all' ? units : units.filter((u) => u.type === filter);

  const tramCount = units.filter((u) => u.type === 'tram').length;
  const busCount = units.filter((u) => u.type === 'bus').length;
  const trolleyCount = units.filter((u) => u.type === 'trolley').length;
  const maintCount = units.filter((u) => u.maintenanceStatus !== 'optimal').length;

  const columns: GridColDef[] = [
    {
      field: 'id', headerName: 'Unit ID / Linka', flex: 1.4,
      renderCell: (params) => {
        const unit = params.row as FleetUnit;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, height: '100%' }}>
            <Box sx={{ width: 3, height: 36, bgcolor: TYPE_COLOR[unit.type], borderRadius: 0.5, flexShrink: 0 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{unit.id}</Typography>
              <Typography variant="caption" color="text.secondary">{unit.line}</Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'vehicleType', headerName: 'Type', flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            fontSize: 10,
            fontWeight: 700,
            borderRadius: 1,
            height: 20,
            bgcolor: 'background.default',
            textTransform: 'uppercase',
          }}
        />
      ),
    },
    {
      field: 'chargeFuel', headerName: 'Charge / Fuel', flex: 1.2,
      renderCell: (params) => {
        const unit = params.row as FleetUnit;
        const pct = unit.chargeFuel;
        const color = pct <= 20 ? 'error.main' : '#22c55e';
        return (
          <Box sx={{ width: '100%', pr: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color, fontWeight: 700 }}>{pct}%</Typography>
              {pct <= 20 ? <BatteryAlertIcon sx={{ fontSize: 14, color }} /> : <BoltIcon sx={{ fontSize: 14, color }} />}
            </Box>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: 'background.default',
                '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 2 }
              }}
            />
          </Box>
        );
      },
    },
    {
      field: 'latencyMs', headerName: 'Latency', flex: 0.6,
      renderCell: (params) => {
        const ms = params.value as number;
        return (
          <Typography sx={{ fontFamily: 'monospace', fontSize: 13, color: ms > 100 ? 'error.main' : 'inherit', display: 'flex', alignItems: 'center', height: '100%' }}>
            {ms}<Typography component="span" sx={{ color: 'text.secondary', fontSize: 11, ml: 0.25 }}>ms</Typography>
          </Typography>
        );
      },
    },
    {
      field: 'maintenanceStatus', headerName: 'Maintenance Status', flex: 1.4,
      renderCell: (params) => {
        const cfg = STATUS_CONFIG[params.value as keyof typeof STATUS_CONFIG];
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: cfg.color }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: cfg.color, textTransform: 'uppercase' }}>
              {cfg.label}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'actions', headerName: 'Control', flex: 0.8, sortable: false,
      renderCell: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<LocationOnIcon sx={{ fontSize: 14 }} />}
            sx={{
              fontSize: 10,
              fontWeight: 700,
              borderRadius: 2,
              px: 1,
              color: 'text.secondary',
              borderColor: 'divider',
            }}
          >
            Locate
          </Button>
        </Box>
      ),
    },
  ];

  const rows = filtered.map((u) => ({ ...u, vehicleType: TYPE_VEHICLE[u.type] || u.vehicleType, actions: '' }));

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'background.default', p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>Fleet Registry</Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time telemetrics pro všechna aktivní vozidla v plzeňském sektoru.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'text.secondary', fontWeight: 700, letterSpacing: '0.1em' }}>Total Active</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', lineHeight: 1 }}>{units.length * 14}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'text.secondary', fontWeight: 700, letterSpacing: '0.1em' }}>Avg. Latency</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'info.main', lineHeight: 1 }}>
              {Math.round(units.reduce((a, u) => a + u.latencyMs, 0) / units.length)}ms
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { type: 'tram', label: 'Tramvaje', value: `${tramCount * 3} / ${tramCount * 3 + 2}`, color: '#fb8a00', sub: '94%' },
          { type: 'bus', label: 'Autobusy', value: `${busCount * 3} / ${busCount * 3}`, color: '#10a4ff', sub: '98%' },
          { type: 'trolley', label: 'Trolejbusy', value: `${trolleyCount * 7} / ${trolleyCount * 7}`, color: '#22c55e', sub: 'MAX' },
          { type: 'maint', label: 'Maint. Req.', value: String(maintCount).padStart(2,'0'), color: 'info.main', sub: 'Immediate', icon: <EngineeringIcon /> },
        ].map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
            <Paper
              sx={{
                p: 2.5,
                bgcolor: 'background.paper',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <Box sx={{ color: card.color === 'info.main' ? 'info.main' : card.color, mb: 1 }}>
                {card.type === 'maint' ? card.icon : TYPE_ICONS[card.type as keyof typeof TYPE_ICONS]}
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary', mb: 0.5, display: 'block' }}>
                {card.label}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>{card.value}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#22c55e' }}>{card.sub}</Typography>
              </Box>
              {/* BG icon */}
              <Box sx={{ position: 'absolute', right: '-10%', bottom: '-20%', fontSize: 100, opacity: 0.04, color: 'text.primary' }}>
                {card.type === 'maint' ? (
                  <EngineeringIcon sx={{ fontSize: 100 }} />
                ) : card.type === 'tram' ? (
                  <TramIcon sx={{ fontSize: 100 }} />
                ) : card.type === 'bus' ? (
                  <DirectionsBusIcon sx={{ fontSize: 100 }} />
                ) : (
                  <ElectricBoltIcon sx={{ fontSize: 100 }} />
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* DataGrid */}
      <Paper sx={{ bgcolor: 'background.paper', borderRadius: 4, overflow: 'hidden', mb: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
        <Box sx={{ p: '12px 20px', bgcolor: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs
            value={filter}
            onChange={(_, val) => setFilter(val)}
            sx={{
              minHeight: 'auto',
              '& .MuiTab-root': {
                minHeight: 'auto',
                py: 0.5,
                fontSize: 11,
                fontWeight: 700,
                color: 'text.secondary',
              }
            }}
          >
            <Tab value="all" label="Vše" />
            <Tab value="tram" label="Tramvaje" />
            <Tab value="bus" label="Autobusy" />
            <Tab value="trolley" label="Trolejbusy" />
          </Tabs>
          <Box sx={{ display: 'flex', gap: 1.5, color: 'text.secondary' }}>
            <IconButton size="small" color="inherit"><FilterListIcon sx={{ fontSize: 18 }} /></IconButton>
            <IconButton size="small" color="inherit"><DownloadIcon sx={{ fontSize: 18 }} /></IconButton>
          </Box>
        </Box>

        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'transparent',
              borderBottom: 1,
              borderColor: 'divider',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              fontSize: 13,
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: 'rgba(16, 164, 255, 0.04) !important',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: 1,
              borderColor: 'divider',
            },
          }}
        />
      </Paper>

      {/* Bottom */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2.5, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="overline" sx={{ fontWeight: 900, mb: 2, display: 'block' }}>Real-Time Distribution Map</Typography>
            <Box sx={{
              height: 200,
              bgcolor: 'background.default',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
              fontSize: 12,
              border: 1,
              borderColor: 'divider'
            }}>
              <MapIcon sx={{ fontSize: 40, opacity: 0.2, mr: 1 }} />
              Minimap – zobrazí se po spuštění Fleet Radar modulu
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper sx={{ p: 2.5, bgcolor: 'background.paper', borderRadius: 3, borderLeft: 4, borderColor: 'primary.main', border: '1px solid rgba(255,255,255,0.05)', borderLeftWidth: 4, borderLeftColor: 'primary.main' }}>
              <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', mb: 1.5, display: 'block' }}>Network Health</Typography>
              {[
                { label: 'Communication Uplink', value: 'STABLE', color: '#22c55e' },
                { label: 'GPS Synchronization', value: '99.8%', color: '#22c55e' },
                { label: 'Remote Diagnostics', value: '4 WARNINGS', color: 'info.main' }
              ].map((item) => (
                <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.25 }}>
                  <Typography sx={{ fontSize: 12 }}>{item.label}</Typography>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: item.color === 'info.main' ? 'info.main' : item.color }}>{item.value}</Typography>
                </Box>
              ))}
              <Button fullWidth variant="contained" size="small" sx={{ mt: 1, bgcolor: 'background.default', color: 'text.primary', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                Full System Log
              </Button>
            </Paper>
            <Paper className="glass-panel" sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(0, 26, 55, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(16, 164, 255, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CloudQueueIcon sx={{ fontSize: 16, color: 'info.main' }} />
                <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary' }}>Ambient Conditions</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
                14°C <Typography component="span" sx={{ fontSize: 12, fontWeight: 400, color: 'text.secondary' }}>Light Rain</Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Impact on braking distances: <Typography component="span" sx={{ color: 'info.main', fontWeight: 700 }}>+12%</Typography>
              </Typography>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
