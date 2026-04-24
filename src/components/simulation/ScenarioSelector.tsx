import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import type { SimulationScenario } from "../../types/transit"

interface ScenarioSelectorProps {
  scenarios: SimulationScenario[];
  selectedId: string;
  onSelect: (scenario: SimulationScenario) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ scenarios, selectedId, onSelect }) => {
  return (
    <Box className="space-y-3">
      <Typography variant="overline" className="font-black text-gray-500 tracking-widest">
        Select Scenario
      </Typography>
      <Box className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {scenarios.map((s) => (
          <Paper
            key={s.id}
            onClick={() => onSelect(s)}
            elevation={0}
            className={`p-4 cursor-pointer border-2 transition-all duration-200 rounded-xl ${
              selectedId === s.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-white/5 bg-white/5 hover:bg-white/10'
            }`}
          >
            <Typography variant="subtitle2" className="font-bold">
              {s.name}
            </Typography>
            <Typography variant="caption" className="text-gray-400 block mt-1">
              {s.target}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};
