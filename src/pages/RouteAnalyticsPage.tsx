import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Co2Icon from '@mui/icons-material/Co2';
import BoltIcon from '@mui/icons-material/Bolt';
import GroupIcon from '@mui/icons-material/Group';

const VOLUME_DATA = [
  { time: '06:00', value: 1200, label: '06:00' },
  { time: '07:00', value: 2800, label: '07:00' },
  { time: '08:00', value: 4200, label: '08:00' },
  { time: '09:00', value: 5800, label: '09:00 (PEAK)' },
  { time: '10:00', value: 3200, label: '10:00' },
  { time: '12:00', value: 2600, label: '12:00' },
  { time: '14:00', value: 3100, label: '14:00' },
  { time: '15:00', value: 5200, label: '15:00' },
  { time: '16:00', value: 4900, label: '16:00' },
  { time: '18:00', value: 2800, label: '18:00' },
  { time: '21:00', value: 1100, label: '21:00' },
];

const ROUTES = [
  { id: 'L-410', name: 'L-410 (Bory)', mode: 'Tramvaj', status: 'Optimal', statusType: 'ok', load: 84, delay: '+0:45s' },
  { id: 'L-201', name: 'L-201 (Skvrňany)', mode: 'Trolejbus', status: 'Delayed', statusType: 'warn', load: 112, delay: '+12:15m' },
  { id: 'L-012', name: 'L-012 (Centrum)', mode: 'Autobus', status: 'Optimal', statusType: 'ok', load: 42, delay: '-1:20s' },
  { id: 'L-048', name: 'L-048 (Lochotín)', mode: 'Autobus', status: 'Optimal', statusType: 'ok', load: 67, delay: '+0:10s' },
  { id: 'L-002', name: 'L-002 (Bolevec)', mode: 'Tramvaj', status: 'Delayed', statusType: 'warn', load: 98, delay: '+4:30m' },
];

const PEAK_LINES = [
  { name: 'Trolejbus Linka 12', pct: 94, color: 'info.main' },
  { name: 'Tramvaj Linka 4', pct: 78, color: 'primary.main' },
  { name: 'Autobus Linka 30', pct: 62, color: 'primary.main' },
];

