import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useCallback } from 'react';
import { useTeam } from '../hooks/use-team';

const StyledSlider = styled(Slider)`
  .MuiSlider-valueLabelOpen {
    z-index: 3;
  }
`;

const valueText = (value: number) => {
  return `Scale: ${value}%`;
};

export const MemberControls: React.FC = () => {
  const [{ scales }, { updateScale }] = useTeam();
  const changeValue = useCallback(
    (index: number) => (_ev: Event, value: number | number[]) => updateScale(index, value as number),
    [updateScale]
  );

  return (
    <Stack spacing={2} direction='row' alignItems='center' my={2}>
      {scales.map((value, i) => (
        <StyledSlider
          key={`member-scale-${i}`}
          value={value}
          valueLabelDisplay='auto'
          valueLabelFormat={valueText}
          step={5}
          min={0}
          max={200}
          onChange={changeValue(i)}
        />
      ))}
    </Stack>
  );
};
