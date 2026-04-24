import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Switch,
  TextField,
  Slider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LayersIcon from '@mui/icons-material/Layers';
import PaletteIcon from '@mui/icons-material/Palette';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SecurityIcon from '@mui/icons-material/Security';
import DangerousIcon from '@mui/icons-material/Dangerous';
import PublishIcon from '@mui/icons-material/Publish';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import TrafficIcon from '@mui/icons-material/Traffic';
import ThreedRotationIcon from '@mui/icons-material/ThreeDRotation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppStore } from '../store/appStore';
import type { BasemapLayerConfig } from '../types/transit.ts';

const ADMIN_USERS = [
  { id: 1, name: 'Erik Hoffmann', email: 'e.hoffmann@pilsen.pulse', role: 'Lead Operator', badge: 'primary', lastLogin: 'Právě teď', permissions: ['shield', 'data_usage'] },
  { id: 2, name: 'Sofia Belous', email: 's.belous@pilsen.pulse', role: 'Network Analyst', badge: 'neutral', lastLogin: '2h ago', permissions: ['analytics'] },
  { id: 3, name: 'Karel Dušek', email: 'k.dusek@pilsen.pulse', role: 'Dispatcher', badge: 'neutral', lastLogin: '5h ago', permissions: ['map'] },
];

const AUDIT_LOG = [
  { time: '14:22', action: 'OSRM Endpoint Modified', detail: 'Updated by Admin pilsen_ctrl_01' },
  { time: '11:05', action: 'New User Invite Sent', detail: 'Target: s.belous@pilsen.pulse' },
  { time: '08:45', action: 'System Maintenance Reboot', detail: 'Auto-scheduled execution success' },
  { time: '07:30', action: 'Map Layer Config Updated', detail: 'Heatmap intensity changed to HIGH' },
];