export const RouteAnalyticsPage: React.FC = () => {
  const [totalVolume, setTotalVolume] = useState(42891);
  const [filter, setFilter] = useState<'trams' | 'buses'>('trams');

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalVolume((v) => v + Math.floor(Math.random() * 100 - 40));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'background.default', p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5 }}>
        <Box>
          <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', mb: 1, display: 'block' }}>
            System Performance Matrix
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>Route Analytics</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
            Live stream analýza objemu cestujících a efektivity tras na primárních koridorech Plzně.
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, justifyContent: 'flex-end', mb: 1 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'info.main' }} />
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'info.main' }}>
              Live Updates Active
            </Typography>
          </Box>
          <Paper sx={{ bgcolor: 'background.paper', borderRadius: 3, p: '8px 16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', display: 'block' }}>Total Volume</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main' }}>
              {totalVolume.toLocaleString('cs-CZ')} <Typography component="span" sx={{ fontSize: 11, fontWeight: 400, color: 'text.secondary' }}>/hr</Typography>
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Bento grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Passenger Volume Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ bgcolor: 'background.paper', borderRadius: 4, p: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Objem cestujících</Typography>
                <Typography variant="caption" color="text.secondary">Porovnání toku Autobusy vs Tramvaje</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {(['trams', 'buses'] as const).map((f) => (
                  <Button
                    key={f}
                    onClick={() => setFilter(f)}
                    variant={filter === f ? 'contained' : 'text'}
                    size="small"
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      bgcolor: filter === f ? 'primary.main' : 'rgba(255,255,255,0.05)',
                      color: filter === f ? 'primary.contrastText' : 'text.secondary',
                      '&:hover': { bgcolor: filter === f ? 'primary.dark' : 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    {f === 'trams' ? 'TRAMVAJE' : 'AUTOBUSY'}
                  </Button>
                ))}
              </Box>
            </Box>
            <Box sx={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={VOLUME_DATA}>
                  <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94acd3' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#001a37', border: '1px solid rgba(16, 164, 255, 0.2)', borderRadius: 8, fontSize: 11 }}
                    labelStyle={{ color: '#94acd3', fontWeight: 700 }}
                    itemStyle={{ color: '#10a4ff' }}
                  />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                    {VOLUME_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.time === '09:00' || entry.time === '15:00' ? '#10a4ff' : 'rgba(16, 164, 255, 0.2)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Peak Efficiency */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ bgcolor: 'background.paper', borderRadius: 4, p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Peak Efficiency</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>Aktuální metriky saturace linek</Typography>
              {PEAK_LINES.map((line) => (
                <Box key={line.name} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{line.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: line.color }}>{line.pct}% Kapacity</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={line.pct}
                    sx={{
                      height: 5,
                      borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '& .MuiLinearProgress-bar': { bgcolor: line.color, borderRadius: 3 }
                    }}
                  />
                </Box>
              ))}
            </Box>
            <Button
              color="primary"
              endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
              sx={{ justifyContent: 'flex-start', fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', p: 0 }}
            >
              View Expansion Plan
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Live Route Diagnostics table */}
      <Paper sx={{ bgcolor: 'background.paper', borderRadius: 4, overflow: 'hidden', mb: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '14px 24px', bgcolor: 'rgba(255,255,255,0.02)' }}>
          <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.15em' }}>
            Live Route Diagnostics
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary' }}>
            <IconButton size="small" color="inherit"><FilterListIcon sx={{ fontSize: 18 }} /></IconButton>
            <IconButton size="small" color="inherit"><DownloadIcon sx={{ fontSize: 18 }} /></IconButton>
          </Box>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Route ID', 'Mode', 'Status', 'Avg Load', 'Latency', 'Action'].map((h) => (
                  <TableCell key={h} sx={{ color: 'text.secondary', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', py: 1.5 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {ROUTES.map((route, i) => (
                <TableRow key={route.id} hover sx={{ bgcolor: i % 2 === 1 ? 'rgba(255,255,255,0.01)' : 'transparent', '&:last-child td': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 700, borderLeft: route.statusType === 'warn' ? 2 : 2, borderLeftColor: route.statusType === 'warn' ? 'info.main' : 'transparent' }}>
                    {route.name}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{route.mode}</TableCell>
                  <TableCell>
                    <Chip
                      label={route.status}
                      size="small"
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        height: 20,
                        bgcolor: route.statusType === 'ok' ? 'rgba(16, 164, 255, 0.1)' : 'rgba(130, 100, 206, 0.1)',
                        color: route.statusType === 'ok' ? 'primary.main' : 'info.main',
                        borderRadius: 10,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: route.load > 100 ? 'info.main' : 'inherit' }}>{route.load}%</TableCell>
                  <TableCell sx={{ color: route.delay.startsWith('+12') ? 'info.main' : 'text.secondary' }}>{route.delay}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="inherit"><MoreVertIcon sx={{ fontSize: 18 }} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Bottom insight cards */}
      <Grid container spacing={2}>
        {[
          { icon: <Co2Icon />, color: 'primary.main', bg: 'rgba(16, 164, 255, 0.1)', label: 'Emission Reduction', value: '12.4 Tons', desc: 'System-wide shift to electric trolleybuses has reduced carbon output by 4% this quarter.' },
          { icon: <BoltIcon />, color: 'info.main', bg: 'rgba(130, 100, 206, 0.1)', label: 'Energy Consumption', value: '842 MWh', desc: 'Peak demand reached at 08:45 AM. Smart grid management diverted 15% load to reserves.' },
          { icon: <GroupIcon />, color: '#009af0', bg: 'rgba(0,154,240,0.1)', label: 'Citizen Satisfaction', value: '4.8 / 5.0', desc: 'Based on 12,400 app check-ins. Reliability rating is at an all-time historical high.' },
        ].map((card) => (
          <Grid size={{ xs: 12, md: 4 }} key={card.label}>
            <Paper sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 2.5, height: '100%', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box sx={{ width: 36, height: 36, bgcolor: card.bg, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', display: 'block' }}>{card.label}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 900 }}>{card.value}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5, display: 'block' }}>{card.desc}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
