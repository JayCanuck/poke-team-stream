import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback } from 'react';
import { useTeam } from '../hooks/use-team';

const valueText = (value: number) => {
  return `${value}%`;
};

export const RosterControls: React.FC = () => {
  const [{ spacing, stagger }, { updateSpacing, updateStagger }] = useTeam();
  const changeSpacing = useCallback(
    (_ev: Event, value: number | number[]) => updateSpacing(value as number),
    [updateSpacing]
  );
  const changeStagger = useCallback(
    (_ev: Event, value: number | number[]) => updateStagger(value as number),
    [updateStagger]
  );

  return (
    <Stack spacing={2} direction='row' alignItems='center' justifyContent='center' mb={1}>
      <Box width='30%'>
        <Typography sx={{ userSelect: 'none', textAlign: 'center' }}>Spacing Factor</Typography>
        <Slider valueLabelDisplay='auto' value={spacing} step={0.1} min={0} max={6} onChange={changeSpacing} />
      </Box>
      <Box width='30%'>
        <Typography sx={{ userSelect: 'none', textAlign: 'center' }}>Stagger</Typography>
        <Slider
          valueLabelDisplay='auto'
          valueLabelFormat={valueText}
          min={-100}
          step={5}
          max={100}
          value={stagger}
          onChange={changeStagger}
        />
      </Box>
    </Stack>
  );
};