export const SettingsPage: React.FC = () => {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const colors = useAppStore((s) => s.colors);
  const setColors = useAppStore((s) => s.setColors);
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);

  const [saved, setSaved] = useState(false);

  const handleBasemapFieldChange = (id: string, field: 'url' | 'attribution', value: string) => {
    const nextLayers = settings.basemapLayers.map((layer) =>
      layer.id === id ? { ...layer, [field]: value } : layer
    );
    updateSettings({ basemapLayers: nextLayers });
  };

  const handleBasemapAdd = () => {
    const newLayer: BasemapLayerConfig = {
      id: `custom-${Date.now()}`,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    };

    updateSettings({
      basemapLayers: [...settings.basemapLayers, newLayer],
      activeBasemapId: newLayer.id,
    });
  };

  const handleBasemapRemove = (id: string) => {
    if (settings.basemapLayers.length <= 1) return;

    const nextLayers = settings.basemapLayers.filter((layer) => layer.id !== id);
    updateSettings({
      basemapLayers: nextLayers,
      activeBasemapId: settings.activeBasemapId === id ? nextLayers[0].id : settings.activeBasemapId,
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'background.default', p: 4 }}>
      <Box sx={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: -1 }}>Command Parameters</Typography>
            <Typography variant="body2" color="text.secondary">
              Adjust core infrastructure and administrative controls for the Pilsen network.
            </Typography>
          </Box>
          <Button
            id="deploy-changes-btn"
            onClick={handleSave}
            variant="contained"
            color="primary"
            startIcon={<PublishIcon />}
            sx={{
              px: 3, py: 1.25, borderRadius: 3, fontWeight: 700,
              boxShadow: '0 8px 16px rgba(16, 164, 255, 0.2)',
            }}
          >
            {saved ? '✓ Uloženo' : 'Deploy Changes'}
          </Button>
        </Box>

        <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
          {/* OSRM Engine Config */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ bgcolor: 'background.paper', borderRadius: 4, p: 3.5, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.04 }}>
                <CloudSyncIcon sx={{ fontSize: 160 }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
                <CloudSyncIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>OSRM Engine Configuration</Typography>
              </Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={6}>
                  <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>Production Endpoint</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={settings.osrmEndpoint}
                    onChange={(e) => updateSettings({ osrmEndpoint: e.target.value })}
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid size={6}>
                  <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>API Access Key</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    defaultValue="••••••••••••••••••••"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <IconButton size="small" sx={{ color: 'text.secondary' }}>
                            <VisibilityIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        )
                      }
                    }}
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={1.5}>
                {[
                  { label: 'Query Timeout', value: settings.osrmTimeout, unit: 'ms', key: 'osrmTimeout', min: 100, max: 5000 },
                  { label: 'Max Waypoints', value: settings.maxWaypoints, unit: 'stops', key: 'maxWaypoints', min: 2, max: 50 },
                ].map((s) => (
                  <Grid size={4} key={s.label}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.03)' }}>
                      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>{s.label}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1.5 }}>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main' }}>{s.value}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.unit}</Typography>
                      </Box>
                      <Slider
                        size="small"
                        min={s.min}
                        max={s.max}
                        value={s.value}
                        onChange={(_, val) => updateSettings({ [s.key]: Number(val) } as any)}
                      />
                    </Paper>
                  </Grid>
                ))}
                <Grid size={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.03)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>Retry Logic</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2">{settings.retryLogic ? 'Exponential' : 'None'}</Typography>
                      <Switch
                        size="small"
                        checked={settings.retryLogic}
                        onChange={(e) => updateSettings({ retryLogic: e.target.checked })}
                      />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right column: Visual Layers */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ bgcolor: 'background.paper', borderRadius: 4, p: 3, height: '100%', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                <LayersIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16 }}>Visual Layers</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { label: 'Heatmap Intensity', key: 'showHeatmap', icon: <TrafficIcon sx={{ fontSize: 16 }} /> },
                  { label: '3D Terrain Render', key: 'show3dTerrain', icon: <ThreedRotationIcon sx={{ fontSize: 16 }} /> },
                  { label: 'Bus Stop Density', key: 'showStopDensity', icon: <LocationOnIcon sx={{ fontSize: 16 }} /> },
                ].map((layer) => (
                  <Paper key={layer.key} elevation={0} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: 'text.secondary', display: 'flex' }}>{layer.icon}</Box>
                      <Typography variant="body2" sx={{ fontSize: 13 }}>{layer.label}</Typography>
                    </Box>
                    <Switch
                      size="small"
                      checked={settings[layer.key as keyof typeof settings] as boolean}
                      onChange={(e) => updateSettings({ [layer.key]: e.target.checked } as any)}
                    />
                  </Paper>
                ))}
              </Box>
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.05)' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {isDarkMode ? <DarkModeIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> : <LightModeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
                  <Typography variant="body2" sx={{ fontSize: 13 }}>{isDarkMode ? 'Tmavý režim' : 'Světlý režim'}</Typography>
                </Box>
                <Switch size="small" checked={isDarkMode} onChange={toggleDarkMode} />
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2, display: 'block' }}>Last updated: 14:02 PM</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ bgcolor: 'background.paper', borderRadius: 4, p: 3.5, mb: 2.5, border: '1px solid rgba(255,255,255,0.05)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Basemap Layers</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Configure global map tile URL and attribution. Selected layer is used on all maps.
              </Typography>
            </Box>
            <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={handleBasemapAdd} sx={{ borderRadius: 2 }}>
              Add Layer
            </Button>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 0.75 }}>
                Active Basemap
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={settings.activeBasemapId}
                onChange={(e) => updateSettings({ activeBasemapId: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                {settings.basemapLayers.map((layer, index) => (
                  <MenuItem key={layer.id} value={layer.id}>Layer {index + 1}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {settings.basemapLayers.map((layer, index) => (
              <Paper key={layer.id} elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.25 }}>
                  <Typography variant="overline" sx={{ color: 'text.secondary' }}>Layer {index + 1}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleBasemapRemove(layer.id)}
                    disabled={settings.basemapLayers.length <= 1}
                    sx={{ color: 'text.secondary' }}
                  >
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
                <Grid container spacing={1.25}>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Tile URL"
                      value={layer.url}
                      onChange={(e) => handleBasemapFieldChange(layer.id, 'url', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Attribution"
                      value={layer.attribution}
                      onChange={(e) => handleBasemapFieldChange(layer.id, 'attribution', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        </Paper>

        {/* Color Theme Configurator */}
        <Paper sx={{ bgcolor: 'background.paper', borderRadius: 4, p: 3.5, mb: 2.5, border: '1px solid rgba(255,255,255,0.05)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
            <PaletteIcon sx={{ color: 'info.main', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Color Theme Configurator</Typography>
          </Box>
          <Grid container spacing={2}>
            {[
              { label: 'Primary Color', key: 'primary', value: colors.primary },
              { label: 'Secondary Color', key: 'secondary', value: colors.secondary },
              { label: 'Tertiary / Accent', key: 'tertiary', value: colors.tertiary },
            ].map((c) => (
              <Grid size={4} key={c.key}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.03)' }}>
                  <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>{c.label}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                    <input
                      id={`color-${c.key}`}
                      type="color"
                      value={c.value}
                      onChange={(e) => setColors({ [c.key]: e.target.value })}
                      style={{ width: 40, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', padding: 2, background: 'none' }}
                    />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>{c.value}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2, display: 'block', opacity: 0.7 }}>
            Barvy se uloží do prohlížeče a aplikují se na celou aplikaci v reálném čase.
          </Typography>
        </Paper>

        {/* Admin Access Control */}
        <Paper sx={{ bgcolor: 'background.paper', borderRadius: 4, p: 3.5, mb: 2.5, border: '1px solid rgba(255,255,255,0.05)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <GroupIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Administrator Access Control</Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<PersonAddIcon />}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', color: 'text.primary', borderRadius: 2, px: 2, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              Invite Administrator
            </Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  {['Member', 'Role', 'Permissions', 'Last Login'].map((h) => (
                    <TableCell key={h} sx={{ color: 'text.secondary', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', py: 1.5 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {ADMIN_USERS.map((user) => (
                  <TableRow key={user.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
                          <PersonIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        sx={{
                          fontSize: 10, fontWeight: 900, textTransform: 'uppercase', borderRadius: 1, height: 20,
                          bgcolor: user.badge === 'primary' ? 'rgba(16, 164, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          color: user.badge === 'primary' ? 'primary.main' : 'text.secondary',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, color: 'text.secondary' }}>
                        {user.permissions.map((p) => (
                          <Tooltip key={p} title={p}><Box sx={{ display: 'flex' }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>{p}</span></Box></Tooltip>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{user.lastLogin}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {/* Signal Thresholds */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ bgcolor: 'background.paper', borderRadius: 4, p: 3.5, height: '100%', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
                <NotificationsActiveIcon sx={{ color: 'info.main', fontSize: 18 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16 }}>Signal Thresholds</Typography>
              </Box>
              {[
                { label: 'Critical Delay Warning', value: settings.criticalDelayMin, key: 'criticalDelayMin', unit: '+ min', max: 30, color: 'info.main' },
                { label: 'Network Overload Alert', value: settings.networkOverloadPct, key: 'networkOverloadPct', unit: '% capacity', max: 100, color: 'primary.main' },
              ].map((s) => (
                <Box key={s.label} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{s.label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: s.color }}>{s.value}{s.unit}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(s.value / s.max) * 100}
                    sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.05)', mb: 1.5, '& .MuiLinearProgress-bar': { bgcolor: s.color } }}
                  />
                  <Slider
                    size="small"
                    min={0}
                    max={s.max}
                    value={s.value}
                    onChange={(_, val) => updateSettings({ [s.key]: Number(val) } as any)}
                    sx={{ color: s.color }}
                  />
                </Box>
              ))}
              <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'rgba(130, 100, 206, 0.05)', borderRadius: 2, borderLeft: 3, borderColor: 'info.main' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                  System will automatically trigger "Red-Line Protocol" if more than 5 routes experience simultaneous critical delays.
                </Typography>
              </Paper>
            </Paper>
          </Grid>

          {/* Audit Logging */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ bgcolor: 'background.paper', borderRadius: 4, p: 3.5, height: '100%', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
                <SecurityIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16 }}>Audit Logging</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {AUDIT_LOG.map((entry, idx) => (
                  <Box key={entry.time} sx={{ display: 'flex', gap: 2, py: 1.5, borderBottom: idx === AUDIT_LOG.length - 1 ? 0 : 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 32, mt: 0.25 }}>{entry.time}</Typography>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{entry.action}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{entry.detail}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button size="small" endIcon={<DownloadIcon />} sx={{ fontWeight: 900, letterSpacing: '0.1em', fontSize: 10 }}>
                  Export Full Log
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Danger Zone */}
        <Paper sx={{ p: 3.5, bgcolor: 'rgba(159, 5, 25, 0.06)', borderRadius: 4, border: '1px solid rgba(255, 113, 108, 0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <DangerousIcon sx={{ fontSize: 20, color: 'error.main' }} />
                <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 700, fontSize: 16 }}>Danger Zone</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Irreversible infrastructure actions. Proceed with absolute caution.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button variant="outlined" color="error" size="small" sx={{ borderRadius: 2, fontWeight: 700, borderColor: 'rgba(255, 113, 108, 0.4)' }}>
                Purge Global Cache
              </Button>
              <Button variant="contained" color="error" size="small" sx={{ borderRadius: 2, fontWeight: 700, boxShadow: '0 4px 16px rgba(255, 113, 108, 0.3)' }}>
                Reset Pulse System
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
