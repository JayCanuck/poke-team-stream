import Button, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useTeam } from '../hooks/use-team';

const ResetButtonBase = styled(Button)`
  float: right;
`;

export const ResetButton: React.FC<Omit<ButtonProps, 'onClick'>> = props => {
  const [, { reset }] = useTeam();

  return (
    <ResetButtonBase onClick={reset} {...props}>
      Reset
    </ResetButtonBase>
  );
};
